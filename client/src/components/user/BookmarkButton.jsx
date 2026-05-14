// Heart-style bookmark toggle — instant optimistic update via the bookmarkSlice
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  toggleBookmark,
  setBookmarkStatus,
} from "../../app/features/bookmarkSlice.js";
import { checkBookmarkApi } from "../../api/bookmark.api.js";

const BookmarkButton = ({ articleId, size = "md", showLabel = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const bookmarked = useSelector((s) => s.bookmarks.statusMap[articleId]);
  const [loading, setLoading] = useState(false);

  // On mount, fetch the bookmark status from the server (if logged in and unknown)
  useEffect(() => {
    if (!isAuthenticated || !articleId || bookmarked !== undefined) return;
    (async () => {
      try {
        const { data } = await checkBookmarkApi(articleId);
        dispatch(
          setBookmarkStatus({ articleId, bookmarked: data.data.bookmarked }),
        );
      } catch {
        /* ignore */
      }
    })();
  }, [articleId, isAuthenticated, bookmarked, dispatch]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to bookmark articles.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      await dispatch(toggleBookmark(articleId)).unwrap();
      toast.success(bookmarked ? "Bookmark removed." : "Article bookmarked.");
    } catch {
      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  const sizeMap = {
    sm: { btn: "w-9 h-9", icon: 16 },
    md: { btn: "w-11 h-11", icon: 19 },
    lg: { btn: "w-12 h-12", icon: 22 },
  };
  const s = sizeMap[size];

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 ${
        showLabel ? "px-4 py-2.5" : s.btn
      } rounded-full border border-line bg-paper hover:bg-cream transition-colors disabled:opacity-50`}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
    >
      <motion.span
        key={bookmarked ? "on" : "off"}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        className={bookmarked ? "text-crimson" : "text-charcoal"}
      >
        {bookmarked ? (
          <IoBookmark size={s.icon} />
        ) : (
          <IoBookmarkOutline size={s.icon} />
        )}
      </motion.span>
      {showLabel && (
        <span className="text-sm font-medium uppercase tracking-wider">
          {bookmarked ? "Saved" : "Save"}
        </span>
      )}
    </motion.button>
  );
};

export default BookmarkButton;
