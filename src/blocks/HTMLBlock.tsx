import React from "react";

type HTMLBlockProps = {
  html?: string;
};

export const HTMLBlock = ({ html = "" }: HTMLBlockProps) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);
