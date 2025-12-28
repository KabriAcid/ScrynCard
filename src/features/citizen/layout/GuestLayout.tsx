import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NavigationProgress } from "@/components/navigation-progress";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Scryn Card",
  description:
    "Scryn revolutionizes political distribution of funds through scratch cards enabling transparent and secure transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("antialiased font-sans")}>
        <NavigationProgress />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
