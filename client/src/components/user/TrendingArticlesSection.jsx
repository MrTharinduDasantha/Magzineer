// Homepage — trending articles by view count
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchTrendingArticles } from "../../app/features/articleSlice.js";
import ArticleCard from "./ArticleCard.jsx";
import Loader from "../common/Loader.jsx";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const TrendingArticlesSection = () => {
  const dispatch = useDispatch();
  const { trending, trendingLoading } = useSelector((s) => s.articles);

  useEffect(() => {
    dispatch(fetchTrendingArticles(6));
  }, [dispatch]);

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="container-mz">
        <div className="text-center mb-12 lg:mb-14">
          <p className="eyebrow mb-3">Most Read</p>
          <h2 className="heading-rule center font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mx-auto">
            Trending This Week
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            The pieces our community of readers is talking about right now.
          </p>
        </div>

        {trendingLoading ? (
          <Loader fullScreen={false} />
        ) : trending.length === 0 ? (
          <p className="text-center text-muted py-12">
            No trending articles yet.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {trending.map((a) => (
              <motion.div key={a._id} variants={fadeUp}>
                <ArticleCard article={a} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TrendingArticlesSection;
