import "./globals.css";

export const metadata = {
  title: "MediSpeak — Multilingual Nurse-Patient Communication",
  description: "AI-powered multilingual communication app for nurses and patients. Real-time translation, voice assistance, and visual tools for healthcare settings in the Philippines.",
  keywords: "MediSpeak, nurse, patient, communication, translation, healthcare, Filipino, Cebuano, Tagalog",
  authors: [{ name: "MediSpeak Team" }],
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D9488",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
