// Social share buttons — uses react-share
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SocialShareButtons = ({ url, title, compact = false }) => {
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const buttonClass =
    "w-10 h-10 flex items-center justify-center rounded-full border border-line bg-paper text-charcoal hover:bg-charcoal hover:text-ivory transition-colors";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "py-4"}`}>
      {!compact && (
        <span className="eyebrow mr-2 hidden sm:inline-block">Share</span>
      )}

      <motion.div whileTap={{ scale: 0.9 }}>
        <FacebookShareButton url={shareUrl} quote={title}>
          <span className={buttonClass}>
            <FaFacebookF size={14} />
          </span>
        </FacebookShareButton>
      </motion.div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <TwitterShareButton url={shareUrl} title={title}>
          <span className={buttonClass}>
            <FaTwitter size={14} />
          </span>
        </TwitterShareButton>
      </motion.div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <LinkedinShareButton url={shareUrl} title={title}>
          <span className={buttonClass}>
            <FaLinkedinIn size={14} />
          </span>
        </LinkedinShareButton>
      </motion.div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <WhatsappShareButton url={shareUrl} title={title}>
          <span className={buttonClass}>
            <FaWhatsapp size={15} />
          </span>
        </WhatsappShareButton>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={copyLink}
        className={buttonClass}
        aria-label="Copy link"
      >
        <FaLink size={13} />
      </motion.button>
    </div>
  );
};

export default SocialShareButtons;
