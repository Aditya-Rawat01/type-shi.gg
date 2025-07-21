import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import JotaiProvider from "@/lib/JotaiContextProvider";
import { ThemeCSSVariables } from "@/components/ThemeCSSVariables";
import { getInitialThemeScript } from "@/lib/theme-Script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const roboto = Montserrat({
  variable:"--font-roboto",
  subsets:["latin"]
})
export const metadata: Metadata = {
  title: "type-shi.gg",
  description: "Practice your typing",
  icons: {
    icon:[
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html:getInitialThemeScript()
        }}/>
      </head>
      <body
        className={`${roboto.className} antialiased scrollbar-custom`}
      >
      <JotaiProvider> {/* Use the Jotai provider */}
        <ThemeCSSVariables/>
          {children}
        </JotaiProvider>
        <Toaster/>
      </body>
    </html>
  );
}
