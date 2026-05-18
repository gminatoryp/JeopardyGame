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
  solution: string;
  stack: { name: string; color: string }[];
  demo?: string;
  repo?: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    name: "Python Automation Framework",
    tagline: "End-to-end test automation for connected-vehicle platform",
    problem:
      "The connected-vehicle platform had zero automation baseline — 100% of regression testing was manual, creating release bottlenecks and missed defects.",
    metrics: [
      { icon: <Zap size={14} />, label: "Manual tests eliminated", value: "75%" },
      { icon: <Users size={14} />, label: "Engineers impacted", value: "15+" },
      { icon: <TrendingUp size={14} />, label: "Release confidence", value: "↑ Significantly" },
    ],
    solution:
      "Built a Python/Pytest + Playwright automation framework from the ground up, taking scenarios from initial manual execution through full CI/CD integration via Jenkins and GitHub Actions. Designed modular test architecture covering functional, regression, integration, and API layers.",
    stack: [
      { name: "Python", color: "#3572A5" },
      { name: "Pytest", color: "#3572A5" },
      { name: "Playwright", color: "#2EAD33" },
      { name: "Jenkins", color: "#D24939" },
      { name: "GitHub Actions", color: "#2088FF" },
      { name: "Postman", color: "#FF6C37" },
    ],
    featured: true,
  },
  {
    name: "Defect Tracking System Modernization",
    tagline: "Replaced legacy defect tracking with a streamlined modern system",
    problem:
      "Legacy defect tracking had critical gaps — no notifications, no visibility into contributor history, and a field architecture that created friction across the entire QA team.",
    metrics: [
      { icon: <Zap size={14} />, label: "Notification latency", value: "Real-time" },
      { icon: <Users size={14} />, label: "QA team friction", value: "Eliminated" },
      { icon: <TrendingUp size={14} />, label: "Defect visibility", value: "↑ Full history" },
    ],
    solution:
      "Identified the gaps, built the business case, and led design and delivery of a modernized replacement. Introduced defect subscriptions, automated email notifications, contributor history views, and a streamlined field architecture — shipped with no prior tooling in place.",
    stack: [
      { name: "JIRA", color: "#0052CC" },
      { name: "Confluence", color: "#0052CC" },
      { name: "GitHub", color: "#181717" },
      { name: "Python", color: "#3572A5" },
    ],
    featured: true,
  },
  {
    name: "Connected-Vehicle Fleet Reservation Tool",
    tagline: "Internal tool eliminating test vehicle scheduling conflicts",
    problem:
      "Test engineers had no visibility into vehicle availability, causing scheduling conflicts, duplicated reservations, and wasted testing time across teams.",
    metrics: [
      { icon: <Zap size={14} />, label: "Scheduling conflicts", value: "Eliminated" },
      { icon: <Users size={14} />, label: "Vehicles tracked", value: "Full fleet" },
      { icon: <TrendingUp size={14} />, label: "Prior tooling", value: "None → Full" },
    ],
    solution:
      "Initiated and oversaw development of an internal reservation system providing real-time visibility into vehicle availability, reservation ownership, test duration, and current software versions per vehicle — built from scratch where no prior solution existed.",
    stack: [
      { name: "JavaScript", color: "#F7DF1E" },
      { name: "HTML/CSS", color: "#E34C26" },
      { name: "CANoe", color: "#8B0000" },
      { name: "VMware", color: "#607078" },
    ],
    featured: true,
  },
  {
    name: "API & Backend Validation Suite",
    tagline: "Comprehensive REST/SOAP test suite for enterprise backend services",
    problem:
      "API changes were shipping without structured validation, causing data integrity issues and hard-to-reproduce production bugs.",
    metrics: [
      { icon: <Zap size={14} />, label: "Test coverage", value: "+10%" },
      { icon: <Users size={14} />, label: "Post-release incidents", value: "↓ Reduced" },
      { icon: <TrendingUp size={14} />, label: "API endpoints covered", value: "100%" },
    ],
    solution:
      "Designed REST and SOAP API test suites using Postman and SoapUI, crafting complex request payloads to simulate real-world production traffic. Paired with SQL data validation queries to confirm end-to-end data integrity across integrated backend systems.",
    stack: [
      { name: "Postman", color: "#FF6C37" },
      { name: "SoapUI", color: "#6CB33E" },
      { name: "JMeter", color: "#D22128" },
      { name: "SQL", color: "#336791" },
    ],
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
            Each initiative below includes the problem, the impact, and the
            specific engineering decisions that made them work.
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
                        How I solved it
                      </p>
                      <p className="text-sm text-muted leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

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
