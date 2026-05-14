// Full-page article create/edit experience with React Quill
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import { adminGetArticleByIdApi } from "../../api/article.api.js";
import ArticleForm from "../../components/admin/ArticleForm.jsx";
import ArticlePreviewModal from "../../components/admin/ArticlePreviewModal.jsx";
import Loader from "../../components/common/Loader.jsx";

const ArticleEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await adminGetArticleByIdApi(id);
        setArticle(data.data.article);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handlePreview = (formData) => {
    setPreviewData({
      ...formData,
      // Existing image stays unless user uploaded a new one (handled by file input — we just show old)
      previewImage: article?.featuredImage?.url || "",
    });
    setPreviewOpen(true);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/admin/articles")}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-charcoal mb-3 transition-colors"
        >
          <IoArrowBackOutline size={15} /> Back to Articles
        </button>
        <p className="eyebrow mb-2">Editor</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          {isEdit ? "Edit Article" : "New Article"}
        </h1>
      </motion.header>

      <div className="card-mz p-6 lg:p-8">
        <ArticleForm
          article={article}
          onSuccess={() => navigate("/admin/articles")}
          onPreview={handlePreview}
        />
      </div>

      <ArticlePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        article={previewData}
        previewImage={previewData?.previewImage}
      />
    </div>
  );
};

export default ArticleEditorPage;
