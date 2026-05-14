// Sidebar — related articles from the same magazine
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRelatedArticlesApi } from "../../api/article.api.js";
import ArticleCard from "./ArticleCard.jsx";

const RelatedArticles = ({ articleId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;
    (async () => {
      try {
        const { data } = await getRelatedArticlesApi(articleId, 4);
        setRelated(data.data.articles || []);
      } catch {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  if (loading) return null;
  if (!related.length) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-paper border border-line p-6 lg:p-7"
    >
      <p className="eyebrow mb-2">You may also enjoy</p>
      <h3 className="font-display text-xl lg:text-2xl text-charcoal heading-rule mb-7">
        Related Reading
      </h3>

      <div className="flex flex-col gap-5">
        {related.map((a) => (
          <ArticleCard key={a._id} article={a} variant="compact" />
        ))}
      </div>
    </motion.aside>
  );
};

export default RelatedArticles;
