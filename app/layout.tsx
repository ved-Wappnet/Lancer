import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/components/providers/redux-provider";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

const briefcaseIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
</svg>
`;

export const metadata: Metadata = {
  title: "Lancer | End-to-End Freelance Platform",
  description: "Connect with talented freelancers and clients worldwide",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml;base64," +
          Buffer.from(briefcaseIconSvg).toString("base64"),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
