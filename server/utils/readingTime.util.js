// Computes the estimated reading time (in minutes) from HTML article content.
// Strips HTML tags, counts plain-text words, and divides by an average reading speed of ~200 words per minute.

const WORDS_PER_MINUTE = 200;

export const calculateReadingTime = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== "string") return 1;

  // Strip HTML tags and decode common HTML entities to plain text
  const plainText = htmlContent
    .replace(/<[^>]*>/g, " ") // remove HTML tags
    .replace(/&nbsp;/g, " ") // convert &nbsp; to space
    .replace(/&[a-z]+;/gi, " ") // strip other named entities
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

  // Count words by splitting on whitespace
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  // At least 1 minute for any non-empty article
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return minutes;
};
