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
            {/* Main Profile Container - Clean, modern layout */}
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-8">
                {/* Profile Header Section - Clean header with avatar, name, and actions */}
                <div className="bg-quaternary rounded-3 mb-5 overflow-hidden">
                  {/* Profile Banner - Subtle gradient background */}
                  <div
                    className="position-relative"
                    style={{
                      height: "120px",
                      background:
                        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    }}
                  >
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background:
                          "linear-gradient(45deg, rgba(101, 255, 75, 0.1) 0%, rgba(64, 204, 40, 0.1) 100%)",
                      }}
                    ></div>
                  </div>

                  {/* Profile Content - Well-structured profile info */}
                  <div
                    className="position-relative"
                    style={{ marginTop: "-60px", zIndex: 10 }}
                  >
                    <div className="px-4 pb-4">
                      {/* Avatar and Basic Info Row */}
                      <div className="d-flex align-items-end mb-4">
                        {/* Avatar - Large, prominent avatar */}
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-4 border-4 border-quaternary shadow-lg"
                          style={{
                            width: "120px",
                            height: "120px",
                            background:
                              "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)",
                            fontSize: "2.5rem",
                            fontWeight: "700",
                          }}
                        >
                          <span className="text-white">
                            {user?.firstName
                              ? user.firstName[0].toUpperCase()
                              : principal?.substring(0, 1).toUpperCase()}
                          </span>
                        </div>

                        {/* User Info - Clean typography hierarchy */}
                        <div className="flex-grow-1">
                          <h1
                            className="text-white fw-7 mb-2"
                            style={{ fontSize: "1.75rem" }}
                          >
                            @
                            {user?.firstName
                              ? `${user.firstName}${
                                  user.lastName ? ` ${user.lastName}` : ""
                                }`
                              : principal?.substring(0, 8)}
                            ...
                          </h1>
                          <div className="d-flex align-items-center gap-3">
                            <button
                              onClick={() => setEditing(!editing)}
                              className="btn btn--primary btn-sm"
                              disabled={editing}
                            >
                              <i className="bi bi-pencil me-2"></i>
                              {editing ? "Editing..." : "Edit Profile"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bio Section - Clean, readable bio area */}
                      <div className="mb-4">
                        {editing ? (
                          /* Edit Mode - Clean form layout */
                          <div className="row g-4">
                            <div className="col-12">
                              <h4 className="text-white fw-6 mb-3">
                                Profile Information
                              </h4>
                            </div>
                            <div className="col-md-6">
                              <div className="input-single">
                                <label className="text-white fw-5 mb-2 d-block">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  value={formData.firstName}
                                  disabled={updating}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="Enter first name"
                                  style={{
                                    backgroundColor: "var(--tertiary-color)",
                                    border: "1px solid #414141",
                                    color: "white",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-single">
                                <label className="text-white fw-5 mb-2 d-block">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  value={formData.lastName}
                                  disabled={updating}
                                  onChange={(e) =>
                                    handleFormChange("lastName", e.target.value)
                                  }
                                  className="form-control"
                                  placeholder="Enter last name"
                                  style={{
                                    backgroundColor: "var(--tertiary-color)",
                                    border: "1px solid #414141",
                                    color: "white",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="input-single">
                                <label className="text-white fw-5 mb-2 d-block">
                                  Bio
                                </label>
                                <textarea
                                  value={formData.bio}
                                  disabled={updating}
                                  onChange={(e) =>
                                    handleFormChange("bio", e.target.value)
                                  }
                                  rows={4}
                                  className="form-control"
                                  placeholder="Tell us about yourself..."
                                  style={{
                                    backgroundColor: "var(--tertiary-color)",
                                    border: "1px solid #414141",
                                    color: "white",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-single">
                                <label className="text-white fw-5 mb-2 d-block">
                                  Hourly Rate ($)
                                </label>
                                <input
                                  type="number"
                                  value={formData.rate}
                                  disabled={updating}
                                  onChange={(e) =>
                                    handleFormChange("rate", e.target.value)
                                  }
                                  className="form-control"
                                  placeholder="Enter hourly rate"
                                  style={{
                                    backgroundColor: "var(--tertiary-color)",
                                    border: "1px solid #414141",
                                    color: "white",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex gap-3">
                                <button
                                  onClick={handleSaveProfile}
                                  className="btn btn--primary"
                                  disabled={updating}
                                >
                                  <i className="bi bi-check-lg me-2"></i>
                                  {updating ? "Saving..." : "Save Profile"}
                                </button>
                                <button
                                  onClick={() => setEditing(false)}
                                  className="btn btn--secondary"
                                  disabled={updating}
                                >
                                  <i className="bi bi-x-lg me-2"></i>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* View Mode - Clean bio display */
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <h4 className="text-white fw-6 mb-0">Bio</h4>
                            </div>
                            {user?.bio ? (
                              <p
                                className="text-quinary mb-0"
                                style={{ fontSize: "1rem", lineHeight: "1.6" }}
                              >
                                {user.bio}
                              </p>
                            ) : (
                              <p
                                className="text-quinary mb-0"
                                style={{ fontSize: "1rem" }}
                              >
                                No bio available. Click &quot;Edit Profile&quot;
                                to add one.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Platform Stats - Clean stats row */}
                      <div
                        className="row g-3 text-quinary"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar3 me-2 text-primary"></i>
                            <span>
                              Joined:{" "}
                              {user?.createdAt
                                ? formatDate(user.createdAt)
                                : "Information unavailable"}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-currency-dollar me-2 text-primary"></i>
                            <span>
                              Rate: $
                              {user?.rate
                                ? (user.rate / 100).toFixed(0)
                                : "Information unavailable"}
                              /hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Section - Clean search bar */}
                <div className="mb-5">
                  <div className="subscribe-form" style={{ maxWidth: "500px" }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search @${
                        user?.firstName
                          ? `${user.firstName}${
                              user.lastName ? ` ${user.lastName}` : ""
                            }`
                          : principal?.substring(0, 8)
                      }&apos;s items`}
                    />
                    <button type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* My Items Section - Clean grid layout */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <i
                      className="bi bi-grid-3x3-gap text-primary me-3"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <h2 className="title text-white mb-0">
                      My Items ({userItems.length})
                    </h2>
                  </div>

                  {userItems.length > 0 ? (
                    /* Items Grid - Responsive grid layout */
                    <div className="row g-4">
                      {userItems.map((item) => {
                        const imageUrl =
                          item.thumbnailImages &&
                          item.thumbnailImages.length > 0
                            ? item.thumbnailImages[0]
                            : "/placeholder_default.svg";
                        return (
                          <div
                            key={item.id}
                            className="col-12 col-sm-6 col-lg-4 col-xl-3"
                          >
                            <div
                              className="bg-quaternary rounded-3 overflow-hidden h-100 transition-all position-relative"
                              style={{
                                transition: "all 0.3s ease",
                                transform: "scale(1)",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.02)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            >
                              {/* Action Buttons */}
                              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 z-3">
                                <button
                                  className="btn btn-sm btn--primary rounded-full px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditItem(item);
                                  }}
                                  title="Edit item"
                                >
                                  <i className="bi bi-pencil ml-1 mt-1"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn--quaternary rounded-full px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id);
                                  }}
                                  title="Delete item"
                                >
                                  <i className="bi bi-trash ml-1"></i>
                                </button>
                              </div>

                              {/* Item Content - Clickable */}
                              <div
                                className="cursor-pointer"
                                onClick={() => handleItemClick(item.id)}
                              >
                                {/* Item Image */}
                                <div
                                  className="position-relative"
                                  style={{
                                    height: "200px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Image
                                    src={imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-fit-cover"
                                  />
                                </div>

                                {/* Item Content */}
                                <div className="p-3">
                                  <h3
                                    className="text-white fw-5 mb-2"
                                    style={{
                                      fontSize: "0.95rem",
                                      lineHeight: "1.4",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {item.title}
                                  </h3>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <span
                                      className="text-white fw-7"
                                      style={{ fontSize: "0.9rem" }}
                                    >
                                      {(
                                        Number(item.price) / 100_000_000
                                      ).toFixed(2)}{" "}
                                      ICP
                                    </span>
                                    {item.averageRating > 0 && (
                                      <div
                                        className="d-flex align-items-center text-warning"
                                        style={{ fontSize: "0.8rem" }}
                                      >
                                        <i className="bi bi-star-fill me-1"></i>
                                        <span>
                                          {item.averageRating.toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty State - Clean empty state design */
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i
                          className="bi bi-inbox text-quinary"
                          style={{ fontSize: "3rem" }}
                        ></i>
                      </div>
                      <h3 className="text-white fw-6 mb-3">No items yet</h3>
                      <p
                        className="text-quinary mb-4"
                        style={{ fontSize: "1rem" }}
                      >
                        Start creating your first item to build your portfolio!
                      </p>
                      <button
                        className="btn btn--primary"
                        onClick={() => router.push("/create-item")}
                      >
                        <i className="bi bi-plus-lg me-2"></i>
                        Create First Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterTwo />
      <InitCustomCursor />
      <ScrollProgressButton />
      <Animations />

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "flex", // overlay is flex
            position: "fixed", // lock to viewport
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            style={{
              maxWidth: "900px",
              width: "100%",
              height: "80vh", // THIS constrains height
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="modal-content bg-tertiary"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "1000px", // fill dialog height
                maxHeight: "100%", // ADD THIS LINE
              }}
            >
              <div
                className="modal-header border-bottom border-dark"
                style={{ flexShrink: 0 }}
              >
                <h5 className="modal-title text-white">Edit Item</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isProcessing}
                ></button>
              </div>

              {/* 👇 scrollable body */}
              <div
                className="modal-body"
                style={{
                  flex: 1,
                  maxHeight: "calc(100vh - 200px)", // Fixed height instead of flex
                  overflowY: "auto", // SCROLL HERE
                  overflowX: "hidden",
                  padding: "1rem",
                }}
              >
                <div className="row g-3">
                  {/* Title */}
                  <div className="col-12">
                    <label
                      htmlFor="itemTitle"
                      className="form-label text-white"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-dark"
                      id="itemTitle"
                      value={itemFormData.title}
                      onChange={(e) =>
                        handleItemFormChange("title", e.target.value)
                      }
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Price and Item Type */}
                  <div className="col-md-6">
                    <label
                      htmlFor="itemPrice"
                      className="form-label text-white"
                    >
                      Price (ICP)
                    </label>
                    <input
                      type="number"
                      step="0.00000001"
                      min="0"
                      className="form-control bg-dark text-white border-dark"
                      id="itemPrice"
                      value={itemFormData.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        const decimalPart = value.split(".")[1];
                        if (decimalPart && decimalPart.length > 8) {
                          const truncated = parseFloat(value).toFixed(8);
                          handleItemFormChange("price", truncated);
                        } else {
                          handleItemFormChange("price", value);
                        }
                      }}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="itemType" className="form-label text-white">
                      Item Type
                    </label>
                    <select
                      className="form-control bg-dark text-white border-dark"
                      id="itemType"
                      value={itemFormData.itemType}
                      onChange={(e) => {
                        handleItemFormChange(
                          "itemType",
                          e.target.value as "prompt" | "dataset" | "ai_output"
                        );
                        handleItemFormChange("category", ""); // Reset category when type changes
                      }}
                      disabled={isProcessing}
                    >
                      <option value="prompt">Prompt</option>
                      <option value="dataset">Dataset</option>
                      <option value="ai_output">AI Output</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="col-12">
                    <label
                      htmlFor="itemCategory"
                      className="form-label text-white"
                    >
                      Category
                    </label>
                    <select
                      className="form-control bg-dark text-white border-dark"
                      id="itemCategory"
                      value={itemFormData.category}
                      onChange={(e) =>
                        handleItemFormChange("category", e.target.value)
                      }
                      disabled={isProcessing}
                    >
                      <option value="">Choose a category</option>
                      {getCategoriesByType(itemFormData.itemType).map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content */}
                  <div className="col-12">
                    <label
                      htmlFor="itemContent"
                      className="form-label text-white"
                    >
                      Content
                    </label>
                    {itemFormData.itemType === "ai_output" ? (
                      <div>
                        <input
                          type="file"
                          id="itemContent"
                          accept="image/jpeg,image/jpg,image/png"
                          className="form-control bg-dark text-white border-dark"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const maxSize = 1024 * 1024;
                              if (file.size > maxSize) {
                                window.alert(
                                  "File size exceeds 1MB limit. Please choose a smaller image."
                                );
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                handleItemFormChange("content", result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <div className="form-text text-white mt-3">
                          JPG, PNG (MAX. 1MB)
                        </div>
                      </div>
                    ) : itemFormData.itemType === "dataset" ? (
                      <div>
                        <input
                          type="file"
                          id="itemContent"
                          accept=".csv,text/csv"
                          className="form-control bg-dark text-white border-dark"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const maxSize = 1024 * 1024;
                              if (file.size > maxSize) {
                                window.alert(
                                  "File size exceeds 1MB limit. Please choose a smaller CSV file."
                                );
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                handleItemFormChange("content", result);
                              };
                              reader.readAsText(file);
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <div className="form-text text-white mt-3">
                          CSV format (MAX. 1MB)
                        </div>
                      </div>
                    ) : (
                      <textarea
                        className="form-control bg-dark text-white border-dark"
                        id="itemContent"
                        rows={5}
                        value={itemFormData.content}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (Buffer.byteLength(value, "utf8") > 1024 * 1024) {
                            window.alert(
                              "Content size exceeds 1MB limit. Please use shorter text."
                            );
                            return;
                          }
                          handleItemFormChange("content", value);
                        }}
                        disabled={isProcessing}
                        placeholder={
                          itemFormData.itemType === "prompt"
                            ? "Enter your AI prompt..."
                            : "Enter content..."
                        }
                      />
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label
                      htmlFor="itemDescription"
                      className="form-label text-white"
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control bg-dark text-white border-dark"
                      id="itemDescription"
                      rows={4}
                      value={itemFormData.description}
                      onChange={(e) =>
                        handleItemFormChange("description", e.target.value)
                      }
                      disabled={isProcessing}
                      placeholder="Describe your item and its use cases..."
                    />
                  </div>

                  {/* License Terms */}
                  <div className="col-12">
                    <label
                      htmlFor="itemLicenseTerms"
                      className="form-label text-white"
                    >
                      License Terms
                    </label>
                    <select
                      className="form-control bg-dark text-white border-dark"
                      id="itemLicenseTerms"
                      value={itemFormData.licenseTerms}
                      onChange={(e) =>
                        handleItemFormChange("licenseTerms", e.target.value)
                      }
                      disabled={isProcessing}
                    >
                      <option value="Non-commercial use only">
                        Non-commercial use only
                      </option>
                      <option value="Commercial use allowed">
                        Commercial use allowed
                      </option>
                      <option value="Educational use only">
                        Educational use only
                      </option>
                      <option value="Research use only">
                        Research use only
                      </option>
                      <option value="Attribution required">
                        Attribution required
                      </option>
                      <option value="Custom license">Custom license</option>
                    </select>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="col-12">
                    <label
                      htmlFor="itemThumbnailImages"
                      className="form-label text-white"
                    >
                      Thumbnail Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="form-control bg-dark text-white border-dark"
                      id="itemThumbnailImages"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 5) {
                          window.alert("Maximum 5 images allowed");
                          return;
                        }

                        const imagePromises = files.map((file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              resolve(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          });
                        });

                        Promise.all(imagePromises).then((base64Strings) => {
                          handleItemFormChange(
                            "thumbnailImages",
                            base64Strings
                          );
                        });
                      }}
                      disabled={isProcessing}
                    />
                    <div className="form-text text-muted">
                      Maximum 5 images, Max size: 1MB each
                    </div>
                    {itemFormData.thumbnailImages &&
                      itemFormData.thumbnailImages.length > 0 && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          {itemFormData.thumbnailImages.map((image, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="img-thumbnail"
                                style={{
                                  maxHeight: "100px",
                                  maxWidth: "100px",
                                }}
                              />
                              <button
                                type="button"
                                className="position-absolute top-0 end-0"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  backgroundColor: "white",
                                  borderRadius: "100%",
                                  height: "20px",
                                  width: "20px",
                                }}
                                onClick={() => {
                                  const newImages =
                                    itemFormData.thumbnailImages.filter(
                                      (_, i) => i !== index
                                    );
                                  handleItemFormChange(
                                    "thumbnailImages",
                                    newImages
                                  );
                                }}
                                disabled={isProcessing}
                              >
                                <p
                                  style={{
                                    color: "red",
                                    marginLeft: "5px",
                                    marginBottom: "2px",
                                  }}
                                >
                                  x
                                </p>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* 👇 footer always visible */}
              <div
                className="modal-footer border-top border-dark"
                style={{ flexShrink: 0 }}
              >
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleUpdateItem}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Item"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-tertiary">
              <div className="modal-header border-bottom border-dark">
                <h5 className="modal-title text-white">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isProcessing}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-white">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
              </div>
              <div className="modal-footer border-top border-dark">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--quaternary"
                  onClick={handleConfirmDelete}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Item"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
