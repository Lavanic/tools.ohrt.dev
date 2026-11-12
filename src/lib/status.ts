import { warn } from './warn';

export const STATUS_PAGE = 'https://status.ohrt.dev';

export type Health = 'UP' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE' | 'NO_DATA';

export async function fetchHealth(tags: string[]): Promise<Record<string, Health>> {
  if (tags.length === 0) return {};
  try {
    const res = await fetch(`${STATUS_PAGE}/dashboard-apis/monitor-bars?tags=${encodeURIComponent(tags.join(','))}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data, missingTags = [] } = (await res.json()) as {
      data: Record<string, { currentStatus: Health }>;
      missingTags?: string[];
    };
    if (missingTags.length) warn('status', `unknown monitor tags: ${missingTags.join(', ')}`);
    return Object.fromEntries(Object.entries(data).map(([tag, m]) => [tag, m.currentStatus]));
  } catch (err) {
    warn('status', `${err}, the swirls fall back to yellow`);
    return {};
  }
}
