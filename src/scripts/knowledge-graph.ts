/* Initializer for every knowledge-graph canvas on the page.
 * Lives as a real .ts file (not an inline component script): the dev-time
 * react-refresh wrapper in rolldown-vite 500s on Astro's virtual
 * `?astro&type=script` modules ("Missing field moduleType"). */

// The accent color is cached and only recomputed on theme flips —
// reading computed styles inside the rAF loop forces reflows every frame.
let cachedRGB = '124,92,255';
function computePrimaryRGB(): void {
  const el = document.createElement('span');
  el.style.color = 'var(--primary)';
  el.style.display = 'none';
  document.body.appendChild(el);
  cachedRGB = getComputedStyle(el).color.match(/\d+/g)?.slice(0, 3).join(',') ?? cachedRGB;
  el.remove();
}
computePrimaryRGB();
new MutationObserver(computePrimaryRGB).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});

function mkGraph(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const opts = {
    n: Number(canvas.dataset.n),
    sp: Number(canvas.dataset.sp),
    dens: Number(canvas.dataset.dens),
    reach: Number(canvas.dataset.reach),
  };
  let W = 0, H = 0;
  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();

  type Node = { x: number; y: number; vx: number; vy: number; r: number };
  const nodes: Node[] = [];
  const links: [number, number][] = [];
  for (let i = 0; i < opts.n; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * opts.sp, vy: (Math.random() - 0.5) * opts.sp,
      r: 1.6 + Math.random() * 2.6,
    });
  }
  for (let a = 0; a < opts.n; a++)
    for (let b = a + 1; b < opts.n; b++)
      if (Math.random() < opts.dens) links.push([a, b]);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(move: boolean) {
    const cs = cachedRGB;
    ctx!.clearRect(0, 0, W, H);
    if (move) for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    ctx!.lineWidth = 1;
    for (const [a, b] of links) {
      const p = nodes[a]!, q = nodes[b]!;
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < opts.reach) {
        ctx!.strokeStyle = `rgba(${cs},${(0.22 * (1 - d / opts.reach)).toFixed(3)})`;
        ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke();
      }
    }
    for (const n of nodes) {
      ctx!.fillStyle = `rgba(${cs},0.85)`;
      ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, 6.2832); ctx!.fill();
    }
    if (!reduced) requestAnimationFrame(() => draw(true));
  }
  window.addEventListener('resize', size);
  draw(false);
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-graph]').forEach(mkGraph);
