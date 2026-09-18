import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmplifyProvider } from "@/components/AmplifyProvider";
import Header from "@/components/Header";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virginia Tech Digital Libraries",
  description: "Explore our digital collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AmplifyProvider>
          <Header />
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}
