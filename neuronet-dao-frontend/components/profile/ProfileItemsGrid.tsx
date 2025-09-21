"use client";
import React from "react";
import Image from "next/image";
import { Item } from "@/src/components/Items/interfaces";
import SecureImage from "../containers/SecureImage";

type Props = {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
  onOpen: (itemId: number) => void;
};

const ProfileItemsGrid: React.FC<Props> = ({ items, onEdit, onDelete, onOpen }) => {
  return (
    <div className="mb-5">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-grid-3x3-gap text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
        <h2 className="title text-white mb-0">My Items ({items.length})</h2>
      </div>

      {items.length > 0 ? (
        <div className="row g-4">
          {items.map((item) => {
            const imageUrl = item.thumbnailImages && item.thumbnailImages.length > 0 ? item.thumbnailImages[0] : "/placeholder_default.svg";
            return (
              <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div
                  className="bg-quaternary rounded-3 overflow-hidden h-100 transition-all position-relative"
                  style={{ transition: "all 0.3s ease", transform: "scale(1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 z-3">
                    <button
                      className="btn btn-sm btn--primary rounded-full px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      title="Edit item"
                    >
                      <i className="bi bi-pencil ml-1 mt-1"></i>
                    </button>
                    <button
                      className="btn btn-sm btn--quaternary rounded-full px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      title="Delete item"
                    >
                      <i className="bi bi-trash ml-1"></i>
                    </button>
                  </div>

                  <div className="cursor-pointer" onClick={() => onOpen(item.id)}>
                    <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                      <SecureImage
                        src={imageUrl}
                        alt={item.title}
                        width={200}
                        height={128}
                        className="object-fit-cover"
                      />
                    </div>

                    <div className="p-3">
                      <h3
                        className="text-white fw-5 mb-2"
                        style={{ fontSize: "0.95rem", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                      >
                        {item.title}
                      </h3>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-white fw-7" style={{ fontSize: "0.9rem" }}>
                          {(Number(item.price) / 100_000_000).toFixed(2)} ICP
                        </span>
                        {item.averageRating > 0 && (
                          <div className="d-flex align-items-center text-warning" style={{ fontSize: "0.8rem" }}>
                            <i className="bi bi-star-fill me-1"></i>
                            <span>{item.averageRating.toFixed(1)}</span>
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
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-inbox text-quinary" style={{ fontSize: "3rem" }}></i>
          </div>
          <h3 className="text-white fw-6 mb-3">No items yet</h3>
          <p className="text-quinary mb-4" style={{ fontSize: "1rem" }}>
            Start creating your first item to build your portfolio!
          </p>
          {/* Caller can render a CTA if desired */}
        </div>
      )}
    </div>
  );
};

export default ProfileItemsGrid;


