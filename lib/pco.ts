// lib/pco.ts
const PCO_BASE = 'https://api.planningcenteronline.com/services/v2';

function authHeader() {
  const id = process.env.PCO_APPLICATION_ID;
  const secret = process.env.PCO_SECRET;
  if (!id || !secret) throw new Error('Missing PCO_APPLICATION_ID / PCO_SECRET');
  const b64 = Buffer.from(`${id}:${secret}`).toString('base64');
  return `Basic ${b64}`;
}

export async function pcoGet(path: string): Promise<any> {
  const url = `${PCO_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(),
      Accept: 'application/json',
    },
    // Next.js route handlers run on server; cache disabled for dev clarity
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`PCO GET ${path} -> ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}