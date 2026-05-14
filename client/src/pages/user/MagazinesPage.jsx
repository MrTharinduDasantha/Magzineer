// All magazines — grid with optional search input
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { fetchAllMagazines } from "../../app/features/magazineSlice.js";
import MagazineCard from "../../components/user/MagazineCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const MagazinesPage = () => {
  const dispatch = useDispatch();
  const { all, loading } = useSelector((s) => s.magazines);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);

  // Refetch whenever the debounced search term changes
  useEffect(() => {
    dispatch(fetchAllMagazines({ search: debounced }));
  }, [dispatch, debounced]);

  return (
    <div className="container-mz py-10 lg:py-14">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "All Magazines" }]}
      />

      <div className="mt-6 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-3">Explore Our Library</p>
          <h1 className="heading-rule font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal">
            All Magazines
          </h1>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <IoSearchOutline
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search magazines..."
            className="w-full pl-9 pr-4 py-2.5 bg-cream border border-line rounded-full text-sm focus:outline-none focus:border-charcoal focus:bg-paper transition-all"
          />
        </div>
      </div>

      {loading ? (
        <Loader fullScreen={false} />
      ) : all.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-charcoal mb-2">
            No magazines found
          </p>
          <p className="text-muted">Try a different search term.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {all.map((m) => (
            <motion.div key={m._id} variants={fadeUp}>
              <MagazineCard magazine={m} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MagazinesPage;
