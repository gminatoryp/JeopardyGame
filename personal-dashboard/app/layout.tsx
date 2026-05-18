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
    default: "George Park — Senior Software Engineer",
    template: "%s | George Park",
  },
  description:
    "Senior Software Engineer specializing in distributed systems, cloud infrastructure, and full-stack development. 5+ years building systems that scale to millions of users.",
  keywords: [
    "software engineer",
    "distributed systems",
    "cloud infrastructure",
    "full-stack",
    "TypeScript",
    "Go",
    "Python",
    "AWS",
    "Kubernetes",
  ],
  authors: [{ name: "George Park" }],
  creator: "George Park",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "George Park — Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in distributed systems, cloud infrastructure, and full-stack development.",
    siteName: "George Park Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "George Park — Senior Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "George Park — Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in distributed systems, cloud infrastructure, and full-stack development.",
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
  jobTitle: "Senior Software Engineer",
  description:
    "Senior Software Engineer specializing in distributed systems and cloud infrastructure",
  url: siteUrl,
  sameAs: [
    "https://github.com/gminatoryp",
    "https://linkedin.com/in/georgepark",
  ],
  knowsAbout: [
    "Distributed Systems",
    "Cloud Infrastructure",
    "TypeScript",
    "Go",
    "Python",
    "Kubernetes",
    "AWS",
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
