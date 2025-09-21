"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SecureImage from "@/components/containers/SecureImage";

interface ContentDisplayProps {
  contentRetrievalUrl: string;
  itemType: string;
  fileName: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  contentRetrievalUrl,
  itemType,
  fileName,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentRetrievalUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }

        console.log("contentRetrievalUrl", contentRetrievalUrl, response);

        if (itemType === "ai_output") {
          // For AI outputs, the URL is already an image URL
          setContent(contentRetrievalUrl);
        } else {
          // For prompt and dataset content, handle text encoding properly
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('application/json')) {
            const jsonContent = await response.json();
            setContent(JSON.stringify(jsonContent, null, 2));
          } else if (contentType.includes('text/') || itemType === 'prompt' || itemType === 'dataset') {
            const textContent = await response.text();
            setContent(textContent);
          } else {
            // For binary or unknown content, try to decode as text
            const arrayBuffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const textContent = decoder.decode(arrayBuffer);
            setContent(textContent);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentRetrievalUrl, itemType]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ padding: "32px 0" }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error loading content</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (itemType === "ai_output") {
    return (
      <div className="d-flex justify-content-center">
        <SecureImage
          src={content}
          alt="AI Output"
          width={300}
          height={300}
          className="w-100 h-auto"
        />
      </div>
    );
  }

  if (itemType === "dataset") {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontSize: "12px", color: "#b1b0b6" }}>
            CSV Dataset
          </span>
          <button
            onClick={() => {
              const blob = new Blob([content], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName || "dataset.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="btn btn--primary"
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            Download
          </button>
        </div>
        <pre
          style={{
            color: "#b1b0b6",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            maxHeight: "240px",
            overflow: "auto",
            backgroundColor: "#120f23",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #414141",
          }}
        >
          {content}
        </pre>
      </div>
    );
  }

  return (
    <span
      style={{
        color: "#e4e4e7",
        whiteSpace: "pre-wrap",
        fontSize: "14px",
        maxHeight: "240px",
        overflow: "auto",
        padding: "12px",
        backgroundColor: "#120f23",
        borderRadius: "10px",
        border: "1px solid #414141",
      }}
    >
      {content}
    </span>
  );
};

export default ContentDisplay;
