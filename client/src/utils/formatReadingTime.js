// Returns "6 min read" — falls back gracefully on 0 or undefined
export const formatReadingTime = (minutes) => {
  const m = Number(minutes) || 0;
  if (m <= 0) return "1 min read";
  if (m === 1) return "1 min read";
  return `${m} min read`;
};
