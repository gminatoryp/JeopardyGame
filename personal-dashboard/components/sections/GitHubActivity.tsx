"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, BookOpen, Users, ExternalLink } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GitHubRepo, GitHubStats, LanguageStat } from "@/lib/github";

interface GitHubData {
  stats: GitHubStats | null;
  repos: GitHubRepo[];
  languages: LanguageStat[];
}

const fallbackStats: GitHubStats = {
  followers: 312,
  following: 89,
  publicRepos: 47,
  totalStars: 624,
  name: "Alex Chen",
  bio: "Senior SWE | Distributed Systems | Open Source",
  avatarUrl: "",
  login: "gminatoryp",
};

export function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats ?? fallbackStats;
  const repos = data?.repos ?? [];
  const languages = data?.languages ?? [
    { name: "TypeScript", percentage: 35, color: "#3178C6" },
    { name: "Python", percentage: 25, color: "#3572A5" },
    { name: "Go", percentage: 20, color: "#00ADD8" },
    { name: "Java", percentage: 12, color: "#B07219" },
    { name: "Shell", percentage: 8, color: "#89E051" },
  ];

  const statCards = [
    { label: "Public Repos", value: stats.publicRepos, icon: <BookOpen size={16} /> },
    { label: "Total Stars", value: stats.totalStars, icon: <Star size={16} /> },
    { label: "Followers", value: stats.followers, icon: <Users size={16} /> },
    { label: "Following", value: stats.following, icon: <Users size={16} /> },
  ];

  return (
    <section id="github" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">04. open source</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            GitHub activity
          </h2>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-card-border bg-card rounded-xl p-5 text-center"
            >
              <div className="text-accent flex justify-center mb-2">
                {card.icon}
              </div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? "—" : card.value}
              </div>
              <div className="text-xs text-muted mt-1">{card.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pinned repos */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-mono text-muted mb-4">
              Pinned repositories
            </h3>
            {(loading ? Array(3).fill(null) : repos).map((repo: GitHubRepo | null, i: number) => (
              <motion.div
                key={repo?.name ?? i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border border-card-border bg-card rounded-xl p-4 hover:border-accent/30 transition-colors"
              >
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-navy-700/50 rounded w-1/3" />
                    <div className="h-3 bg-navy-700/50 rounded w-2/3" />
                  </div>
                ) : repo ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm font-mono">
                          {repo.name}
                        </h4>
                        <p className="text-muted text-xs mt-1 leading-relaxed">
                          {repo.description}
                        </p>
                      </div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-accent transition-colors shrink-0"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {repo.primaryLanguage && (
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: repo.primaryLanguage.color,
                            }}
                          />
                          {repo.primaryLanguage.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Star size={12} />
                        {repo.stargazerCount}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <GitFork size={12} />
                        {repo.forkCount}
                      </span>
                    </div>
                  </>
                ) : null}
              </motion.div>
            ))}
            <a
              href={`https://github.com/${stats.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline mt-2"
            >
              View all repos on GitHub
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Language breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-card-border bg-card rounded-xl p-6"
          >
            <h3 className="text-sm font-mono text-muted mb-6">
              Languages
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={languages}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  strokeWidth={0}
                >
                  {languages.map((lang, i) => (
                    <Cell key={i} fill={lang.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, ""]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-xs text-muted">{lang.name}</span>
                  </div>
                  <span className="text-xs text-foreground font-medium">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
