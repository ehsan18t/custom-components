import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { ThemeProvider, themeScript } from "@/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors duration-300`}
      >
        <ThemeProvider defaultTheme="system" enableSystem>
          <ToastProvider position="bottom-right">{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
