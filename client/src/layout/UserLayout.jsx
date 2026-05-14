// User-facing layout — Navbar + page outlet + Footer + BackToTop
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import BackToTop from "../components/common/BackToTop.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <ScrollToTop />
      <Navbar />
      {/* pt-16/20 = navbar height; flex-1 pushes footer down on short pages */}
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default UserLayout;
