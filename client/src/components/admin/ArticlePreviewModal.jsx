// Preview modal — shows what an article will look like to readers before publish
import Modal from "../common/Modal.jsx";
import RichTextRenderer from "../common/RichTextRenderer.jsx";
import { formatReadingTime } from "../../utils/formatReadingTime.js";

const ArticlePreviewModal = ({ isOpen, onClose, article, previewImage }) => {
  if (!article) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Article Preview" size="lg">
      <article className="max-w-2xl mx-auto">
        {/* Featured image preview */}
        {previewImage && (
          <div className="aspect-video overflow-hidden mb-6 bg-cream">
            <img
              src={previewImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="font-display text-3xl lg:text-4xl text-charcoal mb-3 leading-tight">
          {article.title || "Untitled"}
        </h1>

        <p className="font-display italic text-lg text-charcoal-soft mb-5">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted pb-5 mb-7 border-b border-line">
          <span className="font-medium text-charcoal">
            By {article.author || "—"}
          </span>
          {article.readingTime && (
            <>
              <span>·</span>
              <span>{formatReadingTime(article.readingTime)}</span>
            </>
          )}
          {article.accessLevel === "premium" && (
            <>
              <span>·</span>
              <span className="text-crimson uppercase tracking-wider">
                Premium
              </span>
            </>
          )}
        </div>

        <RichTextRenderer html={article.content} />
      </article>
    </Modal>
  );
};

export default ArticlePreviewModal;
