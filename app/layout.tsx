import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { THEME_STORAGE_KEY } from "@/features/settings";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ThinkPad",
    template: "%s | ThinkPad",
  },
  description: "ThinkPad — explore the product and sign in to get started.",
};

/**
 * Stamps the saved theme onto <html> before first paint so a dark-mode user
 * never sees a light flash. Mirrors `resolveTheme(readStoredTheme())` from the
 * settings feature — kept as a tiny inline IIFE because it must run before React
 * hydrates (the web equivalent of the desktop app's early apply-on-load module).
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var dark=t==='dark'||((t==='system'||!t)&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
