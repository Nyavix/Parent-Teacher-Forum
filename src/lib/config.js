// ============================================
// PARENT-TEACHER CONFERENCE CONFIGURATION
// Edit this file to update school info, teachers, and conference date
// ============================================

export const SCHOOL = {
  name: "Alvin A. McKay Elementary School",
  phone: "+1-250-621-3277",
  email: "school_aames@nisgaa.bc.ca",
  logo: "https://i.postimg.cc/J4T8LPGC/nisgaa-icon-banner-aames.png",
};

// Conference date — update this each year/term
export const CONFERENCE_DATE = "2026-04-16"; // YYYY-MM-DD format

export const TEACHERS = [
  {
    id: "elliott",
    name: "Mr. Jonah Elliott",
    grades: "Kindergarten & Grade 1",
    initials: "JE",
    color: "#c0392b",
  },
  {
    id: "mckay",
    name: "Mrs. Jessica McKay",
    grades: "Grade 2 & 3",
    initials: "JM",
    color: "#2980b9",
  },
  {
    id: "newman",
    name: "Ms. Lois Newman",
    grades: "Grade 4 & 5",
    initials: "LN",
    color: "#27ae60",
  },
  {
    id: "carmichael",
    name: "Mr. Eathel Carmichael",
    grades: "Grade 5, 6 & 7",
    initials: "EC",
    color: "#8e44ad",
  },
];

// Generate time slots: 5:00 PM – 7:00 PM in 10-minute intervals
export function generateTimeSlots() {
  const slots = [];
  const startHour = 17; // 5:00 PM in 24-hour
  const endHour = 19; // 7:00 PM in 24-hour
  const intervalMinutes = 10;

  let slotIndex = 0;
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const startTime = formatTime(hour, minute);
      const endMinute = minute + intervalMinutes;
      const endH = endMinute >= 60 ? hour + 1 : hour;
      const endM = endMinute >= 60 ? endMinute - 60 : endMinute;
      const endTime = formatTime(endH, endM);

      slots.push({
        id: `slot-${slotIndex}`,
        label: `${startTime} – ${endTime}`,
        startTime,
        endTime,
      });
      slotIndex++;
    }
  }
  return slots;
}

function formatTime(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

export function getTeacherById(id) {
  return TEACHERS.find((t) => t.id === id) || null;
}

export function formatConferenceDate() {
  const date = new Date(CONFERENCE_DATE + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
