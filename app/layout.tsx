import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ProfilePicture from "@/components/ProfilePicture";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gon dev",
  description: "Created by 1eedaegon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-slate-500`}>
        <NavBar />
        <ProfilePicture />
        {children}
      </body>
    </html>
  );
}
