import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShortlistIQ — Screen 100 resumes in 60 seconds",
  description:
    "The fastest AI resume screening tool for recruiters. Upload resumes, paste a job description, get a ranked shortlist with explanations. No ATS needed.",
  keywords:
    "AI resume screening, resume screener, candidate ranking, bulk resume screening, recruiter tools, hire faster",
  openGraph: {
    title: "ShortlistIQ — Screen 100 resumes in 60 seconds",
    description:
      "Upload resumes. Paste a job description. Get a ranked shortlist.",
    type: "website",
    url: "https://shortlistiq.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShortlistIQ — Screen 100 resumes in 60 seconds",
    description: "The fastest resume screening tool for recruiters.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
