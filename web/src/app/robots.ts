import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/*/panier', '/*/compte', '/*/suivi', '/*/recherche'] },
    sitemap: `${site}/sitemap.xml`
  };
}
