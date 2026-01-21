import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "PizzaHouse | Доставка Суші та Піци",
  description: "Найсмачніша піца та свіжі роли у вашому місті. Швидка доставка та висока якість.",
};

import { AppProvider } from "@/providers/AppProvider";
import Preloader from "@/components/ui/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <AppProvider>
          <Preloader />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
