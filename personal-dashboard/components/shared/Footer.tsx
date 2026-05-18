import { Code2 } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterXIcon } from "@/components/shared/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-navy-700/50 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-accent font-mono font-bold">
          <Code2 size={18} />
          <span>George Park</span>
        </div>
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} George Park. Built with Next.js & Tailwind CSS.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/gminatoryp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon size={18} />
          </a>
          <a
            href="https://linkedin.com/in/georgepark"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={18} />
          </a>
          <a
            href="https://twitter.com/georgepark_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="Twitter/X"
          >
            <TwitterXIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
