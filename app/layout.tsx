import type { Metadata } from "next";
import { Geist_Mono, Inter, Urbanist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const urbanist = Urbanist({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haylo - AI Receptionist for Allied Health Clinics",
  description:
    "Never miss another patient call. Haylo is your 24/7 AI receptionist for Allied Health clinics across Australia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${urbanist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Toaster position="top-center" />
        <div className="bg-white lg:bg-gradient-to-br lg:from-[#C782F9]/20 lg:via-[#fcfaff] lg:to-[#f3ebfa]/40">
          {children}
        </div>
      </body>
    </html>
  );
}
