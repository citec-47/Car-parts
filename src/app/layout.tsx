import type { Metadata } from "next";
import { after } from "next/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { CategoryRow } from "@/components/site/CategoryRow";
import { Footer } from "@/components/site/Footer";
import { captureVisitSnapshot, trackVisit } from "@/lib/visitor";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RevParts — Auto Parts for Every Vehicle",
    template: "%s | RevParts",
  },
  description:
    "Quality car parts for every make and model. Free shipping on orders over $60. Browse engines, brakes, lighting, electronics, body parts, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snapshot = await captureVisitSnapshot();
  after(() => trackVisit(snapshot));
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <TopBar />
          <Header />
          <CategoryRow />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
