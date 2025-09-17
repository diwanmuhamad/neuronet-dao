"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Step1Form from "@/components/create-item/Step1Form";
import Step2Images from "@/components/create-item/Step2Images";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { getActor } from "@/src/ic/agent";

type ItemType = "prompt" | "dataset" | "ai_output";

interface UpdateItemData {
  title: string;
  description: string;
  content: string;
  price: string;
  itemType: ItemType;
  category: string;
  licenseTerms: string;
  thumbnailImages: string[];
  contentHash?: string;
  contentFileKey?: string;
  contentFileName?: string;
  contentRetrievalUrl?: string;
}

export default function UpdateItemPage() {
  const router = useRouter();
  const params = useSearchParams();
  const itemIdParam = params.get("id");
  const { isAuthenticated, identity } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UpdateItemData>({
    title: "",
    description: "",
    content: "",
    price: "",
    itemType: "prompt",
    category: "",
    licenseTerms: "Non-commercial use only",
    thumbnailImages: [],
    contentHash: "",
    contentFileKey: "",
    contentFileName: "",
    contentRetrievalUrl: "",
  });

  useEffect(() => {
    if (itemIdParam) {
      const parsed = Number(itemIdParam);
      if (!Number.isNaN(parsed)) setItemId(parsed);
    }
  }, [itemIdParam]);

  const updateFormData = (updates: Partial<UpdateItemData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Prefill the form from the existing item data
  useEffect(() => {
    const loadItem = async () => {
      if (!identity || itemId == null) return;
      try {
        const actor = await getActor(identity);
        const items = await actor.get_items_by_owner();
        const found = (items as any[]).find((it) => Number(it.id) === itemId);
        if (!found) return;
        const priceNum = typeof found.price === "bigint" ? Number(found.price) / 100_000_000 : Number(found.price);

        // If contentRetrievalUrl exists, fetch the real content (like ProfilePage does)
        let resolvedContent = found.content || "";
        if (found.contentRetrievalUrl) {
          try {
            const res = await fetch(found.contentRetrievalUrl);
            resolvedContent = await res.text();
          } catch (err) {
            console.error("Failed to fetch item content from retrieval URL", err);
          }
        }
        setFormData({
          title: found.title,
          description: found.description || "",
          content: resolvedContent,
          price: Number.isFinite(priceNum) ? String(priceNum) : "",
          itemType: (found.itemType as ItemType) || "prompt",
          category: found.category || "",
          licenseTerms: found.licenseTerms || "Non-commercial use only",
          thumbnailImages: found.thumbnailImages || [],
          contentHash: found.contentHash || "",
          contentFileKey: found.contentFileKey || "",
          contentFileName: found.contentFileName || "",
          contentRetrievalUrl: found.contentRetrievalUrl || "",
        });
      } catch (err) {
        console.error("Failed to load item for update", err);
      }
    };
    loadItem();
  }, [identity, itemId]);

  const uploadContentToS3 = async (
    content: string,
    itemType: string
  ): Promise<{
    contentHash: string;
    fileKey: string;
    fileName: string;
    retrievalUrl: string;
  } | null> => {
    try {
      const response = await fetch("/api/upload/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, itemType }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload content");
      }
      const result = await response.json();
      return {
        contentHash: result.contentHash,
        fileKey: result.fileKey,
        fileName: result.fileName,
        retrievalUrl: result.retrievalUrl,
      };
    } catch (error) {
      console.error("Error uploading content:", error);
      throw error;
    }
  };

  const handleComplete = async () => {
    if (!identity || itemId == null) return;
    setIsProcessing(true);
    try {
      const actor = await getActor(identity);

      let contentHash = formData.contentHash || "";
      let contentFileKey = formData.contentFileKey || "";
      let contentFileName = formData.contentFileName || "";
      let contentRetrievalUrl = formData.contentRetrievalUrl || "";

      // If the content has changed versus what we had prefilled, upload
      // Note: This page does not retain original content; assume changed if no hash
      if (!contentHash && formData.content) {
        const uploadResult = await uploadContentToS3(formData.content, formData.itemType);
        if (uploadResult) {
          contentHash = uploadResult.contentHash;
          contentFileKey = uploadResult.fileKey;
          contentFileName = uploadResult.fileName;
          contentRetrievalUrl = uploadResult.retrievalUrl;
        }
      }

      const priceInE8s = BigInt(Math.floor(parseFloat(formData.price || "0") * 100_000_000));

      await actor.update_item(
        itemId,
        formData.title,
        formData.description,
        contentHash,
        priceInE8s,
        formData.itemType,
        formData.category,
        formData.licenseTerms,
        formData.thumbnailImages,
        contentFileKey,
        contentFileName,
        contentRetrievalUrl
      );

      // Navigate to the updated item page
      router.push(`/marketplace/items/${itemId}`);
    } catch (error) {
      console.error("Failed to update item:", error);
      window.alert(
        `Failed to update item: ${error instanceof Error ? error.message : "Please try again."}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect unauthenticated users to profile (login flow)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="my-app">
        <Header />
        <main>
          <section className="section error">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                  <div className="section__header text-center mb-0">
                    <h2 className="title title-animation mt-12">Authentication Required</h2>
                    <p>You must be logged in to update an item.</p>
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

  return (
    <div className="my-app">
      <Header />
      <main>
        <section className="section create-item">
          <div className="container">
            <div className="row gaper">
              <div className="col-12">
                <div className="section__header text-center mb-0">
                  {/* <h1>Update Item</h1> */}
                  <h2>Update Your Item</h2>
                  <p className="tertiary-text">Step {currentStep} of 2: Item Details</p>
                </div>
              </div>
            </div>

            <div className="row gaper">
              <div className="col-12">
                <div className="create-item__form fade-wrapper">
                  {currentStep === 1 && (
                    <Step1Form
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={nextStep}
                      skipDuplicateCheck
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Images
                      formData={formData}
                      onBack={prevStep}
                      onComplete={() => {
                        if (itemId != null) router.push(`/marketplace/items/${itemId}`);
                      }}
                      initialImageUrls={formData.thumbnailImages}
                      onSubmit={async (imageUrls: string[]) => {
                        // Save images and update item
                        if (!identity || itemId == null) return;
                        const actor = await getActor(identity);
                        const priceInE8s = BigInt(Math.floor(parseFloat(formData.price || "0") * 100_000_000));
                        await actor.update_item(
                          itemId,
                          formData.title,
                          formData.description,
                          formData.contentHash || "",
                          priceInE8s,
                          formData.itemType,
                          formData.category,
                          formData.licenseTerms,
                          imageUrls,
                          formData.contentFileKey || "",
                          formData.contentFileName || "",
                          formData.contentRetrievalUrl || "",
                        );
                      }}
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


