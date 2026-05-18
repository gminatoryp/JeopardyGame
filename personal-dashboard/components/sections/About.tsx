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
    title: "Systems thinking",
    desc: "I design for failure modes first. Resilient, observable, and debuggable systems are non-negotiable.",
  },
  {
    icon: <Globe size={18} />,
    title: "Scale-aware engineering",
    desc: "Every design decision is weighed against the cost at 10x and 100x current load — before it becomes a problem.",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Documentation as code",
    desc: "Architecture decisions are documented, diagrams are version-controlled, and runbooks are kept current.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
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
          {/* Bio */}
          <div className="space-y-5">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              I&apos;m a Senior Software Engineer with 5+ years of experience
              building high-throughput distributed systems at scale. I&apos;ve
              architected infrastructure serving over{" "}
              <span className="text-foreground font-medium">
                2M+ daily active users
              </span>
              , optimized database query performance by{" "}
              <span className="text-foreground font-medium">65%</span>, and led
              platform migrations that reduced cloud spend by{" "}
              <span className="text-foreground font-medium">$1.2M annually</span>
              .
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              My background spans backend engineering, cloud infrastructure, and
              machine learning platforms. I&apos;ve worked across the stack —
              from kernel-level performance profiling to building React dashboards
              that process real-time data. I thrive in environments where
              technical rigor and product velocity are both non-negotiable.
            </motion.p>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              variants={fadeUp}
              className="text-muted leading-relaxed"
            >
              Right now I&apos;m particularly excited about{" "}
              <span className="text-foreground font-medium">
                LLM infrastructure
              </span>{" "}
              — specifically building reliable, low-latency inference pipelines
              and evaluation frameworks that make AI products production-ready
              rather than just demo-ready.
            </motion.p>
          </div>

          {/* Values */}
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

            {/* Quick stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              variants={fadeUp}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              {[
                { value: "5+", label: "Years exp." },
                { value: "3", label: "Companies" },
                { value: "12+", label: "Projects shipped" },
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
