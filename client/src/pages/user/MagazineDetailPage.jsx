// Magazine detail — hero with description, latest issue highlight, all issues grid
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";
import { getMagazineByIdApi } from "../../api/magazine.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import IssueCard from "../../components/user/IssueCard.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const MagazineDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMagazineByIdApi(id);
        setData(data.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!data?.magazine) {
    return (
      <div className="container-mz py-20 text-center">
        <p className="font-display text-2xl text-charcoal">
          Magazine not found.
        </p>
      </div>
    );
  }

  const { magazine, latestIssue, issues } = data;

  return (
    <div className="pb-16">
      {/* ─── Hero ─── */}
      <section className="bg-cream/40 py-12 lg:py-16">
        <div className="container-mz">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Magazines", to: "/magazines" },
              { label: magazine.title },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <p className="eyebrow mb-4">Magazine</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal mb-5 leading-tight">
                {magazine.title}
              </h1>
              <p className="text-charcoal-soft leading-relaxed mb-8">
                {magazine.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/plans" className="btn-accent">
                  Subscribe for Full Access
                </Link>
                {latestIssue && (
                  <Link
                    to={`/issues/${latestIssue._id}`}
                    className="btn-outline group"
                  >
                    Latest Issue
                    <IoArrowForwardOutline
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <img
                src={magazine.cover?.url}
                alt={magazine.title}
                className="w-72 sm:w-80 lg:w-96 aspect-3/4 object-cover shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Latest issue highlight ─── */}
      {latestIssue && (
        <section className="py-14 lg:py-20">
          <div className="container-mz">
            <p className="eyebrow mb-3 text-center">Current Issue</p>
            <h2 className="heading-rule center font-display text-3xl lg:text-4xl text-charcoal text-center mx-auto mb-10">
              On Newsstands Now
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto card-mz overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Link
                  to={`/issues/${latestIssue._id}`}
                  className="block aspect-3/4 md:aspect-auto overflow-hidden bg-cream"
                >
                  <img
                    src={latestIssue.cover?.url}
                    alt={latestIssue.issueNumber}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <div className="p-7 lg:p-10 flex flex-col justify-center">
                  <p className="text-sm text-muted uppercase tracking-widest mb-2">
                    {latestIssue.issueNumber}
                  </p>
                  <h3 className="font-display text-2xl lg:text-3xl text-charcoal mb-3">
                    {latestIssue.title || "The Current Issue"}
                  </h3>
                  <p className="text-sm text-muted mb-6">
                    Published {formatDate(latestIssue.publicationDate)}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/issues/${latestIssue._id}`}
                      className="btn-primary"
                    >
                      {latestIssue.price > 0
                        ? `Buy · ${formatCurrency(latestIssue.price)}`
                        : "Read Now"}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── All issues ─── */}
      <section className="py-14 lg:py-20 bg-cream/40">
        <div className="container-mz">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">The Archive</p>
            <h2 className="heading-rule center font-display text-3xl lg:text-4xl text-charcoal mx-auto">
              All Issues
            </h2>
          </div>

          {issues?.length === 0 ? (
            <p className="text-center text-muted py-12">
              No issues published yet.
            </p>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {issues.map((issue) => (
                <motion.div key={issue._id} variants={fadeUp}>
                  <IssueCard issue={issue} showMagazine={false} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MagazineDetailPage;
