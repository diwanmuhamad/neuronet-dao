"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Step1Form from "../../components/create-item/Step1Form";
import Step2Images from "../../components/create-item/Step2Images";

interface CreateItemData {
  title: string;
  description: string;
  content: string;
  price: string;
  itemType: "prompt" | "dataset" | "ai_output";
  category: string;
  licenseTerms: string;
  thumbnailImages: string[];
}

export default function CreateItemPage() {
  const router = useRouter();
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

  const handleComplete = () => {
    // Navigate back to marketplace after successful creation
    router.push("/marketplace");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Create New Item
          </h1>
          <p className="text-gray-300 text-lg">
            Step {currentStep} of 2:{" "}
            {currentStep === 1 ? "Item Details" : "Thumbnail Images"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex items-center ${currentStep >= 1 ? "text-blue-400" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? "border-blue-400 bg-blue-400 text-white" : "border-gray-500"}`}
              >
                1
              </div>
              <span className="ml-2 font-semibold">Item Details</span>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? "bg-blue-400" : "bg-gray-600"}`}
            ></div>
            <div
              className={`flex items-center ${currentStep >= 2 ? "text-blue-400" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? "border-blue-400 bg-blue-400 text-white" : "border-gray-500"}`}
              >
                2
              </div>
              <span className="ml-2 font-semibold">Images</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
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
  );
}
