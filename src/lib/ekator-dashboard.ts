export type EkatorRegistryItem = {
  caption: string;
  platform: string;
  handle: string;
  status: string;
};

export type EkatorRegistryHandle = {
  displayName: string;
  handle?: string | null;
  platforms: string;
  kind: string;
  notes?: string | null;
};

export type EkatorRegistrySnapshot = {
  status: 'live' | 'pending';
  itemsCount: number;
  readyItemsCount: number;
  ownedItemsCount: number;
  streetEvalItemsCount: number;
  monitoredHandlesCount: number;
  activeMonitoredHandlesCount: number;
  seedingNetworkCount: number;
  snsViralCount: number;
  officialHandleCount: number;
  responseCount: number;
  recentItems: EkatorRegistryItem[];
  topHandles: EkatorRegistryHandle[];
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
  itemsCount: 16,
  readyItemsCount: 16,
  ownedItemsCount: 16,
  streetEvalItemsCount: 15,
  monitoredHandlesCount: 30,
  activeMonitoredHandlesCount: 30,
  seedingNetworkCount: 24,
  snsViralCount: 6,
  officialHandleCount: 2,
  responseCount: 1,
  recentItems: [
    { caption: 'Idol Till I Die EP1', platform: 'youtube', handle: 'Idol Till I Die', status: 'ready' },
  ],
  topHandles: [
    { displayName: '@ekatormatthew', handle: 'ekatormatthew', platforms: 'TT', kind: 'sns-viral', notes: 'Matthew fan signal' },
    { displayName: '@ekator.lukas', handle: 'ekator.lukas', platforms: 'TT', kind: 'sns-viral', notes: 'Lukas fan signal' },
    { displayName: '@idoltillidie', handle: 'idoltillidie', platforms: 'IG,YTB,TT', kind: 'official', notes: 'Official account' },
  ],
};

export const fallbackEkatorAssetSnapshot: EkatorAssetSnapshot = {
  status: 'pending',
  assets: [],
  performanceCount: 0,
  awaitingMetricsCount: 0,
  publishedCount: 0,
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
    const clients = await supabaseFetch<SupabaseRow[]>(baseUrl, key, '/rest/v1/cc_clients?select=*&slug=eq.ekator&limit=1');
    const client = clients[0];
    const clientId = asString(client?.client_id, EKATOR_CLIENT_ID);
    const encodedClientId = encodeURIComponent(clientId);

    const [items, handles, responses] = await Promise.all([
      supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_items?select=*&client_id=eq.${encodedClientId}&limit=200`),
      supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_monitored_handles?select=*&client_id=eq.${encodedClientId}&limit=200`),
      supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_responses?select=*&client_id=eq.${encodedClientId}&limit=50`),
    ]);

    const activeHandles = handles.filter((handle) => asBoolean(handle.active));
    const readyItems = items.filter((item) => asString(item.status).toLowerCase() === 'ready');
    const ownedItems = items.filter((item) => asBoolean(item.is_owned));
    const streetEvalItems = items.filter((item) => asString(item.platform).toLowerCase() === 'street-eval');
    const normalizedHandles = handles.map((handle) => ({
      displayName: asString(handle.display_name, asString(handle.handle, 'unknown')),
      handle: typeof handle.handle === 'string' ? handle.handle : null,
      platforms: asString(handle.platforms, '—'),
      kind: asString(handle.kind, 'unknown'),
      notes: typeof handle.notes === 'string' ? handle.notes : null,
    }));

    const officialHandles = normalizedHandles.filter((handle) => handle.kind.toLowerCase().includes('official'));
    const snsViral = normalizedHandles.filter((handle) => handle.kind.toLowerCase().includes('viral'));
    const seeding = normalizedHandles.filter((handle) => handle.kind.toLowerCase().includes('seeding'));

    return {
      status: 'live',
      itemsCount: items.length,
      readyItemsCount: readyItems.length,
      ownedItemsCount: ownedItems.length,
      streetEvalItemsCount: streetEvalItems.length,
      monitoredHandlesCount: handles.length,
      activeMonitoredHandlesCount: activeHandles.length,
      seedingNetworkCount: seeding.length,
      snsViralCount: snsViral.length,
      officialHandleCount: officialHandles.length,
      responseCount: responses.length,
      recentItems: items
        .filter((item) => asString(item.platform).toLowerCase() !== 'street-eval')
        .slice(0, 5)
        .map((item) => ({
          caption: asString(item.caption, 'Untitled asset'),
          platform: asString(item.platform, 'unknown'),
          handle: asString(item.handle, 'unknown'),
          status: asString(item.status, 'unknown'),
        })),
      topHandles: [
        ...officialHandles,
        ...snsViral,
        ...seeding,
        ...normalizedHandles,
      ].slice(0, 8),
    };
  } catch {
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
    const encodedClientId = encodeURIComponent(EKATOR_CLIENT_ID);
    // Preserve the asset inventory even if the performance endpoint is unavailable.
    // A downstream metrics failure must never make the whole section look empty.
    const [itemsResult, performanceResult] = await Promise.allSettled([
      supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_items?select=*&client_id=eq.${encodedClientId}&limit=200`),
      supabaseFetch<SupabaseRow[]>(baseUrl, key, `/rest/v1/cc_performance?select=*&order=captured_at.desc&limit=200`),
    ]);

    if (itemsResult.status === 'rejected') {
      return fallbackEkatorAssetSnapshot;
    }

    const items = itemsResult.value;
    const performance = performanceResult.status === 'fulfilled' ? performanceResult.value : [];

    // Build a map of latest performance per item_id
    const perfByItem = new Map<string, SupabaseRow>();
    for (const row of performance) {
      const itemId = asString(row.item_id);
      if (itemId && !perfByItem.has(itemId)) {
        perfByItem.set(itemId, row); // first occurrence = latest (ordered desc)
      }
    }

    const publishedItems = items.flatMap((item) => {
      const publication = ownedPublication(item);
      return publication ? [{ item, publication }] : [];
    });

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
      performanceCount: assets.filter((asset) => asset.views !== null).length,
      awaitingMetricsCount: assets.filter((asset) => asset.views === null).length,
      publishedCount: assets.length,
    };
  } catch {
    return fallbackEkatorAssetSnapshot;
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
  } catch {
    return fallbackEkatorMetricsSnapshot;
  }
}

export type EkatorFullSnapshot = {
  registry: EkatorRegistrySnapshot;
  assets: EkatorAssetSnapshot;
};

export async function getEkatorFullSnapshot(): Promise<EkatorFullSnapshot> {
  const [registry, assets] = await Promise.all([
    getEkatorRegistrySnapshot(),
    getEkatorAssetSnapshot(),
  ]);
  return { registry, assets };
}
