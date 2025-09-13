"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { useCategories } from "@/src/hooks/useCategories";
import { Item } from "@/src/components/Items/interfaces";
import { getActor } from "@/src/ic/agent";
import { usePathname } from "next/navigation";
import CreatorProfile from "@/src/components/user/creatorProfile";
import StarRating from "@/src/components/ratings/starRating";

const ITEMS_PER_PAGE = 8;
export interface Category {
  id: number;
  name: string;
  itemType: string;
  description: string;
}

const ShopSection = (props: { type: "prompt" | "dataset" | "ai_output" }) => {
  const { identity } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const pathname = usePathname();

  const fetchItems = useCallback(
    async (page: number, limit: number): Promise<Item[]> => {
      try {
        const actor = await getActor(identity || undefined);
        const items = (await actor.get_items_by_type_paginated(
          props.type,
          page,
          limit
        )) as Item[];

        const processedItems = items.map((item: any) => ({
          ...item,
          owner: item.owner.toText(),
        }));
        return processedItems as Item[];
      } catch (error) {
        console.error("Failed to fetch items:", error);
        throw new Error("Failed to fetch items");
      }
    },
    [identity, props.type]
  );

  const fetchTotalCount = useCallback(async () => {
    try {
      const actor = await getActor(identity || undefined);
      const count = await actor.get_items_count_by_type(props.type);
      setTotalItems(Number(count));
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  }, [identity, props.type]);

  const setItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const newItems = await fetchItems(currentPage - 1, ITEMS_PER_PAGE);
      setItems(newItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = React.useMemo(() => {
    let itemsData = [...items];

    // Filter by search term
    if (searchTerm.trim()) {
      itemsData = itemsData.filter(
        (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())
        // ||
        //   item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      itemsData = itemsData.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    return itemsData;
  }, [searchTerm, selectedCategories, items]);

  const fetchCategories = async (itemType?: string) => {
    setLoading(true);
    setError(null);

    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.get_categories(itemType ? [itemType] : []);
      setCategories(result as Category[]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryName: string, isChecked: boolean) => {
    setSelectedCategories((prev) => {
      if (isChecked) {
        return [...prev, categoryName];
      } else {
        return prev.filter((cat) => cat !== categoryName);
      }
    });
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchCategories(props.type);
    fetchTotalCount();
    setItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type, currentPage, pathname]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <section className="section shop sticky-parent">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="shop__sidebar sticky-item">
              <div className="shop-sidebar-single shop-search-bar">
                <form action="#" method="post">
                  <div className="search-group">
                    <input
                      type="text"
                      name="product-search"
                      id="ProductSearch"
                      placeholder="Search.."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                    />
                    <button type="submit">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </form>
              </div>
              <div className="shop-sidebar-single shop-category">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="title-animation fw-6 text-white mt-12">
                    Category
                  </h3>
                  {(selectedCategories.length > 0 || searchTerm.trim()) && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="btn btn--quaternary btn-sm"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <ul className="check-group">
                  {categories.map((category) => (
                    <li className="check-group-single" key={category.id}>
                      <input
                        type="checkbox"
                        name={`product-${category.name}`}
                        id={`product${category.name}`}
                        checked={selectedCategories.includes(category.name)}
                        onChange={(e) =>
                          handleCategoryChange(category.name, e.target.checked)
                        }
                      />
                      <label htmlFor={`product${category.name}`}>
                        {category.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div className="shop-sidebar-single shop-type">
                <h3 className="title-animation fw-6 text-white mt-12">Type</h3>
                <ul className="check-group">
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-Chatgpt"
                      id="productChatgpt"
                    />
                    <label htmlFor="productChatgpt">Chatgpt</label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-Midjourney"
                      id="productMidjourney"
                    />
                    <label htmlFor="productMidjourney">Midjourney</label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-Bard"
                      id="productBard"
                    />
                    <label htmlFor="productBard">Bard</label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-Dalle"
                      id="productDalle"
                    />
                    <label htmlFor="productDalle">Dalle</label>
                  </li>
                </ul>
              </div>
              <div className="shop-sidebar-single shop-price">
                <h3 className="title-animation fw-6 text-white mt-12">Price</h3>
                <div className="price-box">
                  <CustomRangeSlider />
                </div>
              </div>
              <div className="shop-sidebar-single shop-rating">
                <h3 className="title-animation fw-6 text-white mt-12">
                  Rating
                </h3>
                <ul className="check-group">
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-FiveStar"
                      id="productFiveStar"
                    />
                    <label htmlFor="productFiveStar">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-FourStar"
                      id="productFourStar"
                    />
                    <label htmlFor="productFourStar">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-ThreeStar"
                      id="productThreeStar"
                    />
                    <label htmlFor="productThreeStar">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-TwoStar"
                      id="productTwoStar"
                    />
                    <label htmlFor="productTwoStar">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </label>
                  </li>
                  <li className="check-group-single">
                    <input
                      type="checkbox"
                      name="product-OneStar"
                      id="productOneStar"
                    />
                    <label htmlFor="productOneStar">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </label>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div className="shop__content sticky-item">
              {/* Results count and filter status */}
              {/* {!loading && items.length > 0 && (
                <div className="mb-3">
                  <p className="text-white">
                    Showing {filteredItems.length} of {items.length} items
                    {(selectedCategories.length > 0 || searchTerm.trim()) && (
                      <span className="ms-2">
                        (filtered by{" "}
                        {selectedCategories.length > 0 ? "categories" : ""}
                        {selectedCategories.length > 0 && searchTerm.trim()
                          ? " and "
                          : ""}
                        {searchTerm.trim() ? "search term" : ""})
                      </span>
                    )}
                  </p>
                </div>
              )} */}

              {loading && items.length === 0 ? (
                <p style={{ textAlign: "center" }}>Loading items...</p>
              ) : filteredItems.length === 0 ? (
                <p style={{ textAlign: "center" }}>
                  {items.length === 0
                    ? "No items found."
                    : "No items match your current filters. Try adjusting your search or category selection."}
                </p>
              ) : (
                <div className="row gaper">
                  {filteredItems.map((item) => {
                    return (
                      <div className="col-12 col-md-6 slide-top" key={item.id}>
                        <div className="category__single topy-tilt">
                          <div className="thumb">
                            <Link href={`/marketplace/items/${item.id}`} className="thumb-img">
                              <Image
                                src={item.thumbnailImages[0]}
                                width={266}
                                height={200}
                                alt="Image"
                                priority
                              />
                            </Link>
                            <Link href="shop" className="tag">
                              {/* <Image
                              src={item.categoryLogo}
                              alt="Image"
                              priority
                            /> */}
                              {item.category}
                            </Link>
                          </div>
                          <div className="content">
                            <h5>
                              <Link href={`/marketplace/items/${item.id}`}>{item.title}</Link>
                            </h5>
                            <p className="tertiary-text">
                              {(Number(item.price) / 100_000_000).toFixed(2)}{" "}
                              ICP
                            </p>
                          </div>
                          <hr />
                          <div className="meta">
                            <CreatorProfile owner={item.owner} />
                            {item.averageRating > 0 && (
                              <StarRating
                                rating={item.averageRating}
                                totalRatings={item.totalRatings}
                              />
                            )}
                          </div>
                          <div className="cta">
                            <Link
                              href={`/marketplace/items/${item.id}`}
                              className="btn btn--quaternary"
                            >
                              {props.type === "prompt" 
                                ? "View Prompts" 
                                : props.type === "dataset" 
                                ? "View Dataset" 
                                : "View AI Output"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="row">
                <div className="col-12">
                  <div className="section__cta">
                    <ul className="pagination">
                      <li>
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>
                      <li>
                        <Link href="" className="active">
                          {currentPage}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <button
                          disabled={
                            currentPage ===
                            Math.ceil(totalItems / ITEMS_PER_PAGE)
                          }
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
