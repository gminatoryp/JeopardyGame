"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock, Calendar } from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;
}

const articles: Article[] = [
  {
    title: "Semantic Caching for LLMs: A Production Retrospective",
    excerpt:
      "How we achieved 67% cache hit rates on LLM API calls using pgvector embeddings and adaptive TTL — and the failure modes we didn't expect.",
    date: "Mar 12, 2025",
    readTime: "9 min read",
    tags: ["LLM", "Caching", "PostgreSQL"],
    url: "#",
  },
  {
    title: "Building an Event Streaming Platform from Scratch",
    excerpt:
      "A systems-design deep dive into how we processed 800M+ daily events with sub-50ms P99 latency. From dual-write migration to backpressure signaling.",
    date: "Jan 28, 2025",
    readTime: "14 min read",
    tags: ["Kafka", "Distributed Systems", "Go"],
    url: "#",
  },
  {
    title: "The Hidden Cost of Naive Kubernetes Autoscaling",
    excerpt:
      "HPA and VPA are not magic. Here's what we learned spending 3 months profiling our cluster — and the custom controller we built to fix it.",
    date: "Nov 15, 2024",
    readTime: "11 min read",
    tags: ["Kubernetes", "Infrastructure", "Observability"],
    url: "#",
  },
  {
    title: "PostgreSQL Query Plans: What EXPLAIN ANALYZE is Really Telling You",
    excerpt:
      "Most engineers look at query plans without really understanding them. A practical guide to reading seq scans, index selection, and join strategies.",
    date: "Sep 5, 2024",
    readTime: "8 min read",
    tags: ["PostgreSQL", "Performance", "Backend"],
    url: "#",
  },
];

const tagColors: Record<string, string> = {
  LLM: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Caching: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  PostgreSQL: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Kafka: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "Distributed Systems": "text-accent bg-accent/10 border-accent/30",
  Go: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  Kubernetes: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  Infrastructure: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Observability: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Performance: "text-red-400 bg-red-400/10 border-red-400/30",
  Backend: "text-slate-400 bg-slate-400/10 border-slate-400/30",
};

export function Blog() {
  return (
    <section id="blog" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">06. writing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Technical writing
          </h2>
          <p className="text-muted mt-3 max-w-xl">
            I write about distributed systems, infrastructure, and hard-won
            lessons from production. No tutorial rehashes — only things I&apos;ve
            actually built.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {articles.map((article, i) => (
            <motion.a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group block border border-card-border bg-card rounded-xl p-6 hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-foreground leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <ExternalLink
                  size={14}
                  className="text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5"
                />
              </div>

              <p className="text-sm text-muted leading-relaxed mb-4">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      tagColors[tag] ?? "text-muted bg-navy-700/40 border-navy-700/60"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {article.readTime}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
