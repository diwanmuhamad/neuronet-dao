"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Debug logging (remove in production)
  console.log("GoogleAnalytics component loaded");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Measurement ID:", measurementId);

  // Only load Google Analytics in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Google Analytics disabled - not in production mode");
    return null;
  }

  console.log("Google Analytics enabled - production mode detected");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
          console.log('Google Analytics initialized with ID: ${measurementId}');
        `}
      </Script>
    </>
  );
}
