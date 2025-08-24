"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Step1Form from "../../components/create-item/Step1Form";
import Step2Images from "../../components/create-item/Step2Images";
import Navbar from "@/components/common/Navbar";

interface CreateItemData {
  title: string;
  description: string;
  content: string;
  price: string;
  itemType: "prompt" | "dataset" | "ai_output";
  category: string;
  licenseTerms: string;
  thumbnailImages: string[];
  // S3 storage fields
  contentHash?: string;
  contentFileKey?: string;
  contentFileName?: string;
  contentRetrievalUrl?: string;
}

export default function CreateItemPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateItemData>({
    title: "",
    description: "",
    content: "",
    price: "",
    itemType: "prompt",
    category: "",
    licenseTerms: "Non-commercial use only",
    thumbnailImages: [],
  });

  const updateFormData = (updates: Partial<CreateItemData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleComplete = () => {
    // Navigate back to marketplace after successful creation
    router.push("/marketplace");
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-200 font-medium mb-2">
            Redirecting to login...
          </p>
          <p className="text-gray-400">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <Navbar />
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-purple-200 font-medium">
              ✨ Create & Monetize
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200 mb-6"
            style={{ textShadow: "0 0 40px rgba(168, 85, 247, 0.3)" }}
          >
            Create New Item
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-2">
            Share your AI creations with the world and start earning
          </p>

          <p className="text-lg text-gray-400">
            Step {currentStep} of 2:{" "}
            {currentStep === 1 ? "Item Details" : "Thumbnail Images"}
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center transition-all duration-500 ${
                  currentStep >= 1 ? "text-purple-300" : "text-gray-500"
                }`}
              >
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    currentStep >= 1
                      ? "border-purple-400 bg-purple-400 text-white shadow-lg shadow-purple-400/30"
                      : "border-gray-500 bg-gray-700"
                  }`}
                >
                  {currentStep >= 1 ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    "1"
                  )}
                  {currentStep === 1 && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping" />
                  )}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-lg">Item Details</div>
                  <div className="text-sm text-gray-400">Basic information</div>
                </div>
              </div>

              <div
                className={`flex-1 h-2 mx-6 rounded-full transition-all duration-500 ${
                  currentStep >= 2
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    currentStep >= 2
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
                      : ""
                  }`}
                />
              </div>

              <div
                className={`flex items-center transition-all duration-500 ${
                  currentStep >= 2 ? "text-purple-300" : "text-gray-500"
                }`}
              >
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    currentStep >= 2
                      ? "border-purple-400 bg-purple-400 text-white shadow-lg shadow-purple-400/30"
                      : "border-gray-500 bg-gray-700"
                  }`}
                >
                  {currentStep > 2 ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    "2"
                  )}
                  {currentStep === 2 && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping" />
                  )}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-lg">Images</div>
                  <div className="text-sm text-gray-400">Visual content</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            {currentStep === 1 && (
              <Step1Form
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2Images
                formData={formData}
                onBack={prevStep}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-3 h-3 bg-pink-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-20 w-1 h-1 bg-purple-300/40 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
