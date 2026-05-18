"use client";

import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: "Expert" | "Proficient" | "Familiar";
  proficiency: number;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillData: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript / JavaScript", level: "Expert", proficiency: 95 },
      { name: "Python", level: "Expert", proficiency: 90 },
      { name: "Go", level: "Expert", proficiency: 88 },
      { name: "Java / Kotlin", level: "Proficient", proficiency: 75 },
      { name: "Rust", level: "Familiar", proficiency: 55 },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Next.js / React", level: "Expert", proficiency: 92 },
      { name: "Node.js / Express", level: "Expert", proficiency: 90 },
      { name: "FastAPI / Django", level: "Proficient", proficiency: 80 },
      { name: "gRPC / Protobuf", level: "Proficient", proficiency: 78 },
      { name: "GraphQL", level: "Proficient", proficiency: 75 },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    skills: [
      { name: "AWS (ECS, RDS, Lambda, S3)", level: "Expert", proficiency: 92 },
      { name: "Kubernetes / Helm", level: "Expert", proficiency: 88 },
      { name: "Terraform / Pulumi", level: "Proficient", proficiency: 82 },
      { name: "Docker / Containerd", level: "Expert", proficiency: 90 },
      { name: "Datadog / Grafana", level: "Proficient", proficiency: 78 },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", level: "Expert", proficiency: 92 },
      { name: "Redis / Valkey", level: "Expert", proficiency: 88 },
      { name: "Elasticsearch", level: "Proficient", proficiency: 78 },
      { name: "MongoDB", level: "Proficient", proficiency: 75 },
      { name: "Apache Kafka", level: "Proficient", proficiency: 80 },
    ],
  },
];

const levelColors: Record<string, string> = {
  Expert: "text-accent bg-accent/10 border-accent/30",
  Proficient: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Familiar: "text-amber-400 bg-amber-400/10 border-amber-400/30",
};

const levelBarColors: Record<string, string> = {
  Expert: "bg-accent",
  Proficient: "bg-emerald-400",
  Familiar: "bg-amber-400",
};

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">02. skills</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Technical toolkit
          </h2>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {(["Expert", "Proficient", "Familiar"] as const).map((level) => (
            <span
              key={level}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${levelColors[level]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${levelBarColors[level]}`} />
              {level}
            </span>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillData.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              className="border border-card-border bg-card rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-5 font-mono text-sm text-accent">
                {cat.category}
              </h3>
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground font-medium">
                        {skill.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[skill.level]}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1.5 bg-navy-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: ci * 0.1 + si * 0.05,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${levelBarColors[skill.level]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
