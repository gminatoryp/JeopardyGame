#!/usr/bin/env bash
set -e

mkdir -p personal-dashboard/src/data personal-dashboard/src/components

cat > personal-dashboard/package.json << 'HEREDOC'
{
  "name": "personal-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.4"
  }
}
HEREDOC

cat > personal-dashboard/vite.config.js << 'HEREDOC'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
HEREDOC

cat > personal-dashboard/index.html << 'HEREDOC'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>George Park — Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HEREDOC

cat > personal-dashboard/.gitignore << 'HEREDOC'
node_modules/
dist/
.DS_Store
HEREDOC

cat > personal-dashboard/src/main.jsx << 'HEREDOC'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
HEREDOC

cat > personal-dashboard/src/index.css << 'HEREDOC'
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-base:       #0d0d12;
  --bg-surface:    #13131c;
  --bg-elevated:   #1a1a27;
  --bg-hover:      #1f1f30;

  --accent-1:      #7c6fef;
  --accent-2:      #56cfb2;
  --accent-grad:   linear-gradient(135deg, #7c6fef 0%, #56cfb2 100%);

  --border-faint:  rgba(255,255,255,0.055);
  --border-subtle: rgba(255,255,255,0.09);
  --border-accent: rgba(124,111,239,0.35);

  --text-primary:  #e8e8f0;
  --text-secondary:#7878a0;
  --text-muted:    rgba(255,255,255,0.25);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --shadow-sm:  0 2px 8px rgba(0,0,0,0.35);
  --shadow-md:  0 4px 20px rgba(0,0,0,0.45);
  --shadow-lg:  0 8px 40px rgba(0,0,0,0.55);
}

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

#root {
  min-height: 100vh;
}
HEREDOC

cat > personal-dashboard/src/App.jsx << 'HEREDOC'
import { useState } from 'react'
import Header from './components/Header'
import TabNav from './components/TabNav'
import HobbiesTab from './components/HobbiesTab'
import ProjectsTab from './components/ProjectsTab'
import LinksTab from './components/LinksTab'
import data from './data/dashboardData.json'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('hobbies')

  return (
    <div className="app">
      <Header profile={data.profile} />
      <TabNav active={activeTab} onChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'hobbies'  && <HobbiesTab  hobbies={data.hobbies} />}
        {activeTab === 'projects' && <ProjectsTab projects={data.projects} />}
        {activeTab === 'links'    && <LinksTab    links={data.links} />}
      </main>
    </div>
  )
}
HEREDOC

cat > personal-dashboard/src/App.css << 'HEREDOC'
.app {
  min-height: 100vh;
  background: var(--bg-base);
  background-image:
    radial-gradient(ellipse 60% 30% at 50% 0%, rgba(124,111,239,0.08) 0%, transparent 70%);
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 40px 60px;
}

@media (max-width: 600px) {
  .main-content {
    padding: 24px 20px 48px;
  }
}
HEREDOC

cat > personal-dashboard/src/data/dashboardData.json << 'HEREDOC'
{
  "profile": {
    "name": "George Park",
    "title": "Developer & Creator",
    "bio": "Welcome to my personal dashboard. Here you'll find my hobbies, projects, and ways to connect."
  },
  "hobbies": [
    {
      "id": 1,
      "emoji": "📚",
      "name": "Reading",
      "description": "Always diving into a new book — fiction, non-fiction, and everything in between."
    },
    {
      "id": 2,
      "emoji": "🏃",
      "name": "Sports",
      "description": "Staying active and competitive. Sports keep me energized and focused."
    },
    {
      "id": 3,
      "emoji": "🌱",
      "name": "Gardening",
      "description": "Growing things from scratch. There's something satisfying about nurturing a garden."
    },
    {
      "id": 4,
      "emoji": "🧱",
      "name": "Star Wars Legos",
      "description": "Building iconic ships and scenes from a galaxy far, far away — one brick at a time."
    }
  ],
  "projects": [
    {
      "id": 1,
      "name": "Project Name",
      "description": "Add a short description of what this project does and why you built it.",
      "tags": ["React", "JavaScript"],
      "url": "",
      "repoUrl": ""
    },
    {
      "id": 2,
      "name": "Project Name",
      "description": "Add a short description of what this project does and why you built it.",
      "tags": ["Node.js", "API"],
      "url": "",
      "repoUrl": ""
    },
    {
      "id": 3,
      "name": "Jeopardy Game",
      "description": "A fully featured Jeopardy game built in React with team scoring, Daily Double, video support, and a custom JSON data file for easy content updates.",
      "tags": ["React", "Vite", "JavaScript"],
      "url": "",
      "repoUrl": "https://github.com/gminatoryp/JeopardyGame"
    }
  ],
  "links": [
    {
      "id": 1,
      "platform": "GitHub",
      "handle": "@gminatoryp",
      "url": "https://github.com/gminatoryp",
      "icon": "github",
      "color": "#e6edf3",
      "bg": "#161b22"
    },
    {
      "id": 2,
      "platform": "LinkedIn",
      "handle": "George Park",
      "url": "https://www.linkedin.com/in/gminatoryp",
      "icon": "linkedin",
      "color": "#ffffff",
      "bg": "#0a66c2"
    },
    {
      "id": 3,
      "platform": "Instagram",
      "handle": "@yourhandle",
      "url": "",
      "icon": "instagram",
      "color": "#ffffff",
      "bg": "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)"
    }
  ]
}
HEREDOC

cat > personal-dashboard/src/components/Header.jsx << 'HEREDOC'
import './Header.css'

export default function Header({ profile }) {
  const initials = profile.name.split(' ').map(n => n[0]).join('')

  return (
    <header className="header">
      <div className="header-inner">
        <div className="avatar">{initials}</div>
        <div className="header-text">
          <h1 className="header-name">{profile.name}</h1>
          <p className="header-title">{profile.title}</p>
        </div>
      </div>
      <p className="header-bio">{profile.bio}</p>
    </header>
  )
}
HEREDOC

cat > personal-dashboard/src/components/Header.css << 'HEREDOC'
.header {
  padding: 48px 40px 36px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-grad);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px var(--bg-surface), 0 0 0 5px rgba(124,111,239,0.3);
  letter-spacing: 1px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-name {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1;
  background: var(--accent-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.header-bio {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 560px;
  border-left: 2px solid var(--border-accent);
  padding-left: 16px;
}
HEREDOC

cat > personal-dashboard/src/components/TabNav.jsx << 'HEREDOC'
import './TabNav.css'

const TABS = [
  { id: 'hobbies',  label: 'Hobbies' },
  { id: 'projects', label: 'Projects' },
  { id: 'links',    label: 'Links' },
]

export default function TabNav({ active, onChange }) {
  return (
    <div className="tabnav-wrap">
      <nav className="tabnav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${active === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {active === tab.id && <span className="tab-indicator" />}
          </button>
        ))}
      </nav>
    </div>
  )
}
HEREDOC

cat > personal-dashboard/src/components/TabNav.css << 'HEREDOC'
.tabnav-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;
  border-bottom: 1px solid var(--border-faint);
}

.tabnav {
  display: flex;
  gap: 4px;
}

.tab-btn {
  position: relative;
  padding: 12px 20px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s;
  font-family: inherit;
  letter-spacing: 0.2px;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--text-primary);
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-grad);
  border-radius: 2px 2px 0 0;
}
HEREDOC

cat > personal-dashboard/src/components/HobbiesTab.jsx << 'HEREDOC'
import './HobbiesTab.css'

export default function HobbiesTab({ hobbies }) {
  return (
    <div className="hobbies-grid">
      {hobbies.map((hobby) => (
        <div key={hobby.id} className="hobby-card">
          <div className="hobby-emoji">{hobby.emoji}</div>
          <div className="hobby-content">
            <h3 className="hobby-name">{hobby.name}</h3>
            <p className="hobby-desc">{hobby.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
HEREDOC

cat > personal-dashboard/src/components/HobbiesTab.css << 'HEREDOC'
.hobbies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.hobby-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-faint);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  gap: 18px;
  align-items: flex-start;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: var(--shadow-sm);
}

.hobby-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--border-accent);
}

.hobby-emoji {
  font-size: 2rem;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-faint);
}

.hobby-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hobby-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.hobby-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.55;
}
HEREDOC

cat > personal-dashboard/src/components/ProjectsTab.jsx << 'HEREDOC'
import './ProjectsTab.css'

export default function ProjectsTab({ projects }) {
  return (
    <div className="projects-list">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <div className="project-main">
            <h3 className="project-name">{project.name}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="project-links">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link-btn primary">
                View Project
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn secondary">
                GitHub
              </a>
            )}
          </div>
        </div>
      ))}

      <div className="projects-hint">
        <p>Edit <code>src/data/dashboardData.json</code> to add your own projects.</p>
      </div>
    </div>
  )
}
HEREDOC

cat > personal-dashboard/src/components/ProjectsTab.css << 'HEREDOC'
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-faint);
  border-radius: var(--radius-md);
  padding: 24px 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: var(--shadow-sm);
}

.project-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--border-accent);
}

.project-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.project-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.project-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 520px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.project-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.project-link-btn {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
  text-align: center;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.project-link-btn.primary {
  background: var(--accent-grad);
  color: white;
  border: none;
}

.project-link-btn.primary:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.project-link-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.project-link-btn.secondary:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.projects-hint {
  padding: 16px 20px;
  background: var(--bg-elevated);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
  text-align: center;
}

.projects-hint p {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.projects-hint code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--accent-2);
  font-size: 0.78rem;
}
HEREDOC

cat > personal-dashboard/src/components/LinksTab.jsx << 'HEREDOC'
import './LinksTab.css'

const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
}

export default function LinksTab({ links }) {
  return (
    <div className="links-grid">
      {links.map((link) => {
        const isGradient = link.bg.startsWith('linear-gradient')
        const cardStyle = isGradient
          ? { background: link.bg }
          : { background: link.bg }

        const content = (
          <div className="link-card-inner">
            <div className="link-icon" style={{ color: link.color }}>
              {ICONS[link.icon]}
            </div>
            <div className="link-info">
              <span className="link-platform" style={{ color: link.color }}>{link.platform}</span>
              <span className="link-handle" style={{ color: `${link.color}99` }}>{link.handle}</span>
            </div>
            <div className="link-arrow" style={{ color: `${link.color}66` }}>→</div>
          </div>
        )

        if (!link.url) {
          return (
            <div key={link.id} className="link-card disabled" style={cardStyle}>
              {content}
              <span className="link-placeholder-badge">Add URL in dashboardData.json</span>
            </div>
          )
        }

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card"
            style={cardStyle}
          >
            {content}
          </a>
        )
      })}
    </div>
  )
}
HEREDOC

cat > personal-dashboard/src/components/LinksTab.css << 'HEREDOC'
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.link-card {
  display: block;
  border-radius: var(--radius-md);
  padding: 28px 24px;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.link-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.15s;
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.link-card:hover::before {
  background: rgba(255,255,255,0.06);
}

.link-card.disabled {
  opacity: 0.55;
  cursor: default;
}

.link-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.link-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.link-platform {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.link-handle {
  font-size: 0.8rem;
  font-weight: 500;
}

.link-arrow {
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: transform 0.15s;
}

.link-card:hover .link-arrow {
  transform: translateX(4px);
}

.link-placeholder-badge {
  display: block;
  margin-top: 12px;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.5);
  font-family: 'SF Mono', 'Fira Code', monospace;
  position: relative;
  z-index: 1;
}
HEREDOC

cd personal-dashboard
git init
git add .
git commit -m "Initial commit: personal dashboard"
git remote add origin https://github.com/gminatoryp/personal-dashboard.git
git push -u origin main
