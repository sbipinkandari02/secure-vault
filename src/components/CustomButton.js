import React from "react";
import "../styles/Button.css";

export default function CustomButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button type={type} onClick={onClick} className={`app-button ${className}`}>
      {children}
    </button>
  );
}
