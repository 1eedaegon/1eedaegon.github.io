import { execSync } from 'child_process';
import fs from 'fs';

export interface DateInfo {
  date: Date;
  updated: Date | null;
  source: 'frontmatter' | 'git' | 'filesystem' | 'now';
}

/**
 * Source path of an article's markdown file, for git history lookups.
 * Glob-loader entry ids have no extension, so prefer the loader-provided
 * filePath — building the path from post.id silently breaks git dates
 * (every date falls back to checkout time in CI).
 */
export function articleSourcePath(post: { id: string; filePath?: string }): string {
  return post.filePath ?? `src/content/articles/${post.id}.md`;
}

/**
 * Resolve post dates with priority:
 * 1. Frontmatter (explicit)
 * 2. Git history
 * 3. Filesystem
 * 4. Current time
 */
export async function resolvePostDates(
  filePath: string,
  frontmatter: { date?: Date; updated?: Date }
): Promise<DateInfo> {
  // === DATE Resolution ===
  let date: Date;
  let dateSource: DateInfo['source'];

  if (frontmatter.date) {
    date = new Date(frontmatter.date);
    dateSource = 'frontmatter';
  } else {
    try {
      const gitCreated = execSync(
        `git log --follow --format=%aI --reverse "${filePath}" | head -1`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim();

      if (gitCreated) {
        date = new Date(gitCreated);
        dateSource = 'git';
      } else {
        throw new Error('No git history');
      }
    } catch {
      try {
        const stats = fs.statSync(filePath);
        date = stats.birthtime;
        dateSource = 'filesystem';
      } catch {
        date = new Date();
        dateSource = 'now';
      }
    }
  }

  // === UPDATED Resolution ===
  let updated: Date | null = null;

  if (frontmatter.updated) {
    updated = new Date(frontmatter.updated);
  } else {
    try {
      const gitModified = execSync(
        `git log -1 --format=%aI "${filePath}"`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim();

      if (gitModified) {
        const modifiedDate = new Date(gitModified);
        const daysDiff = Math.floor(
          (modifiedDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff >= 1 && (await hasSubstantiveChanges(filePath))) {
          updated = modifiedDate;
        }
      }
    } catch {
      // Git failed, updated remains null
    }
  }

  return { date, updated, source: dateSource };
}

/**
 * Check if file has substantive changes (not just typos or formatting)
 */
async function hasSubstantiveChanges(filePath: string): Promise<boolean> {
  try {
    const diff = execSync(`git log -1 -p -- "${filePath}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const changedLines = diff
      .split('\n')
      .filter((line) => line.startsWith('+') || line.startsWith('-'))
      .filter((line) => !line.startsWith('+++') && !line.startsWith('---'));

    // Patterns to ignore (trivial changes)
    const trivialPatterns = [
      /^[+-]\s*updated:/i,
      /^[+-]\s*$/,
      /^[+-]\s*<!--.*-->/,
      /^[+-]\s{0,4}$/,
    ];

    const substantiveLines = changedLines.filter(
      (line) => !trivialPatterns.some((pattern) => pattern.test(line))
    );

    // Consider substantive if:
    // - 5+ lines changed OR
    // - Code block modified
    return substantiveLines.length >= 5 || /```/.test(substantiveLines.join('\n'));
  } catch {
    return false;
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date, locale = 'ko-KR'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  });
}

/**
 * Format date for ISO (used in <time> datetime attribute)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date, locale = 'ko-KR'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDays < 1) return formatter.format(0, 'day');
  if (diffDays < 7) return formatter.format(-diffDays, 'day');
  if (diffDays < 30) return formatter.format(-Math.floor(diffDays / 7), 'week');
  if (diffDays < 365) return formatter.format(-Math.floor(diffDays / 30), 'month');
  return formatter.format(-Math.floor(diffDays / 365), 'year');
}
