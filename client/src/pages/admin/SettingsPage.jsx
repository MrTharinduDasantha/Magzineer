// Site settings page — logo, contact info, social media links
import { motion } from "framer-motion";
import SettingsForm from "../../components/admin/SettingsForm.jsx";

const AdminSettingsPage = () => {
  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow mb-2">Configuration</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          General Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Site-wide info shown in the footer and across the public site.
        </p>
      </motion.header>

      <div className="card-mz p-6 lg:p-8 max-w-3xl">
        <SettingsForm />
      </div>
    </div>
  );
};

export default AdminSettingsPage;
