"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  type: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
}

const experience: Role[] = [
  {
    company: "Apex Systems",
    title: "Senior Software Engineer — Platform",
    period: "Jan 2023 – Present",
    location: "San Francisco, CA",
    type: "Full-time",
    current: true,
    bullets: [
      "Architected a real-time event streaming platform processing 800M+ events/day, reducing pipeline latency from 6 hours to under 50ms P99.",
      "Led migration of 40+ microservices to a Kubernetes-native service mesh, reducing inter-service latency by 32% and eliminating 99.7% of cascading failures.",
      "Designed and shipped an internal developer platform (IDP) used by 40+ engineering teams, cutting environment setup time from 3 hours to 15 minutes.",
      "Reduced cloud infrastructure spend by $1.2M annually through right-sizing, spot instance arbitrage, and automated idle resource cleanup.",
    ],
    stack: ["Go", "Kubernetes", "Kafka", "Terraform", "AWS", "Datadog"],
  },
  {
    company: "Meridian Health",
    title: "Software Engineer — Backend",
    period: "Jun 2021 – Dec 2022",
    location: "New York, NY",
    type: "Full-time",
    bullets: [
      "Built a HIPAA-compliant data ingestion pipeline handling 4M+ patient records, with end-to-end encryption, audit logging, and field-level access controls.",
      "Optimized critical PostgreSQL queries serving the patient portal, achieving a 65% reduction in P95 query latency through index tuning and query plan analysis.",
      "Designed an event-driven notification system (Kafka + Go) that replaced polling, reducing server load by 45% and improving notification reliability to 99.97%.",
      "Mentored 3 junior engineers; introduced bi-weekly design review sessions that improved RFC quality and reduced post-deploy incidents by 28%.",
    ],
    stack: ["Python", "PostgreSQL", "FastAPI", "Redis", "Kafka", "Docker"],
  },
  {
    company: "DataFlow Labs",
    title: "Software Engineer — Full Stack",
    period: "Aug 2019 – May 2021",
    location: "Austin, TX",
    type: "Full-time",
    bullets: [
      "Built a real-time analytics dashboard used by 200+ enterprise customers, handling 50K concurrent WebSocket connections with sub-100ms update latency.",
      "Implemented a multi-tenant ML model serving infrastructure, reducing inference latency by 40% through model quantization and batch prediction caching.",
      "Shipped 0→1 product features including alerting engine, custom dashboard builder, and API key management — all within first 6 months.",
    ],
    stack: ["TypeScript", "React", "Node.js", "MongoDB", "Redis", "GCP"],
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-navy-700/60" />

          <div className="space-y-10">
            {experience.map((role, i) => (
              <motion.div
                key={`${role.company}-${i}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-2 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    role.current
                      ? "border-accent bg-accent/20"
                      : "border-navy-600 bg-navy-800"
                  }`}
                >
                  {role.current && (
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="border border-card-border bg-card rounded-xl p-6 hover:border-accent/20 transition-colors">
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
      </div>
    </section>
  );
}
