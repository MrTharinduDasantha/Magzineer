// Human-readable date formatters used across the UI
import { format, formatDistanceToNow, parseISO } from "date-fns";

// Returns "Jan 15, 2026"
export const formatDate = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(d, "MMM d, yyyy");
};

// Returns "January 15, 2026"
export const formatDateLong = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(d, "MMMM d, yyyy");
};

// Returns "Jan 15, 2026 · 3:42 PM"
export const formatDateTime = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(d, "MMM d, yyyy · h:mm a");
};

// Returns "3 hours ago", "yesterday", etc.
export const formatRelative = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
};
