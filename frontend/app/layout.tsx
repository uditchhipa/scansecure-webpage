import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureScan | Free Online Malware Scanner for APK, EXE & PDF",
  description: "Detect hidden malware, spyware, and viruses in your files instantly. Supports APK, EXE, PDF, and TXT. Cloud-based analysis for Android and Windows security. 100% Free.",
  keywords: "malware scanner, virus total, apk scanner, online virus scan, pdf malware checker, exe virus scanner, android security, ransomware detector, free antivirus",
  openGraph: {
    title: "SecureScan - Free Online Malware Detection",
    description: "Scan your files for hidden threats. Protect your device from malware.",
    type: "website",
    locale: "en_US",
    siteName: "SecureScan",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureScan | AI Malware Detector",
    description: "Upload and scan files for viruses instantly.",
  },
  applicationName: "SecureScan",
  verification: {
    google: "h4Ov8bLak2kouiNIT8jvbqv8otfOa98voj9dqZcHwKA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2438557878561786"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
