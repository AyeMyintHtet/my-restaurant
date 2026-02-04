import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getUser } from "@/utils/getUser";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buffet POS",
  description: "Buffet POS Application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser()

  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-hidden`}
      >
        <QueryProvider>
          <div className="flex h-screen w-full">
            {user?.email && <Sidebar />}
            <main className="mx-3 flex-1 h-full overflow-y-auto overflow-x-hidden relative">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
