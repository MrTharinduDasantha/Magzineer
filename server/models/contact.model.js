// Contact model — stores submissions from the public Contact Us form
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
    },
    // Admin can mark messages as read/replied for inbox management
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
