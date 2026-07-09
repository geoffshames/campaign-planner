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
    { caption: '0627 street eval - Matthew', platform: 'street-eval', handle: 'Matthew', status: 'ready' },
    { caption: '0627 street eval - Cai Jinxin', platform: 'street-eval', handle: 'Cai Jinxin', status: 'ready' },
  ],
  topHandles: [
    { displayName: '@ekatormatthew', handle: 'ekatormatthew', platforms: 'TT', kind: 'sns-viral', notes: 'Matthew fan signal' },
    { displayName: '@ekator.lukas', handle: 'ekator.lukas', platforms: 'TT', kind: 'sns-viral', notes: 'Lukas fan signal' },
    { displayName: '@idoltillidie', handle: 'idoltillidie', platforms: 'IG,YTB,TT', kind: 'official', notes: 'Official account' },
  ],
};

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 'true';
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
      recentItems: items.slice(0, 5).map((item) => ({
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
