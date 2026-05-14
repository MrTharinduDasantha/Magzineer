// Contact us — form submits to /api/contact and triggers email forwarding
import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { submitContactApi } from "../../api/contact.api.js";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      return toast.error("All fields are required.");
    }
    try {
      setLoading(true);
      await submitContactApi(form);
      toast.success("Thank you! We'll be in touch soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 max-w-2xl"
      >
        <p className="eyebrow mb-3">Get in Touch</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal mb-4 leading-tight">
          We'd love to hear from you.
        </h1>
        <p className="text-charcoal-soft">
          Questions about a subscription, story pitches, partnership ideas, or
          just to say hello — drop us a line.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 mt-12">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Your Name *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-mz"
                required
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-mz"
                required
              />
            </Field>
          </div>

          <Field label="Subject *">
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-mz"
              required
            />
          </Field>

          <Field label="Message *">
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-mz min-h-45 resize-y"
              placeholder="Tell us more..."
              required
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary self-start mt-2 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </motion.form>

        {/* Contact info */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card-mz p-7 lg:p-8 h-fit"
        >
          <h3 className="font-display text-xl text-charcoal mb-6 heading-rule">
            Reach Us
          </h3>

          <ul className="flex flex-col gap-5 text-sm">
            <ContactItem icon={<IoMailOutline />} label="Email">
              hello@magzineer.com
            </ContactItem>
            <ContactItem icon={<IoCallOutline />} label="Phone">
              +1 (555) 123-4567
            </ContactItem>
            <ContactItem icon={<IoLocationOutline />} label="Office">
              42 Editorial Lane
              <br />
              Brooklyn, NY 11201
            </ContactItem>
          </ul>
        </motion.aside>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

const ContactItem = ({ icon, label, children }) => (
  <li className="flex gap-3">
    <span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-charcoal shrink-0">
      {icon}
    </span>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-0.5">
        {label}
      </p>
      <p className="text-charcoal leading-relaxed">{children}</p>
    </div>
  </li>
);

export default ContactPage;
