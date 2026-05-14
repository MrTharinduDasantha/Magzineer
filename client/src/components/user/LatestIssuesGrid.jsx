// Homepage — latest issues across all magazines, fetched from /issues/latest
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoArrowForwardOutline } from "react-icons/io5";
import { getLatestIssuesApi } from "../../api/issue.api.js";
import IssueCard from "./IssueCard.jsx";
import Loader from "../common/Loader.jsx";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const LatestIssuesGrid = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getLatestIssuesApi(8);
        setIssues(data.data.issues || []);
      } catch {
        setIssues([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-cream/40">
      <div className="container-mz">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <p className="eyebrow mb-3">Hot Off the Press</p>
            <h2 className="heading-rule font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal">
              Latest Issues
            </h2>
          </div>
          <Link
            to="/magazines"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-charcoal hover:text-crimson transition-colors group"
          >
            Browse All Magazines
            <IoArrowForwardOutline
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {loading ? (
          <Loader fullScreen={false} />
        ) : issues.length === 0 ? (
          <p className="text-center text-muted py-12">No issues yet.</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {issues.map((issue) => (
              <motion.div key={issue._id} variants={fadeUp}>
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestIssuesGrid;
