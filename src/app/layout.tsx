import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import ClientNav from "@/components/ClientNav";

export const metadata: Metadata = {
  title: "Fully Custom Mini Surrons",
  description: "Highest quality mini surrons, talarias, and electric dirt bikes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <ClientNav>
            {children}
          </ClientNav>
        </ClientLayout>
      </body>
    </html>
  );
}
