import { getGitHubStats, getPinnedRepos, getLanguageStats } from "@/lib/github";

export async function GET() {
  const [stats, repos, languages] = await Promise.all([
    getGitHubStats(),
    getPinnedRepos(),
    getLanguageStats(),
  ]);

  return Response.json({ stats, repos, languages });
}
