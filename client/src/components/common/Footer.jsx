// Editorial footer — newsletter, links, social, copyright
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

const Footer = () => {
  // Settings (logo + contact info + social links) come from the settings slice or fetch — for foundation, use static fallbacks
  // In real usage you'd hydrate this from `state.settings`. We pull from auth slice for simplicity here.
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper border-t border-line mt-20">
      <div className="container-mz py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <img src={logo} alt="Magzineer" className="h-9 w-auto" />
            </Link>
            <p className="text-sm text-muted leading-relaxed mt-4">
              Premium editorial journalism, beautifully designed and
              thoughtfully curated for the modern reader.
            </p>
          </motion.div>

          {/* Explore */}
          <FooterColumn title="Explore" delay={0.1}>
            <FooterLink to="/magazines">All Magazines</FooterLink>
            <FooterLink to="/plans">Subscribe</FooterLink>
            <FooterLink to="/search">Search</FooterLink>
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company" delay={0.2}>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          </FooterColumn>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="eyebrow mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <SocialIcon href="#" icon={<FaFacebookF />} />
              <SocialIcon href="#" icon={<FaTwitter />} />
              <SocialIcon href="#" icon={<FaInstagram />} />
              <SocialIcon href="#" icon={<FaLinkedinIn />} />
              <SocialIcon href="#" icon={<FaYoutube />} />
            </div>
            <p className="text-xs text-muted mt-6 leading-relaxed">
              Sign up for the Magzineer weekly digest — handpicked stories every
              Friday.
            </p>
          </motion.div>
        </div>

        {/* Bottom rule + copyright */}
        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted">
            © {year} Magzineer. All rights reserved.
          </p>
          <p className="text-xs text-muted font-display italic">
            Editorial Excellence, Delivered.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <h4 className="eyebrow mb-4">{title}</h4>
    <ul className="flex flex-col gap-2.5">{children}</ul>
  </motion.div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-charcoal-soft hover:text-crimson transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-ivory! transition-colors"
  >
    {icon}
  </a>
);

export default Footer;
