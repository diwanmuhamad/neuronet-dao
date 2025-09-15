"use client";
import { useState, useEffect, useRef } from "react";

interface CustomCursorProps {
  onTitleMouseEnter: () => void;
  onTitleMouseLeave: () => void;
}

const CustomCursor: React.FC<CustomCursorProps> = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isCursorBig, setIsCursorBig] = useState(false);
  const tickingRef = useRef(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    window.requestAnimationFrame(() => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      tickingRef.current = false;
    });
  };

  const handleCursorHover = () => {
    setIsCursorHovering(true);
  };

  const handleCursorLeave = () => {
    setIsCursorHovering(false);
  };

  const handleMouseEnterTitle = () => {
    setIsCursorBig(true);
  };

  const handleMouseLeaveTitle = () => {
    setIsCursorBig(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true } as any);

    const titleElements = document.querySelectorAll(".zig");
    const clickableElements = document.querySelectorAll("a, button");

    titleElements.forEach((titleElement) => {
      titleElement.addEventListener("mouseover", handleMouseEnterTitle, { passive: true } as any);
      titleElement.addEventListener("mouseout", handleMouseLeaveTitle, { passive: true } as any);
    });

    clickableElements.forEach((clickableElement) => {
      clickableElement.addEventListener("mouseenter", handleCursorHover, { passive: true } as any);
      clickableElement.addEventListener("mouseleave", handleCursorLeave, { passive: true } as any);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);

      titleElements.forEach((titleElement) => {
        titleElement.removeEventListener("mouseover", handleMouseEnterTitle as any);
        titleElement.removeEventListener("mouseout", handleMouseLeaveTitle as any);
      });

      clickableElements.forEach((clickableElement) => {
        clickableElement.removeEventListener("mouseenter", handleCursorHover as any);
        clickableElement.removeEventListener("mouseleave", handleCursorLeave as any);
      });
    };
  }, []);

  return (
    <>
      <div
        className={`mouseCursor cursor-outer ${
          isCursorHovering ? "cursor-hover" : ""
        } ${isCursorBig ? "cursor-big" : ""}`}
        style={{
          transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      <div
        className={`mouseCursor cursor-inner ${
          isCursorHovering ? "cursor-hover" : ""
        } ${isCursorBig ? "cursor-big" : ""}`}
        style={{
          transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <span>Drag</span>
      </div>
    </>
  );
};

export default CustomCursor;
