import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const baseUrl = process.env.SUPABASE_EKATOR_URL || process.env.SUPABASE_SINCERITY_STUDIOS_URL;
  const key = process.env.SUPABASE_EKATOR_SERVICE_ROLE_KEY || process.env.SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY;
  const clientId = '1159a218-5c5b-4373-8fb4-c7365bb81f4e';

  if (!baseUrl || !key) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  }

  const ts = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const responseId = `manual_refresh_${ts}`;

  try {
    const resp = await fetch(`${baseUrl}/rest/v1/cc_responses`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        response_id: responseId,
        client_id: clientId,
        question: 'MANUAL_REFRESH_REQUEST',
        scope: 'dashboard',
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return NextResponse.json({ ok: false, error: `Supabase ${resp.status}: ${body.slice(0, 120)}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true, responseId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
