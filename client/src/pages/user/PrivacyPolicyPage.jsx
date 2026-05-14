// Privacy Policy — long-form static page
import { motion } from "framer-motion";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "When you create a Magzineer account, we collect your name, email address, profile photo (if provided), and an encrypted password.",
      "When you subscribe or purchase an issue, payment data is processed entirely by Stripe — we never store your card details on our servers.",
      "We collect basic analytics such as which articles you read, what you bookmark, and when you last visited, to improve your experience and recommend relevant stories.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To deliver the service you signed up for — authenticate your account, manage your subscription or purchases, and grant access to premium content.",
      "To send essential transactional emails — welcome messages, payment receipts, subscription confirmations, and cancellation notices.",
      "To improve the platform — understanding which articles resonate helps our editors decide what to publish next.",
    ],
  },
  {
    title: "3. Cookies & Sessions",
    body: [
      "Magzineer uses a single secure HTTP-only cookie to keep you signed in. This cookie cannot be read by third-party scripts.",
      "We do not use third-party advertising cookies or tracking pixels.",
    ],
  },
  {
    title: "4. Sharing Your Data",
    body: [
      "We do not sell or rent your personal data — ever.",
      "We share data only with our infrastructure providers (Stripe for payments, Cloudinary for image hosting, SMTP provider for email) and only to the extent necessary to operate the service.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "You may update or delete your profile at any time from your account page.",
      "You may cancel your subscription at any time — your access continues until the end of your current billing period.",
      "You may request a complete export or deletion of your data by emailing privacy@magzineer.com.",
    ],
  },
  {
    title: "6. Contact",
    body: [
      "For any privacy questions, please reach out to privacy@magzineer.com.",
    ],
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mt-6"
      >
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal leading-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-12">Last updated: January 2026</p>

        <div className="prose-mz">
          <p>
            At Magzineer, your privacy is fundamental to how we build our
            publication. This policy explains what data we collect, how we use
            it, and the choices you have. We've kept it as plain and concise as
            possible.
          </p>

          {sections.map((s, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="mt-10"
            >
              <h2>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
