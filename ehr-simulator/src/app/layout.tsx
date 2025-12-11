import type { Metadata } from "next";
// import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";
// import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";

// Font
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "GVSU EHR Simulator",
  description: "A web application for simulating the clinical experience of a patient in a hospital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <UserProvider>
          {/* <SidebarProvider> */}
          {/* <AppSidebar /> */}
          <Toaster position="top-right" />
          <main className="w-full">
            {children}
          </main>
          {/* </SidebarProvider> */}
        </UserProvider>
      </body>
    </html>

  );
}
