import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "@/public/styles/main.scss";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ToastProvider } from "@/src/contexts/ToastContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--inter",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--mont",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "NeuroNet DAO | The World’s First Decentralized AI Economy",
  description: "The World’s First Decentralized AI Economy",
  keywords: [
    "Decentralized AI marketplace",
    "AI",
    "DAO",
    "AI Economy",
    "Typescript",
    "React",
    "nextjs",
  ],
  authors: [
    {
      name: "Pixelaxis",
      url: "https://themeforest.net/user/pixelaxis",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en">
      <head>
        {googleAnalyticsId && (
          <GoogleAnalytics measurementId={googleAnalyticsId} />
        )}
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}
      >
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
