import "./globals.css";
import { SCHOOL } from "../lib/config";

export const metadata = {
  title: `${SCHOOL.name} — Parent-Teacher Conference`,
  description: `Book your parent-teacher conference appointment at ${SCHOOL.name}. Schedule a 10-minute meeting with your child's teacher.`,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={SCHOOL.logo}
                alt={`${SCHOOL.name} Logo`}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
              <a
                href={`tel:${SCHOOL.phone}`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {SCHOOL.phone}
              </a>
              <span className="text-gray-300">|</span>
              <a
                href={`mailto:${SCHOOL.email}`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {SCHOOL.email}
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-dark text-white mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={SCHOOL.logo}
                  alt={SCHOOL.name}
                  className="h-8 w-auto object-contain brightness-200"
                />
                <span className="text-sm text-gray-300">{SCHOOL.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-400">
                <a href={`tel:${SCHOOL.phone}`} className="hover:text-white transition-colors">
                  {SCHOOL.phone}
                </a>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a href={`mailto:${SCHOOL.email}`} className="hover:text-white transition-colors">
                  {SCHOOL.email}
                </a>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
