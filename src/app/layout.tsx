import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import ClientNav from "@/components/ClientNav";

export const metadata: Metadata = {
  title: "Mini Moto Co | Custom Mini Motos & Decal Lab",
  description: "Highest quality custom mini electric motos, bespoke decals, and builds. Hand-built in San Diego, CA.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
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
