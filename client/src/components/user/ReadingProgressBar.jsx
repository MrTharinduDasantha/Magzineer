// Slim fixed bar at the top of the viewport that fills as the user scrolls the article
import { motion } from "framer-motion";
import useReadingProgress from "../../hooks/useReadingProgress.js";

const ReadingProgressBar = () => {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.75 bg-transparent pointer-events-none">
      <motion.div
        className="h-full bg-crimson origin-left"
        style={{ scaleX: progress / 100 }}
        transition={{ ease: "easeOut", duration: 0.15 }}
      />
    </div>
  );
};

export default ReadingProgressBar;
