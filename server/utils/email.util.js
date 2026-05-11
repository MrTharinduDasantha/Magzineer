// Nodemailer helpers — transactional emails wrapped in a branded
// light-theme editorial HTML template
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// SMTP transporter configured from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ------------------------------------------------------------------
// Branded HTML wrapper — Magzineer editorial light theme
// (ivory background, charcoal text, crimson + gold accents)
// ------------------------------------------------------------------
const wrapTemplate = (title, bodyHtml) => `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#FAF7F2; padding:40px 0; color:#1A1A1A;">
    <div style="max-width:600px; margin:0 auto; background:#FFFFFF; border:1px solid #EFE7DA; border-radius:6px; overflow:hidden;">
      <div style="padding:32px 40px; border-bottom:3px solid #C73E3A;">
        <h1 style="margin:0; font-family: Georgia, serif; font-size:28px; letter-spacing:1px; color:#1A1A1A;">
          Magzineer
        </h1>
        <p style="margin:4px 0 0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#B89968;">
          Editorial Excellence
        </p>
      </div>
      <div style="padding:32px 40px;">
        <h2 style="margin:0 0 16px; font-size:22px; color:#1A1A1A;">${title}</h2>
        <div style="font-family: Helvetica, Arial, sans-serif; font-size:15px; line-height:1.7; color:#3A3A3A;">
          ${bodyHtml}
        </div>
      </div>
      <div style="padding:24px 40px; background:#F5EFE6; text-align:center; font-family: Helvetica, Arial, sans-serif; font-size:12px; color:#8C8378;">
        © ${new Date().getFullYear()} Magzineer. All rights reserved.
      </div>
    </div>
  </div>
`;

// Core send helper used by every email function below
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Magzineer" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error.message);
  }
};

// ---------- Email templates ----------

// 1. Welcome email — sent right after a successful registration
export const sendWelcomeEmail = async (to, name) => {
  const body = `
    <p>Hello ${name},</p>
    <p>Welcome to <strong>Magzineer</strong> — your new home for thoughtful, beautifully crafted journalism.</p>
    <p>Browse our latest issues, bookmark articles you love, and consider subscribing for unlimited access to our premium library.</p>
    <p style="margin-top:24px; color:#8C8378;">Happy reading,<br/>The Magzineer Editorial Team</p>
  `;
  await sendEmail(
    to,
    "Welcome to Magzineer",
    wrapTemplate("Welcome aboard", body),
  );
};

// 2. Subscription confirmation — sent after a successful subscription payment
export const sendSubscriptionConfirmation = async (
  to,
  name,
  planName,
  endDate,
) => {
  const formatted = new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const body = `
    <p>Hello ${name},</p>
    <p>Your <strong>${planName}</strong> subscription is now active. Thank you for supporting independent editorial journalism.</p>
    <p>Your current billing period ends on <strong>${formatted}</strong>.</p>
    <p>Enjoy unlimited access to every premium article across our magazines.</p>
    <p style="margin-top:24px; color:#8C8378;">— The Magzineer Editorial Team</p>
  `;
  await sendEmail(
    to,
    "Your Magzineer subscription is active",
    wrapTemplate("Subscription confirmed", body),
  );
};

// 3. Subscription cancellation notice
export const sendSubscriptionCancellation = async (to, name, endDate) => {
  const formatted = new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const body = `
    <p>Hello ${name},</p>
    <p>We've received your cancellation request. You'll continue to enjoy full subscriber access until <strong>${formatted}</strong>.</p>
    <p>We'd love to have you back anytime.</p>
    <p style="margin-top:24px; color:#8C8378;">— The Magzineer Editorial Team</p>
  `;
  await sendEmail(
    to,
    "Subscription cancellation",
    wrapTemplate("Cancellation received", body),
  );
};

// 4. Single-issue purchase receipt
export const sendPurchaseReceipt = async (
  to,
  name,
  issueTitle,
  amount,
  orderId,
) => {
  const body = `
    <p>Hello ${name},</p>
    <p>Thank you for your purchase. Your receipt details are below:</p>
    <table style="width:100%; margin:16px 0; border-collapse:collapse;">
      <tr><td style="padding:8px 0; color:#8C8378;">Issue</td><td style="padding:8px 0; text-align:right;"><strong>${issueTitle}</strong></td></tr>
      <tr><td style="padding:8px 0; color:#8C8378;">Order ID</td><td style="padding:8px 0; text-align:right;"><strong>${orderId}</strong></td></tr>
      <tr><td style="padding:8px 0; color:#8C8378;">Amount</td><td style="padding:8px 0; text-align:right;"><strong>$${Number(amount).toFixed(2)}</strong></td></tr>
    </table>
    <p>You can read this issue anytime from your <em>My Purchases</em> page.</p>
    <p style="margin-top:24px; color:#8C8378;">— The Magzineer Editorial Team</p>
  `;
  await sendEmail(
    to,
    `Receipt for ${issueTitle}`,
    wrapTemplate("Purchase receipt", body),
  );
};

// 5. Contact-form acknowledgement reply to the user
export const sendContactReply = async (to, name) => {
  const body = `
    <p>Hello ${name},</p>
    <p>Thank you for reaching out to Magzineer. We've received your message and a member of our team will get back to you within 1–2 business days.</p>
    <p style="margin-top:24px; color:#8C8378;">— The Magzineer Editorial Team</p>
  `;
  await sendEmail(
    to,
    "We've received your message",
    wrapTemplate("Thanks for getting in touch", body),
  );
};

// 6. Forward the actual contact-form message to the admin inbox
export const sendContactToAdmin = async ({ name, email, subject, message }) => {
  const body = `
    <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr style="border:none; border-top:1px solid #EFE7DA; margin:16px 0;"/>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  await sendEmail(
    adminEmail,
    `[Contact] ${subject}`,
    wrapTemplate("New contact-form message", body),
  );
};
