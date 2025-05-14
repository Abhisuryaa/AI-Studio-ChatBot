"use client";
import { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, #a5b4fc 0%, #f0abfc 40%, #f9fafb 80%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 transition-all duration-300"
      style={{ pointerEvents: "none", minHeight: "100vh" }}
    />
  );
} 