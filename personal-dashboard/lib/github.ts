export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
  updatedAt: string;
}

export interface GitHubStats {
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  name: string;
  bio: string | null;
  avatarUrl: string;
  login: string;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "gminatoryp";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function buildHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  };
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: buildHeaders(),
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=stars`,
        {
          headers: buildHeaders(),
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!userRes.ok) return null;
    const user = await userRes.json();

    let totalStars = 0;
    if (reposRes.ok) {
      const repos = await reposRes.json();
      totalStars = Array.isArray(repos)
        ? repos.reduce(
            (sum: number, r: { stargazers_count: number }) =>
              sum + r.stargazers_count,
            0
          )
        : 0;
    }

    return {
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      publicRepos: user.public_repos ?? 0,
      totalStars,
      name: user.name || user.login,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      login: user.login,
    };
  } catch {
    return null;
  }
}

export async function getPinnedRepos(): Promise<GitHubRepo[]> {
  if (!GITHUB_TOKEN) return getFallbackRepos();

  const query = `{
    user(login: "${GITHUB_USERNAME}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name description url
            stargazerCount forkCount
            primaryLanguage { name color }
            updatedAt
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return getFallbackRepos();
    const data = await res.json();
    const nodes = data.data?.user?.pinnedItems?.nodes;
    return Array.isArray(nodes) && nodes.length > 0
      ? nodes
      : getFallbackRepos();
  } catch {
    return getFallbackRepos();
  }
}

export async function getLanguageStats(): Promise<LanguageStat[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
      {
        headers: buildHeaders(),
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return getFallbackLanguages();

    const repos = await res.json();
    if (!Array.isArray(repos)) return getFallbackLanguages();

    const langCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    }

    const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return getFallbackLanguages();

    const colors: Record<string, string> = {
      TypeScript: "#3178C6",
      JavaScript: "#F7DF1E",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#DEA584",
      Java: "#B07219",
      "C++": "#F34B7D",
      Ruby: "#CC342D",
      Swift: "#FA7343",
      Kotlin: "#A97BFF",
      CSS: "#563D7C",
      HTML: "#E34C26",
      Shell: "#89E051",
    };

    return Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
        color: colors[name] || "#64748b",
      }));
  } catch {
    return getFallbackLanguages();
  }
}

function getFallbackRepos(): GitHubRepo[] {
  return [
    {
      name: "distributed-cache",
      description:
        "High-performance distributed caching layer with Redis Cluster — handles 500K req/s",
      url: "#",
      stargazerCount: 127,
      forkCount: 34,
      primaryLanguage: { name: "Go", color: "#00ADD8" },
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      name: "ml-pipeline",
      description:
        "Scalable ML training pipeline with automated hyperparameter tuning and A/B testing",
      url: "#",
      stargazerCount: 89,
      forkCount: 21,
      primaryLanguage: { name: "Python", color: "#3572A5" },
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      name: "api-gateway",
      description:
        "Lightweight API gateway with rate limiting, circuit breaking, and observability",
      url: "#",
      stargazerCount: 203,
      forkCount: 67,
      primaryLanguage: { name: "TypeScript", color: "#3178C6" },
      updatedAt: "2023-12-20T00:00:00Z",
    },
  ];
}

function getFallbackLanguages(): LanguageStat[] {
  return [
    { name: "TypeScript", percentage: 35, color: "#3178C6" },
    { name: "Python", percentage: 25, color: "#3572A5" },
    { name: "Go", percentage: 20, color: "#00ADD8" },
    { name: "Java", percentage: 12, color: "#B07219" },
    { name: "Shell", percentage: 8, color: "#89E051" },
  ];
}
