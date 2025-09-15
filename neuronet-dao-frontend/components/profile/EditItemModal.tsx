"use client";
import React from "react";

type ItemType = "prompt" | "dataset" | "ai_output";

type Props = {
  isOpen: boolean;
  isProcessing: boolean;
  itemFormData: {
    title: string;
    description: string;
    content: string;
    price: string;
    itemType: ItemType;
    category: string;
    licenseTerms: string;
    thumbnailImages: string[];
    contentHash: string;
    contentFileKey: string;
    contentFileName: string;
    contentRetrievalUrl: string;
  };
  categoriesByType: (itemType: ItemType) => { id: string | number; name: string }[];
  onClose: () => void;
  onUpdate: () => void;
  onChange: (field: string, value: string | string[]) => void;
};

const EditItemModal: React.FC<Props> = ({
  isOpen,
  isProcessing,
  itemFormData,
  categoriesByType,
  onClose,
  onUpdate,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "flex",
        position: "fixed",
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
        style={{ maxWidth: "900px", width: "100%", height: "80vh", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-content bg-tertiary" style={{ display: "flex", flexDirection: "column", height: "1000px", maxHeight: "100%" }}>
          <div className="modal-header border-bottom border-dark" style={{ flexShrink: 0 }}>
            <h5 className="modal-title text-white">Edit Item</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={isProcessing}></button>
          </div>

          <div className="modal-body" style={{ flex: 1, maxHeight: "calc(100vh - 200px)", overflowY: "auto", overflowX: "hidden", padding: "1rem" }}>
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="itemTitle" className="form-label text-white">Title</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-dark"
                  id="itemTitle"
                  value={itemFormData.title}
                  onChange={(e) => onChange("title", e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="itemPrice" className="form-label text-white">Price (ICP)</label>
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
                      onChange("price", truncated);
                    } else {
                      onChange("price", value);
                    }
                  }}
                  disabled={isProcessing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="itemType" className="form-label text-white">Item Type</label>
                <select
                  className="form-control bg-dark text-white border-dark"
                  id="itemType"
                  value={itemFormData.itemType}
                  onChange={(e) => {
                    onChange("itemType", e.target.value as ItemType);
                    onChange("category", "");
                  }}
                  disabled={isProcessing}
                >
                  <option value="prompt">Prompt</option>
                  <option value="dataset">Dataset</option>
                  <option value="ai_output">AI Output</option>
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="itemCategory" className="form-label text-white">Category</label>
                <select
                  className="form-control bg-dark text-white border-dark"
                  id="itemCategory"
                  value={itemFormData.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="">Choose a category</option>
                  {categoriesByType(itemFormData.itemType).map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="itemContent" className="form-label text-white">Content</label>
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
                            window.alert("File size exceeds 1MB limit. Please choose a smaller image.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            onChange("content", result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      disabled={isProcessing}
                    />
                    <div className="form-text text-white mt-3">JPG, PNG (MAX. 1MB)</div>
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
                            window.alert("File size exceeds 1MB limit. Please choose a smaller CSV file.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            onChange("content", result);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      disabled={isProcessing}
                    />
                    <div className="form-text text-white mt-3">CSV format (MAX. 1MB)</div>
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
                        window.alert("Content size exceeds 1MB limit. Please use shorter text.");
                        return;
                      }
                      onChange("content", value);
                    }}
                    disabled={isProcessing}
                    placeholder={itemFormData.itemType === "prompt" ? "Enter your AI prompt..." : "Enter content..."}
                  />
                )}
              </div>

              <div className="col-12">
                <label htmlFor="itemDescription" className="form-label text-white">Description</label>
                <textarea
                  className="form-control bg-dark text-white border-dark"
                  id="itemDescription"
                  rows={4}
                  value={itemFormData.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  disabled={isProcessing}
                  placeholder="Describe your item and its use cases..."
                />
              </div>

              <div className="col-12">
                <label htmlFor="itemLicenseTerms" className="form-label text-white">License Terms</label>
                <select
                  className="form-control bg-dark text-white border-dark"
                  id="itemLicenseTerms"
                  value={itemFormData.licenseTerms}
                  onChange={(e) => onChange("licenseTerms", e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="Non-commercial use only">Non-commercial use only</option>
                  <option value="Commercial use allowed">Commercial use allowed</option>
                  <option value="Educational use only">Educational use only</option>
                  <option value="Research use only">Research use only</option>
                  <option value="Attribution required">Attribution required</option>
                  <option value="Custom license">Custom license</option>
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="itemThumbnailImages" className="form-label text-white">Thumbnail Images</label>
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
                      onChange("thumbnailImages", base64Strings);
                    });
                  }}
                  disabled={isProcessing}
                />
                <div className="form-text text-muted">Maximum 5 images, Max size: 1MB each</div>
                {itemFormData.thumbnailImages && itemFormData.thumbnailImages.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {itemFormData.thumbnailImages.map((image, index) => (
                      <div key={index} className="position-relative">
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="img-thumbnail" style={{ maxHeight: "100px", maxWidth: "100px" }} />
                        <button
                          type="button"
                          className="position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)", backgroundColor: "white", borderRadius: "100%", height: "20px", width: "20px" }}
                          onClick={() => {
                            const newImages = itemFormData.thumbnailImages.filter((_, i) => i !== index);
                            onChange("thumbnailImages", newImages);
                          }}
                          disabled={isProcessing}
                        >
                          <p style={{ color: "red", marginLeft: "5px", marginBottom: "2px" }}>x</p>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer border-top border-dark" style={{ flexShrink: 0 }}>
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary" onClick={onUpdate} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
  );
};

export default EditItemModal;


