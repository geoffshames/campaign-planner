export type EkatorRegistrySnapshot = {
  status: 'live' | 'pending';
  monitoredHandlesCount: number;
  seedingNetworkCount: number;
  snsViralCount: number;
  officialHandleCount: number;
};

export type EkatorAsset = {
  itemId: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  handle: string;
  caption: string;
  sourceUrl: string | null;
  isOwned: boolean;
  postDate: string | null;
  status: string;
  capturedAt: string | null;
  // Performance (from cc_performance, latest snapshot)
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  engagementRate: number | null;
};

export type EkatorAssetSnapshot = {
  status: 'live' | 'pending';
  assets: EkatorAsset[];
  performanceCount: number;
  awaitingMetricsCount: number;
  publishedCount: number;
};

export type EkatorChannelHistoryPoint = {
  capturedAt: string;
  audience: number | null;
  postCount: number | null;
};

export type EkatorOwnedChannel = {
  platform: 'youtube' | 'instagram' | 'tiktok';
  handle: string;
  audience: number | null;
  postCount: number | null;
  capturedAt: string | null;
  history: EkatorChannelHistoryPoint[];
};

export type EkatorChannelSnapshot = {
  status: 'live' | 'pending';
  channels: EkatorOwnedChannel[];
  refreshedAt: string | null;
};

export type EkatorChannelMetrics = {
  platform: string;
  audience: number;
  posts: number;
  views: number | null;
  engagementRate: number | null;
};

export type EkatorMetricsSnapshot = {
  status: 'live' | 'pending';
  channels: EkatorChannelMetrics[];
  totalViews: number;
  totalAudience: number;
};

type SupabaseRow = Record<string, unknown>;

const EKATOR_CLIENT_ID = '1159a218-5c5b-4373-8fb4-c7365bb81f4e';

export const fallbackEkatorRegistrySnapshot: EkatorRegistrySnapshot = {
  status: 'pending',
  monitoredHandlesCount: 0,
  seedingNetworkCount: 0,
  snsViralCount: 0,
  officialHandleCount: 0,
};

export const fallbackEkatorAssetSnapshot: EkatorAssetSnapshot = {
  status: 'pending',
  assets: [],
  performanceCount: 0,
  awaitingMetricsCount: 0,
  publishedCount: 0,
};

export const fallbackEkatorChannelSnapshot: EkatorChannelSnapshot = {
  status: 'pending',
  channels: [],
  refreshedAt: null,
};

export const fallbackEkatorMetricsSnapshot: EkatorMetricsSnapshot = {
  status: 'pending',
  channels: [],
  totalViews: 0,
  totalAudience: 0,
};

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 'true';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asOwnedPlatform(value: unknown): EkatorOwnedChannel['platform'] | null {
  const platform = asString(value).toLowerCase();
  return platform === 'youtube' || platform === 'instagram' || platform === 'tiktok' ? platform : null;
}

function hasPerformanceMetrics(asset: EkatorAsset): boolean {
  return asset.views !== null || asset.likes !== null || asset.comments !== null || asset.shares !== null;
}

type OwnedPublication = {
  platform: 'youtube' | 'instagram' | 'tiktok';
  sourceUrl: string;
};

function itemUrls(item: SupabaseRow): string[] {
  const urls: string[] = [];
  for (const key of ['source_url', 'post_url', 'permalink', 'url']) {
    const value = item[key];
    if (typeof value === 'string' && value.trim() && !urls.includes(value.trim())) {
      urls.push(value.trim());
    }
  }
  return urls;
}

/**
 * Publication evidence is intentionally URL-based. A raw uploaded MP4, an
 * `is_owned` flag, or a `street-eval` label does not prove that an asset was
 * published. If a source clip is posted later, its real owned-channel post URL
 * qualifies it and the asset is normalized to that platform.
 */
function ownedPublication(item: SupabaseRow): OwnedPublication | null {
  if (!asBoolean(item.is_owned)) return null;

  for (const sourceUrl of itemUrls(item)) {
    try {
      const url = new URL(sourceUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      const path = url.pathname;

      if (
        (host === 'youtu.be' && /^\/[A-Za-z0-9_-]+/.test(path)) ||
        ((host === 'youtube.com' || host.endsWith('.youtube.com')) &&
          ((path === '/watch' && Boolean(url.searchParams.get('v'))) || /^\/(shorts|live|embed)\/[A-Za-z0-9_-]+/.test(path)))
      ) {
        return { platform: 'youtube', sourceUrl };
      }

      if (
        (host === 'instagram.com' || host.endsWith('.instagram.com')) &&
        /^\/(p|reel|tv)\/[A-Za-z0-9_.-]+/.test(path)
      ) {
        return { platform: 'instagram', sourceUrl };
      }

      if (
        (host === 'tiktok.com' || host.endsWith('.tiktok.com')) &&
        /^\/@[^/]+\/video\/\d+/.test(path)
      ) {
        return { platform: 'tiktok', sourceUrl };
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function supabaseFetch<T>(baseUrl: string, key: string, path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body.slice(0, 180)}`);
  }

  return response.json() as Promise<T>;
}

export async function getEkatorRegistrySnapshot(): Promise<EkatorRegistrySnapshot> {
  const baseUrl = process.env.SUPABASE_EKATOR_URL || process.env.SUPABASE_SINCERITY_STUDIOS_URL;
  const key = process.env.SUPABASE_EKATOR_SERVICE_ROLE_KEY || process.env.SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY;

  if (!baseUrl || !key) {
    return fallbackEkatorRegistrySnapshot;
  }

  try {
    const clients = await supabaseFetch<SupabaseRow[]>(baseUrl, key, '/rest/v1/cc_clients?select=client_id&slug=eq.ekator&limit=1');
    const client = clients[0];
    const clientId = asString(client?.client_id, EKATOR_CLIENT_ID);
    const encodedClientId = encodeURIComponent(clientId);

    const handles = await supabaseFetch<SupabaseRow[]>(
      baseUrl,
      key,
      `/rest/v1/cc_monitored_handles?select=kind&client_id=eq.${encodedClientId}&limit=200`,
    );
    const officialHandles = handles.filter((handle) => asString(handle.kind).toLowerCase().includes('official'));
    const snsViral = handles.filter((handle) => asString(handle.kind).toLowerCase().includes('viral'));
    const seeding = handles.filter((handle) => asString(handle.kind).toLowerCase().includes('seeding'));

    return {
      status: 'live',
      monitoredHandlesCount: handles.length,
      seedingNetworkCount: seeding.length,
      snsViralCount: snsViral.length,
      officialHandleCount: officialHandles.length,
    };
  } catch (error) {
    console.error(
      '[ekator-dashboard] Registry snapshot unavailable:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return fallbackEkatorRegistrySnapshot;
  }
}

export async function getEkatorAssetSnapshot(): Promise<EkatorAssetSnapshot> {
  const baseUrl = process.env.SUPABASE_EKATOR_URL || process.env.SUPABASE_SINCERITY_STUDIOS_URL;
  const key = process.env.SUPABASE_EKATOR_SERVICE_ROLE_KEY || process.env.SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY;

  if (!baseUrl || !key) {
    return fallbackEkatorAssetSnapshot;
  }

  try {
    const clients = await supabaseFetch<SupabaseRow[]>(baseUrl, key, '/rest/v1/cc_clients?select=client_id&slug=eq.ekator&limit=1');
    const clientId = asString(clients[0]?.client_id, EKATOR_CLIENT_ID);
    const encodedClientId = encodeURIComponent(clientId);
    const items = await supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_items?select=*&client_id=eq.${encodedClientId}&limit=200`);

    const publishedItems = items.flatMap((item) => {
      const publication = ownedPublication(item);
      return publication ? [{ item, publication }] : [];
    });
    const publishedItemIds = publishedItems
      .map(({ item }) => asString(item.item_id))
      .filter((itemId) => /^[A-Za-z0-9_-]{1,128}$/.test(itemId));

    // Preserve valid publication inventory if performance enrichment is unavailable.
    // Scope the read to this ledger so unrelated rows can never exhaust the result cap.
    let performance: SupabaseRow[] = [];
    if (publishedItemIds.length > 0) {
      const itemIdFilter = publishedItemIds.map(encodeURIComponent).join(',');
      try {
        performance = await supabaseFetch<SupabaseRow[]>(
          baseUrl,
          key,
          `/rest/v1/cc_performance?select=*&item_id=in.(${itemIdFilter})&order=captured_at.desc&limit=500`,
        );
      } catch (error) {
        console.error(
          '[ekator-dashboard] Performance enrichment unavailable:',
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }

    // Build a map of latest performance per item_id
    const perfByItem = new Map<string, SupabaseRow>();
    for (const row of performance) {
      const itemId = asString(row.item_id);
      if (itemId && !perfByItem.has(itemId)) {
        perfByItem.set(itemId, row); // first occurrence = latest (ordered desc)
      }
    }

    const assets: EkatorAsset[] = publishedItems.map(({ item, publication }) => {
      const itemId = asString(item.item_id);
      const perf = perfByItem.get(itemId);
      return {
        itemId,
        platform: publication.platform,
        handle: asString(item.handle, 'unknown'),
        caption: asString(item.caption, 'Untitled'),
        sourceUrl: publication.sourceUrl,
        isOwned: true,
        postDate: typeof item.post_date === 'string' ? item.post_date : null,
        status: asString(item.status, 'unknown'),
        capturedAt: perf && typeof perf.captured_at === 'string' ? perf.captured_at : null,
        views: perf ? asNumber(perf.views) : null,
        likes: perf ? asNumber(perf.likes) : null,
        comments: perf ? asNumber(perf.comments) : null,
        shares: perf ? asNumber(perf.shares) : null,
        engagementRate: perf ? asNumber(perf.engagement_rate) : null,
      };
    });

    return {
      status: 'live',
      assets,
      performanceCount: assets.filter(hasPerformanceMetrics).length,
      awaitingMetricsCount: assets.filter((asset) => !hasPerformanceMetrics(asset)).length,
      publishedCount: assets.length,
    };
  } catch (error) {
    console.error(
      '[ekator-dashboard] Publication inventory unavailable:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return fallbackEkatorAssetSnapshot;
  }
}

export async function getEkatorChannelSnapshot(): Promise<EkatorChannelSnapshot> {
  const baseUrl = process.env.SUPABASE_EKATOR_URL || process.env.SUPABASE_SINCERITY_STUDIOS_URL;
  const key = process.env.SUPABASE_EKATOR_SERVICE_ROLE_KEY || process.env.SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY;

  if (!baseUrl || !key) return fallbackEkatorChannelSnapshot;

  try {
    const clients = await supabaseFetch<SupabaseRow[]>(
      baseUrl,
      key,
      '/rest/v1/cc_clients?select=own_handles,last_ingest&slug=eq.ekator&limit=1',
    );
    const client = clients[0];
    const rawChannels = Array.isArray(client?.own_handles) ? client.own_handles : [];
    const channels = rawChannels.flatMap((raw): EkatorOwnedChannel[] => {
      if (!raw || typeof raw !== 'object') return [];
      const row = raw as SupabaseRow;
      const platform = asOwnedPlatform(row.platform);
      if (!platform) return [];
      const rawHistory = Array.isArray(row.history) ? row.history : [];
      const history = rawHistory.flatMap((point): EkatorChannelHistoryPoint[] => {
        if (!point || typeof point !== 'object') return [];
        const historyRow = point as SupabaseRow;
        const capturedAt = asString(historyRow.captured_at);
        if (!capturedAt) return [];
        return [{
          capturedAt,
          audience: asNumber(historyRow.audience),
          postCount: asNumber(historyRow.post_count),
        }];
      }).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));

      return [{
        platform,
        handle: asString(row.handle),
        audience: asNumber(row.audience),
        postCount: asNumber(row.post_count),
        capturedAt: asString(row.captured_at) || null,
        history,
      }];
    });
    const latestChannelCapture = channels
      .map((channel) => channel.capturedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);

    return {
      status: channels.length > 0 ? 'live' : 'pending',
      channels,
      refreshedAt: asString(client?.last_ingest) || latestChannelCapture || null,
    };
  } catch (error) {
    console.error(
      '[ekator-dashboard] Channel snapshot unavailable:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return fallbackEkatorChannelSnapshot;
  }
}

export async function getEkatorMetricsSnapshot(): Promise<EkatorMetricsSnapshot> {
  const baseUrl = process.env.SUPABASE_EKATOR_URL || process.env.SUPABASE_SINCERITY_STUDIOS_URL;
  const key = process.env.SUPABASE_EKATOR_SERVICE_ROLE_KEY || process.env.SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY;

  if (!baseUrl || !key) {
    return fallbackEkatorMetricsSnapshot;
  }

  try {
    const assetSnap = await getEkatorAssetSnapshot();
    const assets = assetSnap.assets;

    // Group by platform
    const platformMap = new Map<string, { audience: number; posts: number; views: number; engagementSum: number; engagementCount: number }>();

    for (const asset of assets) {
      const p = asset.platform;
      if (!platformMap.has(p)) {
        platformMap.set(p, { audience: 0, posts: 0, views: 0, engagementSum: 0, engagementCount: 0 });
      }
      const entry = platformMap.get(p)!;
      entry.posts += 1;
      if (asset.views !== null) entry.views += asset.views;
      if (asset.engagementRate !== null) {
        entry.engagementSum += asset.engagementRate;
        entry.engagementCount += 1;
      }
    }

    const channels: EkatorChannelMetrics[] = Array.from(platformMap.entries()).map(([platform, data]) => ({
      platform,
      audience: data.audience,
      posts: data.posts,
      views: data.views > 0 ? data.views : null,
      engagementRate: data.engagementCount > 0 ? data.engagementSum / data.engagementCount : null,
    }));

    return {
      status: 'live',
      channels,
      totalViews: channels.reduce((sum, ch) => sum + (ch.views ?? 0), 0),
      totalAudience: channels.reduce((sum, ch) => sum + ch.audience, 0),
    };
  } catch (error) {
    console.error(
      '[ekator-dashboard] Aggregate metrics unavailable:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return fallbackEkatorMetricsSnapshot;
  }
}

export type EkatorFullSnapshot = {
  registry: EkatorRegistrySnapshot;
  assets: EkatorAssetSnapshot;
  channelSnapshot: EkatorChannelSnapshot;
};

export async function getEkatorFullSnapshot(): Promise<EkatorFullSnapshot> {
  const [registry, assets, channelSnapshot] = await Promise.all([
    getEkatorRegistrySnapshot(),
    getEkatorAssetSnapshot(),
    getEkatorChannelSnapshot(),
  ]);
  return { registry, assets, channelSnapshot };
}
