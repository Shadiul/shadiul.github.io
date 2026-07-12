import type { APIContext } from 'astro';
import { renderCardPng } from '@/lib/og';

/* Build-time downloadable business-card PNG at /card.png. */
export async function GET(_ctx: APIContext) {
  const png = await renderCardPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
}
