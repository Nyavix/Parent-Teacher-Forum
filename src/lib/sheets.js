import { google } from "googleapis";

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

const SHEET_NAME = "Bookings";
const HEADERS = [
  "Timestamp",
  "Teacher ID",
  "Teacher Name",
  "Slot ID",
  "Slot Label",
  "Parent Name",
  "Child Name",
  "Email",
  "Phone",
];

async function ensureSheetExists(sheets, spreadsheetId) {
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = res.data.sheets?.some(
      (s) => s.properties?.title === SHEET_NAME
    );

    if (!sheetExists) {
      // Add the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: SHEET_NAME },
              },
            },
          ],
        },
      });

      // Add header row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:I1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [HEADERS],
        },
      });

      // Style header row (bold + background color)
      const sheetRes = await sheets.spreadsheets.get({ spreadsheetId });
      const newSheet = sheetRes.data.sheets?.find(
        (s) => s.properties?.title === SHEET_NAME
      );
      const sheetId = newSheet?.properties?.sheetId;

      if (sheetId !== undefined) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: HEADERS.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 0.753,
                        green: 0.224,
                        blue: 0.169,
                      },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 1, green: 1, blue: 1 },
                      },
                    },
                  },
                  fields:
                    "userEnteredFormat(backgroundColor,textFormat)",
                },
              },
              {
                updateDimensionProperties: {
                  range: {
                    sheetId,
                    dimension: "COLUMNS",
                    startIndex: 0,
                    endIndex: HEADERS.length,
                  },
                  properties: { pixelSize: 150 },
                  fields: "pixelSize",
                },
              },
            ],
          },
        });
      }
    }
  } catch (error) {
    console.error("Error ensuring sheet exists:", error);
    throw error;
  }
}

export async function getBookedSlots(teacherId) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  await ensureSheetExists(sheets, spreadsheetId);

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:I`,
    });

    const rows = res.data.values || [];
    // Skip header row, filter by teacher ID, return slot IDs
    return rows
      .slice(1)
      .filter((row) => row[1] === teacherId)
      .map((row) => row[3]); // Slot ID column
  } catch (error) {
    console.error("Error getting booked slots:", error);
    return [];
  }
}

export async function bookSlot(data) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  await ensureSheetExists(sheets, spreadsheetId);

  // Double-booking protection: check if slot is already taken
  const bookedSlots = await getBookedSlots(data.teacherId);
  if (bookedSlots.includes(data.slotId)) {
    return { success: false, error: "SLOT_TAKEN" };
  }

  // Write the booking
  const timestamp = new Date().toISOString();
  const row = [
    timestamp,
    data.teacherId,
    data.teacherName,
    data.slotId,
    data.slotLabel,
    data.parentName,
    data.childName,
    data.email,
    data.phone,
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error booking slot:", error);
    return { success: false, error: "WRITE_FAILED" };
  }
}

export async function getAllBookings() {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  await ensureSheetExists(sheets, spreadsheetId);

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:I`,
    });

    const rows = res.data.values || [];
    if (rows.length <= 1) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return obj;
    });
  } catch (error) {
    console.error("Error getting all bookings:", error);
    return [];
  }
}
