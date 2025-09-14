"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../src/contexts/AuthContext";
import { getActor } from "../../src/ic/agent";
import { AnonymousIdentity } from "@dfinity/agent";
import { useRouter } from "next/navigation";
import Header from "../layout/header/Header";
import FooterTwo from "../layout/footer/FooterTwo";
import InitCustomCursor from "../layout/InitCustomCursor";
import ScrollProgressButton from "../layout/ScrollProgressButton";
import Animations from "../layout/Animations";
import { Item } from "../../src/components/Items/interfaces";
import { User } from "../../src/components/user/interfaces";
import useDebounce from "../../src/hooks/useDebounce";
import Image from "next/image";
import { formatDate } from "@/src/utils/dateUtils";

const ProfilePage = () => {
  const { principal, isAuthenticated, identity } = useAuth();
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
      setUserItems(processedItems);
    } catch (error) {
      console.error("Failed to fetch user items:", error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  if (!isAuthenticated) {
    return (
      <div className="my-app">
        <Header />
        <main>
          <div className="section">
            <div className="container">
              <div className="text-center">
                <h2 className="title text-white mb-4">Authentication Required</h2>
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
                  <div className="position-relative" style={{ height: '120px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, rgba(101, 255, 75, 0.1) 0%, rgba(64, 204, 40, 0.1) 100%)' }}></div>
                  </div>
                  
                  {/* Profile Content - Well-structured profile info */}
                  <div className="position-relative" style={{ marginTop: '-60px', zIndex: 10 }}>
                    <div className="px-4 pb-4">
                      {/* Avatar and Basic Info Row */}
                      <div className="d-flex align-items-end mb-4">
                        {/* Avatar - Large, prominent avatar */}
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-4 border-4 border-quaternary shadow-lg"
                          style={{ 
                            width: '120px', 
                            height: '120px', 
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
                            fontSize: '2.5rem',
                            fontWeight: '700'
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
                          <h1 className="text-white fw-7 mb-2" style={{ fontSize: '1.75rem' }}>
                            @{user?.firstName
                              ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                              : principal?.substring(0, 8)}...
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
                                  style={{ backgroundColor: 'var(--tertiary-color)', border: '1px solid #414141', color: 'white' }}
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
                                  style={{ backgroundColor: 'var(--tertiary-color)', border: '1px solid #414141', color: 'white' }}
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
                                  style={{ backgroundColor: 'var(--tertiary-color)', border: '1px solid #414141', color: 'white' }}
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
                                  style={{ backgroundColor: 'var(--tertiary-color)', border: '1px solid #414141', color: 'white' }}
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
                              <p className="text-quinary mb-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                {user.bio}
                              </p>
                            ) : (
                              <p className="text-quinary mb-0" style={{ fontSize: '1rem' }}>
                                No bio available. Click &quot;Edit Profile&quot; to add one.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Platform Stats - Clean stats row */}
                      <div className="row g-3 text-quinary" style={{ fontSize: '0.9rem' }}>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar3 me-2 text-primary"></i>
                            <span>
                              Joined: {user?.createdAt
                                ? formatDate(user.createdAt)
                                : "Information unavailable"}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-currency-dollar me-2 text-primary"></i>
                            <span>
                              Rate: ${user?.rate
                                ? (user.rate / 100).toFixed(0)
                                : "Information unavailable"}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Section - Clean search bar */}
                <div className="mb-5">
                  <div className="subscribe-form" style={{ maxWidth: '500px' }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search @${
                        user?.firstName
                          ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
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
                    <i className="bi bi-grid-3x3-gap text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                    <h2 className="title text-white mb-0">My Items ({userItems.length})</h2>
                  </div>

                  {userItems.length > 0 ? (
                    /* Items Grid - Responsive grid layout */
                    <div className="row g-4">
                      {userItems.map((item) => {
                        const imageUrl = item.thumbnailImages && item.thumbnailImages.length > 0
                          ? item.thumbnailImages[0]
                          : "/placeholder_default.svg";
                        return (
                          <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <div
                              className="bg-quaternary rounded-3 overflow-hidden h-100 cursor-pointer transition-all"
                              onClick={() => handleItemClick(item.id)}
                              style={{ 
                                transition: 'all 0.3s ease',
                                transform: 'scale(1)'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              {/* Item Image */}
                              <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                <Image
                                  src={imageUrl}
                                  alt={item.title}
                                  fill
                                  className="object-fit-cover"
                                />
                              </div>
                              
                              {/* Item Content */}
                              <div className="p-3">
                                <h3 className="text-white fw-5 mb-2" style={{ 
                                  fontSize: '0.95rem', 
                                  lineHeight: '1.4',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {item.title}
                                </h3>
                                <div className="d-flex align-items-center justify-content-between">
                                  <span className="text-white fw-7" style={{ fontSize: '0.9rem' }}>
                                    {(Number(item.price) / 100_000_000).toFixed(2)} ICP
                                  </span>
                                  {item.averageRating > 0 && (
                                    <div className="d-flex align-items-center text-warning" style={{ fontSize: '0.8rem' }}>
                                      <i className="bi bi-star-fill me-1"></i>
                                      <span>{item.averageRating.toFixed(1)}</span>
                                    </div>
                                  )}
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
                        <i className="bi bi-inbox text-quinary" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h3 className="text-white fw-6 mb-3">No items yet</h3>
                      <p className="text-quinary mb-4" style={{ fontSize: '1rem' }}>
                        Start creating your first item to build your portfolio!
                      </p>
                      <button 
                        className="btn btn--primary"
                        onClick={() => router.push('/create-item')}
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
    </div>
  );
};

export default ProfilePage;