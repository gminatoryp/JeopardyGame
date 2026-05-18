"use client";

import { motion } from "framer-motion";
import { Zap, Globe, BookOpen } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const values = [
  {
    icon: <Zap size={18} />,
    title: "Shift-left quality",
    desc: "I embed into sprint planning and design reviews to surface testability requirements before a single line of code is written — preventing defects rather than just finding them.",
  },
  {
    icon: <Globe size={18} />,
    title: "Automation as a product",
    desc: "Test suites should be maintained like production code. I build frameworks that are readable, maintainable, and integrated into CI/CD — not brittle scripts that rot.",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Quality is a team sport",
    desc: "The best QA outcome is a culture where developers own quality. I mentor teams, standardize practices, and make the right thing the easy thing.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">01. about</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Who I am
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              I&apos;m a Senior QA Engineer with{" "}
              <span className="text-foreground font-medium">20+ years</span> of
              experience owning quality end-to-end across web, mobile, and
              back-end platforms. I&apos;ve led quality engineering across{" "}
              <span className="text-foreground font-medium">40+ software releases</span>{" "}
              with zero critical production escapes, built automation frameworks
              from the ground up that eliminated{" "}
              <span className="text-foreground font-medium">75% of manual regression effort</span>,
              and standardized QA practices across distributed engineering organizations.
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              My background spans connected-vehicle platforms at Gemmacon,
              enterprise automotive systems at Hyundai Motor America, and global
              consumer security products at NortonLifeLock. I&apos;ve worked across
              the full testing spectrum — from manual exploratory testing of
              distributed microservices to building Python/Playwright automation
              suites integrated into Jenkins and GitHub Actions pipelines.
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              Right now I&apos;m focused on{" "}
              <span className="text-foreground font-medium">
                quality engineering for modern cloud platforms
              </span>{" "}
              — building scalable test infrastructure, integrating quality gates
              into CI/CD pipelines, and helping engineering teams move fast
              without breaking things.
            </motion.p>
          </div>

          <div className="space-y-4">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="text-sm font-mono text-accent mb-6"
            >
              Engineering philosophy
            </motion.p>
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 2}
                variants={fadeUp}
                className="flex gap-4 p-4 rounded-lg border border-card-border bg-card hover:border-accent/30 transition-colors"
              >
                <div className="text-accent mt-0.5 shrink-0">{v.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {v.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              variants={fadeUp}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              {[
                { value: "20+", label: "Years exp." },
                { value: "40+", label: "Releases led" },
                { value: "0", label: "Critical escapes" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 rounded-lg bg-card border border-card-border"
                >
                  <div className="text-2xl font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
