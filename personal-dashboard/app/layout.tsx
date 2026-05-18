import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://personal-dashboard.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "George Park — Senior QA Engineer",
    template: "%s | George Park",
  },
  description:
    "Senior QA Engineer and Quality Engineering Leader with 20+ years of experience. Specializing in test automation (Playwright, Python/Pytest), API validation, and CI/CD quality integration.",
  keywords: [
    "QA engineer",
    "quality assurance",
    "test automation",
    "Playwright",
    "Python",
    "Pytest",
    "Postman",
    "CI/CD",
    "JIRA",
    "Selenium",
  ],
  authors: [{ name: "George Park" }],
  creator: "George Park",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "George Park — Senior QA Engineer",
    description:
      "Senior QA Engineer and Quality Engineering Leader with 20+ years of experience in test automation, API validation, and CI/CD quality integration.",
    siteName: "George Park Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "George Park — Senior QA Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "George Park — Senior QA Engineer",
    description:
      "Senior QA Engineer and Quality Engineering Leader with 20+ years of experience in test automation, API validation, and CI/CD quality integration.",
    images: ["/og-image.png"],
    creator: "@georgepark_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "George Park",
  jobTitle: "Senior QA Engineer",
  description:
    "Senior QA Engineer and Quality Engineering Leader with 20+ years of experience in test automation, API validation, and CI/CD quality integration",
  url: siteUrl,
  sameAs: [
    "https://github.com/gminatoryp",
    "https://linkedin.com/in/georgeparka1",
  ],
  knowsAbout: [
    "Test Automation",
    "Quality Assurance",
    "Playwright",
    "Python",
    "Pytest",
    "Postman",
    "CI/CD",
    "Agile",
    "API Testing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
