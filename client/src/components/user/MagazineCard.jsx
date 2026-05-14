// Magazine card — cover image, title, short description, hover lift
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MagazineCard = ({ magazine }) => {
  if (!magazine) return null;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Link to={`/magazines/${magazine._id}`} className="block bg-cream p-4">
        {/* Cover */}
        <div className="relative overflow-hidden aspect-3/4">
          <motion.img
            src={magazine.cover?.url}
            alt={magazine.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Soft hover overlay */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500" />

          {magazine.isFeatured && (
            <span className="absolute top-3 left-3 bg-crimson text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Caption */}
        <div className="pt-4">
          <h3 className="font-display text-xl text-charcoal group-hover:text-crimson! transition-colors line-clamp-2">
            {magazine.title}
          </h3>
          <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
            {magazine.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MagazineCard;
