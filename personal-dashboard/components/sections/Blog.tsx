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
    title: "Why 75% Automation Isn't the Goal — Coverage Quality Is",
    excerpt:
      "Converting manual tests to automated ones sounds like progress. But if you're automating the wrong tests, you're just creating a maintenance burden. Here's how I think about what to automate first.",
    date: "Coming soon",
    readTime: "8 min read",
    tags: ["Test Automation", "Strategy"],
    url: "#",
  },
  {
    title: "Shift-Left QA: Getting Invited to the Design Meeting",
    excerpt:
      "The most impactful QA work happens before code is written. How I've embedded into sprint planning and architecture reviews to surface testability issues early — and why it matters more than any test suite.",
    date: "Coming soon",
    readTime: "6 min read",
    tags: ["QA Process", "Agile"],
    url: "#",
  },
  {
    title: "API Testing Beyond Happy Paths: Simulating Real Production Traffic",
    excerpt:
      "Most API test suites validate the obvious cases. The bugs that make it to production are hiding in the edge cases. A practical guide to crafting payloads that actually stress your system.",
    date: "Coming soon",
    readTime: "10 min read",
    tags: ["API Testing", "Postman"],
    url: "#",
  },
  {
    title: "Building a QA Culture Without the Authority to Mandate It",
    excerpt:
      "I've never had direct authority over developers — but I've consistently raised the quality bar across teams. Here's the influence playbook: from architecture reviews to pair debugging sessions.",
    date: "Coming soon",
    readTime: "7 min read",
    tags: ["Leadership", "QA Culture"],
    url: "#",
  },
];

const tagColors: Record<string, string> = {
  "Test Automation": "text-accent bg-accent/10 border-accent/30",
  Strategy: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  "QA Process": "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Agile: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  "API Testing": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Postman: "text-orange-500 bg-orange-500/10 border-orange-500/30",
  Leadership: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  "QA Culture": "text-rose-400 bg-rose-400/10 border-rose-400/30",
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
            Lessons from 20+ years in quality engineering — on automation strategy,
            building QA culture, and the testing problems no one talks about.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group block border border-card-border bg-card rounded-xl p-6 border-dashed"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-foreground leading-snug">
                  {article.title}
                </h3>
                <ExternalLink
                  size={14}
                  className="text-muted/30 shrink-0 mt-0.5"
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

              <div className="flex items-center gap-4 text-xs text-muted/50">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {article.readTime}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
