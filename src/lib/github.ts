import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { warn } from './warn';

export interface Repo {
  stars: number;
  commits: number;
  /** the newest commit on the default branch */
  last?: { message: string; date: string; sha: string; url: string };
}

interface Commit {
  sha: string;
  html_url: string;
  commit: { message: string; committer: { date: string } };
}

// Local builds have no token and GitHub allows them 60 requests an hour, so answers are
// kept for an hour. CI starts without this file and always asks.
const CACHE = path.join(process.cwd(), 'node_modules/.cache/tools.ohrt.dev/github.json');
const FRESH = 60 * 60 * 1000;

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'tools.ohrt.dev',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(pathname: string) {
  const res = await fetch(`https://api.github.com${pathname}`, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${pathname}: HTTP ${res.status}`);
  return res;
}

async function fetchRepo(slug: string): Promise<Repo> {
  const [repo, commits] = await Promise.all([get(`/repos/${slug}`), get(`/repos/${slug}/commits?per_page=1`)]);
  const { stargazers_count: stars } = (await repo.json()) as { stargazers_count: number };
  const [head] = (await commits.json()) as Commit[];
  // one commit per page, so the number of the last page is the number of commits
  const pages = commits.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];
  return {
    stars,
    commits: pages ? Number(pages) : head ? 1 : 0,
    last: head && {
      message: head.commit.message.split('\n', 1)[0],
      date: head.commit.committer.date,
      sha: head.sha,
      url: head.html_url,
    },
  };
}

/** Numbers and the newest commit for GitHub repo URLs, keyed by URL. A repo that can't be reached and was never seen is left out. */
export async function fetchRepos(urls: string[]): Promise<Record<string, Repo>> {
  const cache: Record<string, { at: number; repo: Repo }> = await readFile(CACHE, 'utf8')
    .then(JSON.parse)
    .catch(() => ({}));
  const repos: Record<string, Repo> = {};
  await Promise.all(
    urls.map(async (url) => {
      const { hostname, pathname } = new URL(url);
      if (hostname !== 'github.com') return;
      const slug = pathname.replace(/^\/|\/$/g, '');
      const seen = cache[slug];
      if (!seen || Date.now() - seen.at > FRESH) {
        try {
          cache[slug] = { at: Date.now(), repo: await fetchRepo(slug) };
        } catch (err) {
          warn('github', `${err}${seen ? ', keeping the last numbers seen' : ''}`);
        }
      }
      if (cache[slug]) repos[url] = cache[slug].repo;
    }),
  );
  await mkdir(path.dirname(CACHE), { recursive: true })
    .then(() => writeFile(CACHE, JSON.stringify(cache)))
    .catch(() => {});
  return repos;
}
