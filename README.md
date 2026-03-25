# Alvin A. McKay Elementary — Parent-Teacher Conference Booking

A Next.js web app for parents to book 10-minute conference slots with their child's teacher. Bookings are stored in Google Sheets.

## Features

- **4 teacher cards** with live availability counts
- **12 time slots** per teacher (5:00 PM – 7:00 PM, 10-min intervals)
- **Double-booking protection** enforced server-side
- **Google Sheets** backend (no database needed)
- **Admin view** at `/admin` — read-only table of all bookings
- **Single config file** — easy to update school name, teachers, conference date

---

## Google Cloud Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it (e.g., "AAMES Conference Booking") and click **Create**

### 2. Enable the Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **Google Sheets API**
3. Click **Enable**

### 3. Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Name it (e.g., "sheets-bot") and click **Done**
4. Click the service account → **Keys** tab → **Add Key** → **Create new key**
5. Choose **JSON** and download the key file

### 4. Extract Credentials

From the downloaded JSON key file, you need:
- `client_email` → This becomes `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → This becomes `GOOGLE_PRIVATE_KEY`

### 5. Create & Share a Google Sheet

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. **Share** the sheet with the service account email (from step 4) as **Editor**

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

> **Note:** The `GOOGLE_PRIVATE_KEY` must be wrapped in double quotes and use `\n` for newlines.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Vercel auto-detects Next.js — click **Deploy**

### Set Environment Variables

In the Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add all three variables:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
3. **Redeploy** for changes to take effect

---

## Configuration

Edit `src/lib/config.js` to change:
- School name, phone, email, logo
- Conference date
- Teacher list (name, grades, colors)
- Time slot intervals

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Google Sheets API** (via `googleapis`)
