"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Step1Form from "@/components/create-item/Step1Form";
import Step2Images from "@/components/create-item/Step2Images";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";

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

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
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
    // Navigate to the appropriate marketplace based on item type
    const marketplacePath = `/marketplace/${formData.itemType}`;
    router.push(marketplacePath);
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="my-app">
        <Header />
        <section className="section error">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-6">
                <div className="section__header text-center mb-0">
                  <h2 className="title title-animation mt-12">
                    Authentication Required
                  </h2>
                  <p>
                    Please log in to create new items. You&apos;ll be redirected to the login page.
                  </p>
                  <div className="section__cta">
                    <div className="w-16 h-16 border-4 border-primary-color border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="primary-text text-white mb-2">
                      Redirecting to login...
                    </p>
                    <p className="tertiary-text">Please wait while we authenticate you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-app">
      <Header />
      <main>
        <section className="section create-item">
          <div className="container">
            <div className="row gaper">
              <div className="col-12">
                {/* Header Section - Using app's section header pattern */}
                <div className="section__header text-center mb-0">
                  <h2>Create & Monetize</h2>
                  {/* <h2 className="title title-animation">
                    Create New Item
                  </h2> */}
                  <p className="primary-text">
                    Share your AI creations with the world and start earning
                  </p>
                  <p className="tertiary-text">
                    Step {currentStep} of 2:{" "}
                    {currentStep === 1 ? "Item Details" : "Thumbnail Images"}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar - Using app's card styling */}
            <div className="row gaper">
              <div className="col-12 col-lg-8 offset-lg-2">
                <div className="create-item__progress fade-wrapper">
                  <div className="row align-items-center">
                    <div className="col-12 col-md-5">
                      <div className={`create-item__step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="create-item__step-icon">
                          {currentStep > 1 ? (
                            <i className="material-symbols-outlined">check</i>
                          ) : (
                            <span>1</span>
                          )}
                        </div>
                        <div className="create-item__step-content">
                          <h6>Item Details</h6>
                          <p className="tertiary-text">Basic information</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-2">
                      <div className="create-item__progress-line">
                        <div 
                          className={`create-item__progress-fill ${currentStep >= 2 ? 'active' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-5">
                      <div className={`create-item__step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="create-item__step-icon">
                          {currentStep > 2 ? (
                            <i className="material-symbols-outlined">check</i>
                          ) : (
                            <span>2</span>
                          )}
                        </div>
                        <div className="create-item__step-content">
                          <h6>Images</h6>
                          <p className="tertiary-text">Visual content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content - Using app's form container pattern */}
            <div className="row gaper">
              <div className="col-12">
                <div className="create-item__form fade-wrapper">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
