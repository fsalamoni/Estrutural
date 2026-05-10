import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const PUBLIC_SITEMAP_ROUTES = [
  {
    path: '',
    changeFrequency: 'weekly',
    priority: 1,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_ROUTES.map(({ path, ...route }) => ({
    url: `${SITE_URL}${path}`,
    ...route,
  }));
}
