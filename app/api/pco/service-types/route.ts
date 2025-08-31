import { NextResponse } from 'next/server';
import { pcoGet } from '@/lib/pco';

export async function GET() {
  try {
    const json = await pcoGet('/service_types');
    // normalize a tiny shape for the UI
    const items = (json.data ?? []).map((s: any) => ({
      id: String(s.id),
      name: s.attributes?.name ?? '(unnamed)',
    }));
    return NextResponse.json({ ok: true, items });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}