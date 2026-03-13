import React from "react";

type TextBlockProps = {
  text?: string;
  align?: string;
};

export const TextBlock = ({
  text = "Enter text...",
  align = "left",
}: TextBlockProps) => (
  <p style={{ textAlign: align as React.CSSProperties["textAlign"] }}>{text}</p>
);
