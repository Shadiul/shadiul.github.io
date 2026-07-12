/**
 * Build-time GitHub profile fetch. Pulls public profile stats + the
 * contribution calendar and inlines the avatar as a data URI, so the built
 * site has zero runtime dependency on GitHub. On success it persists to a
 * local disk cache; if a later fetch is rate-limited (ok:false), it falls
 * back to that cache — so the card stays populated even offline / throttled.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(process.cwd(), '.cache');
const cacheFile = (user: string) => join(CACHE_DIR, `github-${user}.json`);
function readDisk(user: string): GitHubProfile | null {
  try { return JSON.parse(readFileSync(cacheFile(user), 'utf8')) as GitHubProfile; }
  catch { return null; }
}
function writeDisk(user: string, p: GitHubProfile) {
  try { mkdirSync(CACHE_DIR, { recursive: true }); writeFileSync(cacheFile(user), JSON.stringify(p)); }
  catch { /* cache is best-effort */ }
}

export interface GHDay { level: number }
export interface GHAchievement { name: string; dataUri: string }
export interface GitHubProfile {
  ok: boolean;
  login: string;
  name: string;
  followers: number;
  publicRepos: number;
  memberSince: number | null;
  avatarDataUri: string | null;
  contributions: number;
  days: GHDay[];
  achievements: GHAchievement[];
}

const titleCase = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Scrape the profile page for GitHub achievement badges and inline them. */
async function fetchAchievements(user: string): Promise<GHAchievement[]> {
  const out: GHAchievement[] = [];
  try {
    const res = await fetch(`https://github.com/${user}`, { headers: GH_HEADERS });
    if (!res.ok) return out;
    const html = await res.text();
    const re = /https:\/\/github\.githubassets\.com\/assets\/([a-z0-9-]+?)-default[^"'\s]*\.png/g;
    const seen = new Set<string>();
    for (const m of html.matchAll(re)) {
      const slug = m[1];
      if (seen.has(slug) || seen.size >= 8) continue;
      seen.add(slug);
      try {
        const img = await fetch(m[0]);
        if (!img.ok) continue;
        const buf = Buffer.from(await img.arrayBuffer());
        out.push({ name: titleCase(slug), dataUri: `data:image/png;base64,${buf.toString('base64')}` });
      } catch { /* skip this badge */ }
    }
  } catch { /* no achievements */ }
  return out;
}

// Authenticated GitHub requests (api.github.com + github.com) get 5000/hr in
// CI via the Actions GITHUB_TOKEN; unauthenticated falls back to 60/hr locally.
// The token is ONLY sent to GitHub hosts — never to jogruber/CDN fetches.
const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
const GH_HEADERS: Record<string, string> = { 'User-Agent': 'shadiul.github.io' };
if (token) GH_HEADERS.Authorization = `Bearer ${token}`;

// Cache successful profiles for the process lifetime so the Astro dev server
// (which re-runs page frontmatter on every request) doesn't exhaust the limit.
const cache = new Map<string, GitHubProfile>();

export async function getGitHubProfile(user: string): Promise<GitHubProfile> {
  const hit = cache.get(user);
  if (hit) return hit;
  const empty: GitHubProfile = {
    ok: false, login: user, name: '', followers: 0, publicRepos: 0,
    memberSince: null, avatarDataUri: null, contributions: 0, days: [], achievements: [],
  };
  try {
    const [uRes, cRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers: GH_HEADERS }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
    ]);
    if (!uRes.ok) {
      const disk = readDisk(user);
      if (disk?.ok) { cache.set(user, disk); return disk; }
      return empty;
    }
    const u = await uRes.json();

    let contributions = 0;
    let days: GHDay[] = [];
    if (cRes.ok) {
      const c = await cRes.json();
      if (Array.isArray(c?.contributions)) {
        days = c.contributions;
        contributions = (c.total?.lastYear ?? Object.values(c.total ?? {})[0] ?? 0) as number;
      }
    }

    let avatarDataUri: string | null = null;
    const avatarP = (async () => {
      try {
        const aRes = await fetch(`${u.avatar_url}&s=128`);
        if (aRes.ok) {
          const buf = Buffer.from(await aRes.arrayBuffer());
          const type = aRes.headers.get('content-type') || 'image/jpeg';
          avatarDataUri = `data:${type};base64,${buf.toString('base64')}`;
        }
      } catch { /* keep null */ }
    })();
    const achievementsP = fetchAchievements(user);
    const [, achievements] = await Promise.all([avatarP, achievementsP]);

    const profile: GitHubProfile = {
      ok: true,
      login: u.login ?? user,
      name: u.name ?? user,
      followers: u.followers ?? 0,
      publicRepos: u.public_repos ?? 0,
      memberSince: u.created_at ? Number(u.created_at.slice(0, 4)) : null,
      avatarDataUri,
      contributions,
      days,
      achievements,
    };
    cache.set(user, profile);
    writeDisk(user, profile);
    return profile;
  } catch {
    const disk = readDisk(user);
    if (disk?.ok) { cache.set(user, disk); return disk; }
    return empty;
  }
}
