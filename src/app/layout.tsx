import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace", // update this to your actual project name/tagline when ready
  description: "A marketplace for independent sellers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        fraunces.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}