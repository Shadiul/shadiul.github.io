import type { APIContext } from 'astro';
import { getPosts, formatLong } from '@/lib/blog';
import { renderOgPng, type OgSpec } from '@/lib/og';

/* One OG PNG per page + per blog post, generated at build time.
 * URLs: /og/site.png, /og/projects.png, ..., /og/blog/<post-id>.png */

const PAGES: Record<string, OgSpec> = {
  site: {
    eyebrow: 'shadiul.github.io',
    title: 'I build interfaces and systems that remember.',
    sub: 'Shadiul Huda — Senior Software Engineer · frontend lead · Dhaka, BD',
  },
  projects: {
    eyebrow: 'shadiul.github.io · projects',
    title: "Things I've built",
    sub: 'Systems, interfaces, and experiments — flagship: the Second Brain.',
  },
  blog: {
    eyebrow: 'shadiul.github.io · writing',
    title: 'Notes from building',
    sub: 'Systems that remember, interfaces that stay fast.',
  },
  about: {
    eyebrow: 'shadiul.github.io · about',
    title: "I'm Shadiul — Utso to most people.",
    sub: 'Senior Software Engineer & frontend lead at Mevrik · systems builder by night.',
  },
  uses: {
    eyebrow: 'shadiul.github.io · setup',
    title: 'The tools that survive daily use',
  },
  now: {
    eyebrow: 'shadiul.github.io · currently',
    title: "What I'm focused on now",
  },
};

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    ...Object.entries(PAGES).map(([slug, spec]) => ({ params: { slug }, props: spec })),
    ...posts.map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: {
        eyebrow: `blog · ${post.data.tag}`,
        title: post.data.title,
        sub: formatLong(post.data.date),
      } satisfies OgSpec,
    })),
  ];
}

export async function GET({ props }: APIContext) {
  const png = await renderOgPng(props as OgSpec);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
}
