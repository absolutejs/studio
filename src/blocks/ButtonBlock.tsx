import React from "react";

type ButtonBlockProps = {
  text?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
};

export const ButtonBlock = ({
  text = "Click me",
  href = "#",
  variant = "primary",
}: ButtonBlockProps) => (
  <a
    href={href}
    data-variant={variant}
    style={{
      display: "inline-block",
      padding: "10px 24px",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: 600,
      cursor: "pointer",
      ...(variant === "primary" && {
        backgroundColor: "#89b4fa",
        color: "#1e1e2e",
        border: "none",
      }),
      ...(variant === "secondary" && {
        backgroundColor: "#45475a",
        color: "#cdd6f4",
        border: "none",
      }),
      ...(variant === "outline" && {
        backgroundColor: "transparent",
        color: "#89b4fa",
        border: "2px solid #89b4fa",
      }),
    }}
  >
    {text}
  </a>
);
