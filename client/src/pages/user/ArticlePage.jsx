// Article reading page — header, content (with paywall), share, bookmark, related sidebar
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchArticleById,
  clearCurrentArticle,
} from "../../app/features/articleSlice.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import RichTextRenderer from "../../components/common/RichTextRenderer.jsx";
import ArticleHeader from "../../components/user/ArticleHeader.jsx";
import ArticlePaywall from "../../components/user/ArticlePaywall.jsx";
import BookmarkButton from "../../components/user/BookmarkButton.jsx";
import SocialShareButtons from "../../components/user/SocialShareButtons.jsx";
import RelatedArticles from "../../components/user/RelatedArticles.jsx";
import ReadingProgressBar from "../../components/user/ReadingProgressBar.jsx";

const ArticlePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: article, loading } = useSelector((s) => s.articles);

  useEffect(() => {
    dispatch(fetchArticleById(id));
    return () => dispatch(clearCurrentArticle());
  }, [dispatch, id]);

  if (loading || !article) return <Loader />;

  const isLocked = article.isLocked;
  const canRead = !isLocked && article.content;

  return (
    <>
      <ReadingProgressBar />

      <article className="container-mz py-6 lg:py-10">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Magazines", to: "/magazines" },
            {
              label: article.magazine?.title,
              to: `/magazines/${article.magazine?._id}`,
            },
            {
              label:
                article.title.length > 40
                  ? article.title.slice(0, 40) + "…"
                  : article.title,
            },
          ]}
        />

        {/* Header */}
        <ArticleHeader article={article} />

        {/* Action bar — bookmark + share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4 py-5 border-y border-line my-8"
        >
          <BookmarkButton articleId={article._id} showLabel />
          <SocialShareButtons
            url={window.location.href}
            title={article.title}
          />
        </motion.div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 max-w-6xl mx-auto">
          {/* Content column */}
          <div className="min-w-0">
            {canRead ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <RichTextRenderer html={article.content} />
              </motion.div>
            ) : (
              <>
                {/* Show the excerpt with a fade-out gradient, then paywall */}
                <div className="relative max-h-100 overflow-hidden">
                  <p className="prose-mz first-letter:text-6xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-charcoal">
                    {article.excerpt}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-ivory pointer-events-none" />
                </div>
                <ArticlePaywall article={article} />
              </>
            )}

            {/* Bottom share */}
            <div className="mt-12 pt-8 border-t border-line">
              <SocialShareButtons
                url={window.location.href}
                title={article.title}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <RelatedArticles articleId={article._id} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
