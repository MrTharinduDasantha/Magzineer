// Strip HTML tags and condense whitespace to produce a plain-text excerpt
export const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Return the first `maxLength` characters with an ellipsis if truncated
export const truncate = (text, maxLength = 160) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
};

// Convenience — strip HTML and truncate in one go
export const excerptFromHtml = (html, maxLength = 160) =>
  truncate(stripHtml(html), maxLength);
