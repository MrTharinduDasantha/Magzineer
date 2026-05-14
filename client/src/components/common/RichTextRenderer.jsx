// Renders sanitized article HTML in our editorial prose style
import DOMPurify from "dompurify";

const RichTextRenderer = ({ html, className = "" }) => {
  // Sanitize the HTML to prevent XSS — strip dangerous tags/attributes
  const clean = DOMPurify.sanitize(html || "", {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className={`prose-mz ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichTextRenderer;
