"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const ProfileSearchBar: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <div className="mb-5">
      <div className="subscribe-form" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button type="button">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
};

export default ProfileSearchBar;


