"use client";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthButton: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();

  if (loading) {
    return (
      <button
        disabled
        className="open-offcanvas"
        aria-label="loading"
        title="loading"
        style={{
          cursor: "not-allowed",
          opacity: 0.6,
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid currentColor",
            borderTop: "2px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </button>
    );
  }

  if (isAuthenticated) {
    return null; // OffcanvasInfo handles authenticated state
  }

  return (
    <button
      onClick={login}
      className="open-offcanvas"
      aria-label="login"
      title="login"
      style={{
        cursor: "pointer",
      }}
    >
      <i className="bi bi-box-arrow-in-right"></i>
    </button>
  );
};

export default AuthButton;
