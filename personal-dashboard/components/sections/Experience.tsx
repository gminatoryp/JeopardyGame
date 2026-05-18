"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
  sabbatical?: boolean;
}

const experience: Role[] = [
  {
    company: "Gemmacon",
    title: "Senior Quality Engineer / Head of QA",
    period: "May 2023 – Mar 2026",
    location: "Long Beach, CA",
    current: true,
    bullets: [
      "Built automated test suites from the ground up using Python/Pytest and Playwright, taking scenarios from initial manual execution through full CI/CD integration — eliminating 75% of manual regression effort.",
      "Acted as de-facto QA lead for 15+ engineers across multiple Agile squads; standardized practices and improved cross-team consistency across the connected-vehicle platform.",
      "Designed system-level validation frameworks covering distributed service interactions, API integrations, and failure-mode analysis; proactively identified critical defects before release.",
      "Led design and delivery of a modernized defect tracking system — introducing subscriptions, automated email notifications, contributor history views, and a streamlined field architecture.",
      "Initiated and oversaw development of an internal vehicle reservation system providing real-time visibility into test fleet availability, eliminating scheduling conflicts where no prior tooling existed.",
    ],
    stack: ["Playwright", "Python/Pytest", "Postman", "JMeter", "Jenkins", "GitHub Actions", "JIRA", "CANoe", "VMware"],
  },
  {
    company: "Hyundai Motor America",
    title: "Senior QA Engineer",
    period: "Mar 2022 – Apr 2023",
    location: "Fountain Valley, CA",
    bullets: [
      "Served as Senior QA Lead for the Hyundai Canada team, owning overall testing execution across all releases; reduced redundant test cases by 15%, improving team efficiency.",
      "Executed comprehensive REST API and backend service validation using Postman and SoapUI, crafting complex payloads to simulate real-world production traffic patterns.",
      "Conducted performance and load testing with JMeter to validate system reliability under production-scale conditions; surfaced bottlenecks that informed infrastructure scaling decisions.",
      "Designed regression and reliability test strategies that increased test coverage by 10% and reduced post-release incidents.",
    ],
    stack: ["Postman", "SoapUI", "JMeter", "SQL", "JIRA", "Confluence"],
  },
  {
    company: "Professional Development Sabbatical",
    title: "Full Stack Certificate — Coding Dojo",
    period: "Mar 2021 – Mar 2022",
    location: "Remote",
    sabbatical: true,
    bullets: [
      "Completed intensive Full Stack Development Certificate at Coding Dojo, building proficiency in modern web development.",
      "Upskilled in Playwright/TypeScript test automation, CI/CD pipeline integration, and full-stack engineering practices.",
    ],
    stack: ["JavaScript", "TypeScript", "Playwright", "HTML/CSS", "Python"],
  },
  {
    company: "NortonLifeLock (formerly Symantec)",
    title: "Principal SQA Analyst",
    period: "Oct 2012 – Mar 2021",
    location: "Culver City, CA",
    bullets: [
      "Led quality validation across 40+ software releases for global consumer security applications with zero critical escapes on monitored releases over nine years.",
      "Improved QA team efficiency by ~30% through targeted process improvements, automation initiatives, and elimination of redundant manual testing activities.",
      "Architected regression testing strategies and release validation plans adopted org-wide, directly reducing time-to-release.",
      "Coordinated Agile QA practices with offshore teams across time zones, improving collaboration velocity and sprint predictability.",
      "Mentored 10 junior QA engineers in test design, debugging, and stakeholder communication — several advanced to senior roles.",
    ],
    stack: ["JIRA", "Confluence", "Selenium", "SQL", "Agile/Scrum"],
  },
  {
    company: "Symantec",
    title: "SQA Lead",
    period: "Sep 2009 – Oct 2012",
    location: "Culver City, CA",
    bullets: [
      "Automated ~45% of legacy manual test cases, dramatically expanding regression coverage and freeing team bandwidth for exploratory testing.",
      "Streamlined QA workflows and reduced redundant testing activities, improving overall team throughput and release cadence by ~20%.",
    ],
    stack: ["JIRA", "Selenium", "SQL", "Perforce"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">05. experience</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Where I&apos;ve worked
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-navy-700/60" />

          <div className="space-y-10">
            {experience.map((role, i) => (
              <motion.div
                key={`${role.company}-${i}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-12"
              >
                <div
                  className={`absolute left-0 top-2 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    role.current
                      ? "border-accent bg-accent/20"
                      : role.sabbatical
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-navy-600 bg-navy-800"
                  }`}
                >
                  {role.current && (
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </div>

                <div
                  className={`border rounded-xl p-6 hover:border-accent/20 transition-colors ${
                    role.sabbatical
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-card-border bg-card"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">
                        {role.company}
                      </h3>
                      <p className="text-accent font-medium text-sm">
                        {role.title}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted shrink-0">
                      <div>{role.period}</div>
                      <div className="flex items-center gap-1 mt-1 sm:justify-end">
                        <MapPin size={12} />
                        {role.location}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-5">
                    {role.bullets.map((bullet, bi) => (
                      <li
                        key={bi}
                        className="flex gap-3 text-sm text-muted leading-relaxed"
                      >
                        <span className="text-accent mt-1.5 shrink-0">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {role.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs rounded-md font-mono text-muted bg-navy-700/40 border border-navy-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border border-card-border bg-card rounded-xl p-6"
        >
          <p className="text-xs font-mono text-accent mb-4">Education</p>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">B.S., Computer Information Systems</p>
                <p className="text-sm text-muted">DeVry University</p>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">Full Stack Development Certificate</p>
                <p className="text-sm text-muted">Coding Dojo</p>
              </div>
              <span className="text-sm text-muted shrink-0">2021</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
