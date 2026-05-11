// Contact controller — public form submission + admin inbox management
import Contact from "../models/contact.model.js";
import { sendContactReply, sendContactToAdmin } from "../utils/email.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// POST /api/contact — public form submission
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, 400, "All fields are required.");
    }

    // Save to DB
    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      subject,
      message,
    });

    // Forward to the admin inbox + send the user an acknowledgement
    sendContactToAdmin({ name, email, subject, message });
    sendContactReply(email, name);

    return successResponse(res, 201, "Message sent successfully.", { contact });
  } catch (error) {
    return errorResponse(res, 500, "Failed to send message.", error.message);
  }
};

// GET /api/contact/admin/all — admin inbox
export const adminGetAllMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total] = await Promise.all([
      Contact.find(query).sort("-createdAt").skip(skip).limit(Number(limit)),
      Contact.countDocuments(query),
    ]);

    return successResponse(res, 200, "Messages fetched.", {
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch messages.", error.message);
  }
};

// PATCH /api/contact/admin/:id/status — mark as read / replied
export const adminUpdateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "replied"].includes(status)) {
      return errorResponse(res, 400, "Invalid status.");
    }
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true },
    );
    if (!message) return errorResponse(res, 404, "Message not found.");
    return successResponse(res, 200, "Message status updated.", { message });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to update message status.",
      error.message,
    );
  }
};

// DELETE /api/contact/admin/:id
export const adminDeleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return errorResponse(res, 404, "Message not found.");
    return successResponse(res, 200, "Message deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete message.", error.message);
  }
};
