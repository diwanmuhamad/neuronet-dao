"use client";
import React from "react";

type Props = {
  displayName: string;
  avatarLetter: string;
  editing: boolean;
  onToggleEditing: () => void;
  bioSection: React.ReactNode;
  statsSection: React.ReactNode;
};

const ProfileHeader: React.FC<Props> = ({
  displayName,
  avatarLetter,
  editing,
  onToggleEditing,
  bioSection,
  statsSection,
}) => {
  return (
    <div className="bg-quaternary rounded-3 mb-5 overflow-hidden">
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

      <div className="position-relative" style={{ marginTop: "-60px", zIndex: 10 }}>
        <div className="px-4 pb-4">
          <div className="d-flex align-items-end mb-4">
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
              <span className="text-white">{avatarLetter}</span>
            </div>

            <div className="flex-grow-1">
              <h1 className="text-white fw-7 mb-2" style={{ fontSize: "1.75rem" }}>
                @{displayName}...
              </h1>
              <div className="d-flex align-items-center gap-3">
                <button onClick={onToggleEditing} className="btn btn--primary btn-sm" disabled={editing}>
                  <i className="bi bi-pencil me-2"></i>
                  {editing ? "Editing..." : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {bioSection}

          {statsSection}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;


