// About us — editorial story page with office + team imagery
import { motion } from "framer-motion";
import {
  IoCompassOutline,
  IoLayersOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import office from "../../assets/about/office.jpg";
import team from "../../assets/about/team.jpg";
import { fadeUp, staggerContainer } from "../../utils/motionVariants.js";

const values = [
  {
    icon: <IoCompassOutline />,
    title: "Editorial Integrity",
    text: "Every story is independently reported, rigorously fact-checked, and edited with care.",
  },
  {
    icon: <IoLayersOutline />,
    title: "Design Matters",
    text: "We believe great writing deserves great design — beauty is part of the story.",
  },
  {
    icon: <IoSparklesOutline />,
    title: "Worth Your Time",
    text: "We publish less, but mean more. No clickbait, no filler — only what's worth lingering over.",
  },
];

const AboutPage = () => {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-cream/40 py-14 lg:py-20">
        <div className="container-mz">
          <Breadcrumb
            items={[{ label: "Home", to: "/" }, { label: "About" }]}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mt-8"
          >
            <p className="eyebrow mb-3">Our Story</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight mb-6">
              A publishing house built for the modern reader.
            </h1>
            <p className="text-lg text-charcoal-soft leading-relaxed">
              Magzineer is an editorial network of premium magazines on art,
              design, culture, and ideas. Our mission is simple: produce the
              kind of writing that makes you want to slow down and pay
              attention.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Office image */}
      <section className="container-mz py-14 lg:py-20">
        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="aspect-video overflow-hidden mb-12 lg:mb-16"
        >
          <img
            src={office}
            alt="Magzineer office"
            className="w-full h-full object-cover"
          />
        </motion.figure>

        {/* Values */}
        <div className="mb-16 lg:mb-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">What We Believe</p>
            <h2 className="heading-rule center font-display text-3xl sm:text-4xl text-charcoal mx-auto">
              Our Editorial Principles
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-10"
          >
            {values.map((v, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="card-mz p-7 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-crimson/10 text-crimson flex items-center justify-center text-2xl">
                  {v.icon}
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-charcoal-soft leading-relaxed">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.figure
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="aspect-4/3 overflow-hidden"
          >
            <img
              src={team}
              alt="Magzineer team"
              className="w-full h-full object-cover"
            />
          </motion.figure>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow mb-3">The Team</p>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-6 leading-tight">
              A small, dedicated staff with a long memory.
            </h2>
            <p className="text-charcoal-soft leading-relaxed mb-4">
              Writers, editors, designers, and art directors — working in close
              collaboration on every issue. Together, we publish a tightly
              curated network of magazines you can actually read cover to cover.
            </p>
            <p className="text-charcoal-soft leading-relaxed">
              We believe in long deadlines, thoughtful editing, and the quiet
              satisfaction of getting things right.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
