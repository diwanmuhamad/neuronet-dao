"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketplaceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to prompts marketplace by default
    router.replace("/marketplace/prompt");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to marketplace...</p>
      </div>
    </div>
  );
}
