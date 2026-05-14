// Homepage — composes all the major homepage sections
import HeroSlider from "../../components/user/HeroSlider.jsx";
import FeaturedMagazinesSection from "../../components/user/FeaturedMagazinesSection.jsx";
import LatestIssuesGrid from "../../components/user/LatestIssuesGrid.jsx";
import TrendingArticlesSection from "../../components/user/TrendingArticlesSection.jsx";
import SubscriptionPlansSection from "../../components/user/SubscriptionPlansSection.jsx";
import TestimonialsCarousel from "../../components/user/TestimonialsCarousel.jsx";
import OfferBanner from "../../components/user/OfferBanner.jsx";

const HomePage = () => {
  return (
    <>
      <HeroSlider />
      <FeaturedMagazinesSection />
      <LatestIssuesGrid />
      <TrendingArticlesSection />
      <OfferBanner />
      <SubscriptionPlansSection />
      <TestimonialsCarousel />
    </>
  );
};

export default HomePage;
