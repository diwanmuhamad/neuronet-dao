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
  title: "Aikeu | Artificial Neural Network AI React NextJs Template",
  description: "Artificial Neural Network AI React NextJs Template",
  keywords: [
    "Artificial",
    "Ai",
    "Network",
    "Javascript",
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
