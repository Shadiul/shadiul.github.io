import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import QRCode from 'qrcode';

/* Build-time OG image generator — 1200×630 PNG.
 * Dark violet ground + the knowledge-graph identity motif, brand eyebrow,
 * big title. Graph nodes come from a seeded RNG so builds are reproducible. */

const W = 1200;
const H = 630;

// Palette = the dark theme tokens (OG images are always dark-branded).
const C = {
  ground: '#0E0B16',
  card: '#16121F',
  text: '#ECE9F5',
  muted: '#9A93B0',
  faint: '#6E6786',
  border: '#26203A',
  accent: '#7C5CFF',
  accentSoft: '#9A80FF',
};

/** Deterministic PRNG (mulberry32) — same seed, same graph, stable builds. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Knowledge-graph SVG: drifted nodes + proximity links, violet on dark. */
function graphSvg(seedText: string) {
  const rand = rng(seedFrom(seedText));
  const N = 26;
  const nodes = Array.from({ length: N }, () => ({
    x: rand() * W,
    y: rand() * H,
    r: 2 + rand() * 3.2,
  }));
  const parts: string[] = [];
  for (let a = 0; a < N; a++) {
    for (let b = a + 1; b < N; b++) {
      const p = nodes[a]!, q = nodes[b]!;
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 260) {
        const o = (0.20 * (1 - d / 260)).toFixed(3);
        parts.push(
          `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${C.accent}" stroke-opacity="${o}" stroke-width="1.5"/>`,
        );
      }
    }
  }
  for (const n of nodes) {
    parts.push(
      `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${C.accentSoft}" fill-opacity="0.8"/>`,
    );
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
}

let fonts: { name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[] | null = null;

async function loadFonts() {
  if (fonts) return fonts;
  // Resolve from the project root — the built endpoint runs from dist/,
  // where import.meta.url-relative paths would break.
  const f = (p: string) => readFile(resolve(process.cwd(), 'node_modules', p));
  fonts = [
    { name: 'Inter', data: await f('@fontsource/inter/files/inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Inter', data: await f('@fontsource/inter/files/inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: await f('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ];
  return fonts;
}

export interface OgSpec {
  title: string;
  eyebrow: string; // mono violet kicker, e.g. "shadiul.github.io" or "blog · systems"
  sub?: string; // optional muted line under the title
}

/** Satori element helper — object notation, no JSX needed. */
const el = (type: string, props: Record<string, unknown>, ...children: unknown[]) => ({
  type,
  props: { ...props, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) },
});

export async function renderOgPng({ title, eyebrow, sub }: OgSpec): Promise<Buffer> {
  const graph = graphSvg(title);

  const tree = el(
    'div',
    {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        backgroundColor: C.ground, position: 'relative', fontFamily: 'Inter',
      },
    },
    // graph backdrop
    el('img', {
      src: `data:image/svg+xml;utf8,${encodeURIComponent(graph)}`,
      width: W, height: H,
      style: { position: 'absolute', top: 0, left: 0 },
    }),
    // soft vignette to keep text legible
    el('div', {
      style: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(120deg, rgba(14,11,22,0.94) 0%, rgba(14,11,22,0.72) 55%, rgba(14,11,22,0.35) 100%)',
      },
    }),
    // content
    el(
      'div',
      {
        style: {
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', height: '100%', padding: '0 96px', gap: '26px',
        },
      },
      el(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
        el('div', {
          style: {
            width: '14px', height: '14px', borderRadius: '50%',
            backgroundColor: C.accent, boxShadow: `0 0 24px ${C.accent}`,
          },
        }),
        el('div', {
          style: {
            fontFamily: 'JetBrains Mono', fontSize: '26px', color: C.accent,
            textTransform: 'uppercase', letterSpacing: '0.12em',
          },
        }, eyebrow),
      ),
      el('div', {
        style: {
          fontSize: title.length > 42 ? '64px' : '76px', fontWeight: 600,
          color: C.text, lineHeight: 1.06, letterSpacing: '-0.03em', maxWidth: '900px',
        },
      }, title),
      sub
        ? el('div', {
            style: { fontSize: '30px', fontWeight: 400, color: C.muted, maxWidth: '820px', lineHeight: 1.4 },
          }, sub)
        : el('div', { style: { display: 'flex' } }),
    ),
    // bottom border accent
    el('div', {
      style: {
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10px',
        background: `linear-gradient(90deg, ${C.accent}, ${C.accentSoft} 50%, transparent)`,
      },
    }),
  );

  const svg = await satori(tree as never, { width: W, height: H, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng() as Buffer;
}

/** Build-time downloadable business card — 1080×636 PNG (credit-card ratio). */
export async function renderCardPng(): Promise<Buffer> {
  const CW = 1080;
  const CH = 636;
  const qr = await QRCode.toDataURL('https://shadiul.github.io', {
    margin: 1,
    width: 220,
    errorCorrectionLevel: 'L',
    color: { dark: '#0b0a12', light: '#ffffff' },
  });

  const brand = el(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '13px' } },
    el('div', {
      style: {
        width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: C.accent, boxShadow: `0 0 18px ${C.accent}`,
      },
    }),
    el('div', {
      style: { fontFamily: 'JetBrains Mono', fontSize: '24px', color: C.muted, letterSpacing: '0.06em' },
    }, 'shadiul.github.io'),
  );

  const qrPatch = el(
    'div',
    { style: { display: 'flex', backgroundColor: '#ffffff', padding: '12px', borderRadius: '16px' } },
    el('img', { src: qr, width: 150, height: 150 }),
  );

  const nameBlock = el(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
    el('div', {
      style: { fontSize: '60px', fontWeight: 600, color: C.text, letterSpacing: '-0.02em' },
    }, 'Mohammad Shadiul Huda'),
    el('div', {
      style: { fontFamily: 'JetBrains Mono', fontSize: '26px', color: C.accent },
    }, 'Senior Software Engineer · Frontend Lead'),
    el('div', {
      style: { fontFamily: 'JetBrains Mono', fontSize: '22px', color: C.faint },
    }, 'Mevrik AX Platform · Dhaka, BD'),
  );

  const card = el(
    'div',
    {
      style: {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        width: '100%', height: '100%', padding: '64px 72px',
        borderRadius: '30px', border: `1px solid ${C.border}`,
        backgroundColor: C.card,
        backgroundImage: `linear-gradient(150deg, ${C.card} 52%, #241b38 100%)`,
      },
    },
    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } }, brand, qrPatch),
    nameBlock,
  );

  const tree = el(
    'div',
    { style: { width: '100%', height: '100%', display: 'flex', padding: '28px', backgroundColor: C.ground, fontFamily: 'Inter' } },
    card,
  );

  const svg = await satori(tree as never, { width: CW, height: CH, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: CW } }).render().asPng() as Buffer;
}
