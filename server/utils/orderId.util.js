// Generates a short, human-readable order ID for purchases and subscriptions
// Format: MZ-XXXXXX (6 uppercase alphanumerics)

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit confusing chars (0, O, 1, I)

export const generateOrderId = () => {
  let id = "MZ-";
  for (let i = 0; i < 6; i++) {
    id += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return id;
};
