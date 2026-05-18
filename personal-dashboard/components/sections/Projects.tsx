"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Users, Zap, TrendingUp, ChevronDown } from "lucide-react";
import { GitHubIcon } from "@/components/shared/SocialIcons";

interface Project {
  name: string;
  tagline: string;
  problem: string;
  metrics: { icon: React.ReactNode; label: string; value: string }[];
  challenge: string;
  solution: string;
  stack: { name: string; color: string }[];
  demo?: string;
  repo?: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    name: "StreamScale",
    tagline: "Real-time event processing platform",
    problem:
      "Legacy batch pipeline caused 6-hour data delays, blocking product decisions.",
    metrics: [
      { icon: <Zap size={14} />, label: "Latency", value: "< 50ms p99" },
      { icon: <Users size={14} />, label: "Daily events", value: "800M/day" },
      { icon: <TrendingUp size={14} />, label: "Cost reduction", value: "42%" },
    ],
    challenge:
      "Migrating 800M+ daily events from batch to streaming without service disruption, while maintaining exactly-once semantics.",
    solution:
      "Designed a dual-write architecture using Apache Kafka with consumer group partitioning and idempotent producers. Implemented backpressure signaling to prevent consumer lag during traffic spikes.",
    stack: [
      { name: "Go", color: "#00ADD8" },
      { name: "Apache Kafka", color: "#231F20" },
      { name: "Kubernetes", color: "#326CE5" },
      { name: "Terraform", color: "#623CE4" },
      { name: "Datadog", color: "#632CA6" },
    ],
    demo: "#",
    repo: "#",
    featured: true,
  },
  {
    name: "InferenceProxy",
    tagline: "LLM request routing & caching layer",
    problem:
      "Unpredictable LLM API costs and 800ms+ latency were blocking AI feature adoption.",
    metrics: [
      { icon: <Zap size={14} />, label: "P95 latency", value: "180ms" },
      { icon: <Users size={14} />, label: "Cache hit rate", value: "67%" },
      { icon: <TrendingUp size={14} />, label: "Cost savings", value: "$80K/mo" },
    ],
    challenge:
      "Semantic caching of LLM responses is non-trivial — exact-match caching only hit 8% of requests.",
    solution:
      "Built a semantic similarity cache using embedding vectors stored in pgvector. Implemented adaptive TTL based on prompt volatility scores, achieving 67% cache hit rate with <5% semantic drift.",
    stack: [
      { name: "TypeScript", color: "#3178C6" },
      { name: "PostgreSQL", color: "#336791" },
      { name: "Redis", color: "#DC382D" },
      { name: "pgvector", color: "#336791" },
      { name: "AWS Lambda", color: "#FF9900" },
    ],
    demo: "#",
    repo: "#",
    featured: true,
  },
  {
    name: "ObsidianDB",
    tagline: "Distributed time-series database",
    problem:
      "Proprietary TSDB was costing $400K/year and couldn't handle custom retention policies.",
    metrics: [
      { icon: <Zap size={14} />, label: "Write throughput", value: "2M/sec" },
      { icon: <Users size={14} />, label: "Data compressed", value: "8TB → 600GB" },
      { icon: <TrendingUp size={14} />, label: "Annual savings", value: "$380K" },
    ],
    challenge:
      "Achieving PromQL compatibility while supporting custom downsampling strategies across multi-tenant environments.",
    solution:
      "Implemented a columnar storage engine with Gorilla compression achieving 13x compression ratio. Built a query planner that automatically routes to pre-computed rollups for historical queries.",
    stack: [
      { name: "Rust", color: "#DEA584" },
      { name: "RocksDB", color: "#555555" },
      { name: "gRPC", color: "#244C5A" },
      { name: "Prometheus", color: "#E6522C" },
    ],
    repo: "#",
    featured: true,
  },
  {
    name: "Cortex",
    tagline: "Internal developer platform",
    problem: "Developers spent 3+ hours/week on boilerplate infra setup.",
    metrics: [
      { icon: <Zap size={14} />, label: "Onboard time", value: "3h → 15min" },
      { icon: <Users size={14} />, label: "Teams using", value: "40+" },
      { icon: <TrendingUp size={14} />, label: "Deploy freq.", value: "+300%" },
    ],
    challenge:
      "Building a golden path that teams actually adopt without mandating it.",
    solution:
      "Service templates with Backstage, automated PR checks, and one-command Kubernetes namespace provisioning.",
    stack: [
      { name: "TypeScript", color: "#3178C6" },
      { name: "Backstage", color: "#9BF0E1" },
      { name: "Helm", color: "#0F1689" },
      { name: "Argo CD", color: "#EF7B4D" },
    ],
    repo: "#",
    featured: false,
  },
];

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const featured = projects.filter((p) => p.featured);
  const displayed = showAll ? projects : featured;

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">03. projects</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Things I&apos;ve built
          </h2>
          <p className="text-muted mt-3 max-w-xl">
            Each project below includes the problem, scale metrics, and the
            specific technical decisions that made them work.
          </p>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence>
            {displayed.map((project, i) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border border-card-border bg-card rounded-xl p-6 hover:border-accent/30 transition-colors group"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Left: Overview */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-muted text-sm mt-0.5">
                          {project.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.repo && (
                          <a
                            href={project.repo}
                            className="p-2 text-muted hover:text-foreground transition-colors"
                            aria-label="GitHub"
                          >
                            <GitHubIcon size={16} />
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            className="p-2 text-muted hover:text-accent transition-colors"
                            aria-label="Live demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-navy-800/50 border border-navy-700/50">
                      <p className="text-xs font-mono text-accent mb-1">
                        Problem
                      </p>
                      <p className="text-sm text-muted">{project.problem}</p>
                    </div>

                    <div>
                      <p className="text-xs font-mono text-emerald-400 mb-1">
                        How we solved it
                      </p>
                      <p className="text-sm text-muted leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2.5 py-1 text-xs rounded-md font-mono font-medium border"
                          style={{
                            color: tech.color,
                            borderColor: `${tech.color}30`,
                            backgroundColor: `${tech.color}10`,
                          }}
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Metrics */}
                  <div className="space-y-3">
                    <p className="text-xs font-mono text-muted">Impact</p>
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700/50"
                      >
                        <div className="text-accent">{m.icon}</div>
                        <div>
                          <div className="text-lg font-bold text-foreground leading-none">
                            {m.value}
                          </div>
                          <div className="text-xs text-muted mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Show more toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
          >
            {showAll ? "Show less" : `View all ${projects.length} projects`}
            <motion.span animate={{ rotate: showAll ? 180 : 0 }}>
              <ChevronDown size={16} />
            </motion.span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
