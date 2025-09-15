"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { getActor } from "@/src/ic/agent";
import { AnonymousIdentity } from "@dfinity/agent";
import { useRouter } from "next/navigation";
import Header from "../layout/header/Header";
import FooterTwo from "../layout/footer/FooterTwo";
import InitCustomCursor from "../layout/InitCustomCursor";
import ScrollProgressButton from "../layout/ScrollProgressButton";
import Animations from "../layout/Animations";
import { Item } from "@/src/components/Items/interfaces";
import { User } from "@/src/components/user/interfaces";
import useDebounce from "@/src/hooks/useDebounce";
import { useCategories } from "@/src/hooks/useCategories";
import Image from "next/image";
import { formatDate } from "@/src/utils/dateUtils";
import ProfileMainContainer from "./ProfileMainContainer";
import ProfileHeader from "./ProfileHeader";
import ProfileSearchBar from "./ProfileSearchBar";
import ProfileItemsGrid from "./ProfileItemsGrid";
import EditItemModal from "./EditItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
// Using window.alert instead of toast for notifications
// import { toast } from "react-toastify";

const ProfilePage = () => {
  const { principal, isAuthenticated, identity } = useAuth();
  const { getCategoriesByType } = useCategories();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    rate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    content: "",
    price: "",
    itemType: "prompt" as "prompt" | "dataset" | "ai_output",
    category: "",
    licenseTerms: "Non-commercial use only",
    thumbnailImages: [] as string[],
    // S3 storage fields
    contentHash: "",
    contentFileKey: "",
    contentFileName: "",
    contentRetrievalUrl: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchUserItems(debouncedSearchQuery);
    } else {
      fetchUserItems();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (isAuthenticated && principal) {
      fetchUserProfile();
      fetchUserItems();
    }
  }, [isAuthenticated, principal]);

  const fetchUserProfile = async () => {
    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      const result = await actor.get_my_profile();
      if (result && Array.isArray(result) && result.length > 0 && result[0]) {
        const userData = result[0];
        setUser({
          principal: userData.principal.toText(),
          balance: Number(userData.balance),
          firstName: userData.firstName?.[0] || undefined,
          lastName: userData.lastName?.[0] || undefined,
          bio: userData.bio?.[0] || undefined,
          rate: userData.rate?.[0] ? Number(userData.rate[0]) : undefined,
          createdAt: Number(userData.createdAt),
          updatedAt: Number(userData.updatedAt),
        });

        // Set form data for editing
        setFormData({
          firstName: userData.firstName?.[0] || "",
          lastName: userData.lastName?.[0] || "",
          bio: userData.bio?.[0] || "",
          rate: userData.rate?.[0]
            ? (Number(userData.rate[0]) / 100).toString()
            : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async (searchQuery?: string) => {
    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      const items = await actor.get_items_by_owner();

      let processedItems = (items as Item[]).map((item: any) => ({
        ...item,
        owner: item.owner.toText(),
      }));

      // Apply search filter if searchQuery is provided
      if (searchQuery && searchQuery.trim()) {
        processedItems = processedItems.filter((item: any) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
      }

      // 🔹 Fetch the actual content for each item that has a contentRetrievalUrl
      const itemsWithContent = await Promise.all(
        processedItems.map(async (item) => {
          if (item.contentRetrievalUrl) {
            try {
              const res = await fetch(item.contentRetrievalUrl);
              const text = await res.text();
              return { ...item, content: text }; // replace empty content with fetched text
            } catch (err) {
              console.error("Error fetching content for item", item.id, err);
              return { ...item }; // fallback to original item
            }
          } else {
            return item;
          }
        })
      );
      console.log("Fetched user items:", itemsWithContent);
      setUserItems(itemsWithContent);
    } catch (error) {
      console.error("Failed to fetch user items:", error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      const actor = await getActor(identity || new AnonymousIdentity());
      const rateInCents = formData.rate
        ? Math.round(parseFloat(formData.rate) * 100)
        : undefined;

      const result = await actor.update_user_profile(
        formData.firstName?.trim() ? [formData.firstName.trim()] : [],
        formData.lastName?.trim() ? [formData.lastName.trim()] : [],
        formData.bio?.trim() ? [formData.bio.trim()] : [],
        rateInCents ? [BigInt(rateInCents)] : []
      );

      if (result) {
        setEditing(false);
        await fetchUserProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleItemClick = (itemId: number) => {
    router.push(`/marketplace/items/${itemId}`);
  };

  // Function to upload content to S3 and get hash
  const uploadContentToS3 = async (
    content: string,
    itemType: string
  ): Promise<{
    contentHash: string;
    fileKey: string;
    fileName: string;
    retrievalUrl: string;
  } | null> => {
    if (!principal) return null;

    try {
      const response = await fetch("/api/upload/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          itemType,
          principal: principal.toString(),
        }),
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

  // Function to update an item
  const handleUpdateItem = async () => {
    if (!identity || !editingItem) return;

    setIsProcessing(true);
    try {
      const actor = await getActor(identity);

      // Upload content to S3 if content has changed
      let contentHash = itemFormData.contentHash;
      let contentFileKey = itemFormData.contentFileKey;
      let contentFileName = itemFormData.contentFileName;
      let contentRetrievalUrl = itemFormData.contentRetrievalUrl;

      // Check if content has changed (compare with original item content)
      if (itemFormData.content !== editingItem.content) {
        const uploadResult = await uploadContentToS3(
          itemFormData.content,
          itemFormData.itemType
        );

        if (uploadResult) {
          contentHash = uploadResult.contentHash;
          contentFileKey = uploadResult.fileKey;
          contentFileName = uploadResult.fileName;
          contentRetrievalUrl = uploadResult.retrievalUrl;
        } else {
          throw new Error("Failed to upload content to S3");
        }
      }

      // Convert price to bigint (E8s format)
      const priceInE8s = BigInt(
        Math.floor(parseFloat(itemFormData.price) * 100_000_000)
      );

      // Call the update_item function with all fields
      await actor.update_item(
        editingItem.id,
        itemFormData.title,
        itemFormData.description,
        contentHash,
        priceInE8s,
        itemFormData.itemType,
        itemFormData.category,
        itemFormData.licenseTerms,
        itemFormData.thumbnailImages,
        contentFileKey,
        contentFileName,
        contentRetrievalUrl
      );

      // Update the item in the local state
      const updatedItems = userItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: itemFormData.title,
              description: itemFormData.description,
              content: itemFormData.content,
              price: parseFloat(itemFormData.price),
              itemType: itemFormData.itemType,
              category: itemFormData.category,
              licenseTerms: itemFormData.licenseTerms,
              thumbnailImages: itemFormData.thumbnailImages,
              contentHash: contentHash,
              contentFileKey: contentFileKey,
              contentFileName: contentFileName,
              contentRetrievalUrl: contentRetrievalUrl,
            }
          : item
      );

      setUserItems(updatedItems);
      setIsEditModalOpen(false);
      setEditingItem(null);

      // Show success message
      window.alert("Item updated successfully");
    } catch (error) {
      console.error("Failed to update item:", error);
      window.alert(
        `Failed to update item: ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to delete an item
  const handleConfirmDelete = async () => {
    if (!identity || !itemToDeleteId) return;

    setIsProcessing(true);
    try {
      const actor = await getActor(identity);

      // Call the delete_item function
      const res: any = await actor.delete_item(itemToDeleteId);

      // Remove the item from the local state
      if ("ok" in res) {
        // success
        const updatedItems = userItems.filter(
          (item) => item.id !== itemToDeleteId
        );
        setUserItems(updatedItems);
        setIsDeleteModalOpen(false);
        setItemToDeleteId(null);
        window.alert("Item deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      window.alert("Failed to delete item. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemFormChange = (field: string, value: string | string[]) => {
    setItemFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      description: item.description || "",
      content: item.content || "",
      price: (typeof item.price === "bigint"
        ? Number(item.price) / 100_000_000
        : item.price
      ).toString(),
      itemType:
        (item.itemType as "prompt" | "dataset" | "ai_output") || "prompt",
      category: item.category || "",
      licenseTerms: item.licenseTerms || "Non-commercial use only",
      thumbnailImages: item.thumbnailImages || [],
      contentHash: item.contentHash || "",
      contentFileKey: item.contentFileKey || "",
      contentFileName: item.contentFileName || "",
      contentRetrievalUrl: item.contentRetrievalUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    setItemToDeleteId(itemId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (isEditModalOpen) {
      // lock scroll
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // unlock scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      // clean up on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isEditModalOpen]);

  if (!isAuthenticated) {
    return (
      <div className="my-app">
        <Header />
        <main>
          <div className="section">
            <div className="container">
              <div className="text-center">
                <h2 className="title text-white mb-4">
                  Authentication Required
                </h2>
                <p className="tertiary-text">
                  Please connect your wallet to view your profile.
                </p>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        <Animations />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-app">
        <Header />
        <main>
          <div className="section">
            <div className="container">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        <Animations />
      </div>
    );
  }

  return (
    <div className="my-app">
      <Header />
      <main>
        <div className="section">
          <div className="container">
            <ProfileMainContainer>
              <ProfileHeader
                displayName={
                  user?.firstName
                    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                    : (principal?.substring(0, 8) as string)
                }
                avatarLetter={
                  user?.firstName
                    ? user.firstName[0].toUpperCase()
                    : (principal?.substring(0, 1).toUpperCase() as string)
                }
                editing={editing}
                onToggleEditing={() => setEditing(!editing)}
                bioSection={
                  <div className="mb-4">
                    {editing ? (
                      <div className="row g-4">
                        <div className="col-12">
                          <h4 className="text-white fw-6 mb-3">Profile Information</h4>
                        </div>
                        <div className="col-md-6">
                          <div className="input-single">
                            <label className="text-white fw-5 mb-2 d-block">First Name</label>
                            <input
                              type="text"
                              value={formData.firstName}
                              disabled={updating}
                              onChange={(e) => handleFormChange("firstName", e.target.value)}
                              className="form-control"
                              placeholder="Enter first name"
                              style={{ backgroundColor: "var(--tertiary-color)", border: "1px solid #414141", color: "white" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-single">
                            <label className="text-white fw-5 mb-2 d-block">Last Name</label>
                            <input
                              type="text"
                              value={formData.lastName}
                              disabled={updating}
                              onChange={(e) => handleFormChange("lastName", e.target.value)}
                              className="form-control"
                              placeholder="Enter last name"
                              style={{ backgroundColor: "var(--tertiary-color)", border: "1px solid #414141", color: "white" }}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-single">
                            <label className="text-white fw-5 mb-2 d-block">Bio</label>
                            <textarea
                              value={formData.bio}
                              disabled={updating}
                              onChange={(e) => handleFormChange("bio", e.target.value)}
                              rows={4}
                              className="form-control"
                              placeholder="Tell us about yourself..."
                              style={{ backgroundColor: "var(--tertiary-color)", border: "1px solid #414141", color: "white" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-single">
                            <label className="text-white fw-5 mb-2 d-block">Hourly Rate ($)</label>
                            <input
                              type="number"
                              value={formData.rate}
                              disabled={updating}
                              onChange={(e) => handleFormChange("rate", e.target.value)}
                              className="form-control"
                              placeholder="Enter hourly rate"
                              style={{ backgroundColor: "var(--tertiary-color)", border: "1px solid #414141", color: "white" }}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex gap-3">
                            <button onClick={handleSaveProfile} className="btn btn--primary" disabled={updating}>
                              <i className="bi bi-check-lg me-2"></i>
                              {updating ? "Saving..." : "Save Profile"}
                            </button>
                            <button onClick={() => setEditing(false)} className="btn btn--secondary" disabled={updating}>
                              <i className="bi bi-x-lg me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h4 className="text-white fw-6 mb-0">Bio</h4>
                        </div>
                        {user?.bio ? (
                          <p className="text-quinary mb-0" style={{ fontSize: "1rem", lineHeight: "1.6" }}>{user.bio}</p>
                        ) : (
                          <p className="text-quinary mb-0" style={{ fontSize: "1rem" }}>No bio available. Click &quot;Edit Profile&quot; to add one.</p>
                        )}
                      </div>
                    )}
                  </div>
                }
                statsSection={
                  <div className="row g-3 text-quinary" style={{ fontSize: "0.9rem" }}>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar3 me-2 text-primary"></i>
                        <span>
                          Joined: {user?.createdAt ? formatDate(user.createdAt) : "Information unavailable"}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-currency-dollar me-2 text-primary"></i>
                        <span>
                          Rate: ${user?.rate ? (user.rate / 100).toFixed(0) : "Information unavailable"}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />

              <ProfileSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={`Search @${
                  user?.firstName
                    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                    : principal?.substring(0, 8)
                }'s items`}
              />

              <ProfileItemsGrid
                items={userItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onOpen={handleItemClick}
              />
            </ProfileMainContainer>
          </div>
        </div>
      </main>
      <FooterTwo />
      <InitCustomCursor />
      <ScrollProgressButton />
      <Animations />

      <EditItemModal
        isOpen={isEditModalOpen}
        isProcessing={isProcessing}
        itemFormData={itemFormData}
        categoriesByType={getCategoriesByType}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateItem}
        onChange={handleItemFormChange}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isProcessing={isProcessing}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProfilePage;
