// Homepage — featured magazines strip, fetches from the magazine slice
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoArrowForwardOutline } from "react-icons/io5";
import { fetchFeaturedMagazines } from "../../app/features/magazineSlice.js";
import MagazineCard from "./MagazineCard.jsx";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const FeaturedMagazinesSection = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector((s) => s.magazines);

  useEffect(() => {
    dispatch(fetchFeaturedMagazines());
  }, [dispatch]);

  if (!featured?.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="container-mz">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <p className="eyebrow mb-3">Editor's Picks</p>
            <h2 className="heading-rule font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal">
              Featured Magazines
            </h2>
          </div>
          <Link
            to="/magazines"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-charcoal hover:text-crimson transition-colors group"
          >
            View All
            <IoArrowForwardOutline
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {featured.map((mag) => (
            <motion.div key={mag._id} variants={fadeUp}>
              <MagazineCard magazine={mag} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedMagazinesSection;
