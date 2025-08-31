import { NextResponse } from 'next/server';

function basicAuthHeader() {
  const id = process.env.PCO_APPLICATION_ID || '';
  const secret = process.env.PCO_SECRET || '';
  const token = Buffer.from(`${id}:${secret}`).toString('base64');
  return `Basic ${token}`;
}

export async function GET(
  _req: Request,
  { params }: { params: { serviceTypeId: string } }
) {
  const { serviceTypeId } = params;
  if (!serviceTypeId) {
    return NextResponse.json({ ok: false, error: 'Missing serviceTypeId' }, { status: 400 });
  }
  if (!process.env.PCO_APPLICATION_ID || !process.env.PCO_SECRET) {
    return NextResponse.json({ ok: false, error: 'Missing PCO env vars' }, { status: 500 });
  }

  // Use PCO’s built-in future filter and sort ascending by sort_date
  const url =
    `https://api.planningcenteronline.com/services/v2` +
    `/service_types/${encodeURIComponent(serviceTypeId)}` +
    `/plans?filter=future&order=sort_date`;

  const res = await fetch(url, {
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/json',
      'User-Agent': 'prod-app-nextjs (contact: you@example.com)',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { ok: false, error: `PCO GET ${url} -> ${res.status} ${res.statusText}: ${text}` },
      { status: res.status }
    );
  }

  const json = (await res.json()) as {
    data?: Array<{
      id: string;
      attributes?: { title?: string | null; sort_date?: string | null };
    }>;
  } | null;

  const items =
    json?.data?.map(p => ({
      id: p.id,
      title: p.attributes?.title || '(untitled)',
      sort_date: p.attributes?.sort_date || null,
    })) ?? [];

  return NextResponse.json({ ok: true, items });
}