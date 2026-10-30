import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(__dirname, '../public/dhaka_bus_database_v2.json');
const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');

const SITE_URL = 'https://mybusroute.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

const dbData = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
const routes = dbData.buses || dbData.routes || [];

const coreUrls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${SITE_URL}/routes`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_URL}/fare`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${SITE_URL}/privacy`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE_URL}/terms`, priority: '0.5', changefreq: 'monthly' },
];

const busUrls = routes.map((r) => ({
  loc: `${SITE_URL}/routes?bus=${r.id}`,
  priority: '0.7',
  changefreq: 'weekly',
}));

const allUrls = [...coreUrls, ...busUrls];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

for (const entry of allUrls) {
  xml += `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="bn" href="${entry.loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${entry.loc}" />
  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync(sitemapPath, xml, 'utf-8');
console.log(`Successfully generated ${allUrls.length} indexable URLs in public/sitemap.xml`);
