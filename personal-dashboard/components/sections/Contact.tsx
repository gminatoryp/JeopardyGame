"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterXIcon } from "@/components/shared/SocialIcons";

type FormState = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate submission — wire up to Resend or EmailJS in production
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-accent font-mono text-sm mb-2">07. contact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Get in touch
          </h2>
          <p className="text-muted mt-3 max-w-xl">
            I&apos;m selectively open to new opportunities and interesting
            engineering challenges. No recruiters please — direct outreach only.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Status */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Open to opportunities
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Actively considering senior/staff IC and tech lead roles
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Mail size={16} className="text-accent shrink-0" />
                <a
                  href="mailto:george@example.com"
                  className="hover:text-accent transition-colors"
                >
                  george@example.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={16} className="text-accent shrink-0" />
                San Francisco, CA (PST) — open to remote
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-mono text-muted mb-4">Find me on</p>
              <div className="flex gap-4">
                {[
                  {
                    icon: <GitHubIcon size={20} />,
                    href: "https://github.com/gminatoryp",
                    label: "GitHub",
                  },
                  {
                    icon: <LinkedInIcon size={20} />,
                    href: "https://linkedin.com/in/georgepark",
                    label: "LinkedIn",
                  },
                  {
                    icon: <TwitterXIcon size={20} />,
                    href: "https://twitter.com/georgepark_dev",
                    label: "Twitter/X",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-3 rounded-lg border border-card-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* What I'm looking for */}
            <div className="border border-card-border bg-card rounded-xl p-5">
              <p className="text-sm font-mono text-accent mb-3">
                What I&apos;m looking for
              </p>
              <ul className="space-y-2">
                {[
                  "Senior / Staff IC or Tech Lead roles",
                  "High-impact distributed systems problems",
                  "Strong eng culture (small teams, big scope)",
                  "Remote or SF Bay Area",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <span className="text-accent">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 h-64 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
                <CheckCircle size={40} className="text-emerald-400" />
                <div className="text-center">
                  <p className="font-semibold text-foreground">Message sent!</p>
                  <p className="text-sm text-muted mt-1">
                    I&apos;ll get back to you within 48 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-sm text-accent hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-lg border border-card-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-card-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell me about the role or project..."
                    className="w-full px-4 py-3 rounded-lg border border-card-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/60 transition-colors text-sm resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try email instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/90 disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
