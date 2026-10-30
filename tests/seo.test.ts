import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SEO metadata', () => {
  it('public/sitemap.xml exists and contains valid canonical URLs and hreflang', () => {
    const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(content).toContain('https://mybusroute.vercel.app/</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/routes</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/fare</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/about</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/privacy</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/terms</loc>');
    expect(content).toContain('https://mybusroute.vercel.app/routes?bus=baishakhi</loc>');
    expect(content).toContain('hreflang="bn"');
    expect(content).toContain('hreflang="en"');
  });

  it('public/robots.txt exists and specifies sitemap and AI search engine permissions', () => {
    const robotsPath = path.resolve(__dirname, '../public/robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, 'utf-8');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Sitemap: https://mybusroute.vercel.app/sitemap.xml');
    expect(content).toContain('User-agent: GPTBot');
    expect(content).toContain('User-agent: ClaudeBot');
    expect(content).toContain('User-agent: PerplexityBot');
  });

  it('public/llms.txt and llms-full.txt exist with structured AEO / GEO transit data', () => {
    const llmsPath = path.resolve(__dirname, '../public/llms.txt');
    const llmsFullPath = path.resolve(__dirname, '../public/llms-full.txt');

    expect(fs.existsSync(llmsPath)).toBe(true);
    expect(fs.existsSync(llmsFullPath)).toBe(true);

    const llmsContent = fs.readFileSync(llmsPath, 'utf-8');
    expect(llmsContent).toContain('# BusRoute - Dhaka Bus Route & Fare Finder');
    expect(llmsContent).toContain('Kazi Shakib');
    expect(llmsContent).toContain('2.70 per kilometer');
    expect(llmsContent).toContain('AI Crawler Permissions');

    const fullContent = fs.readFileSync(llmsFullPath, 'utf-8');
    expect(fullContent).toContain('Bangladesh Road Transport Authority (BRTA)');
    expect(fullContent).toContain('Student Half Fare');
  });

  it('index.html contains full Open Graph, Twitter Cards, GEO, and JSON-LD structured data', () => {
    const htmlPath = path.resolve(__dirname, '../index.html');
    const content = fs.readFileSync(htmlPath, 'utf-8');

    // Canonical & hreflang
    expect(content).toContain('rel="canonical" href="https://mybusroute.vercel.app/"');
    expect(content).toContain('hreflang="bn"');
    expect(content).toContain('hreflang="en"');

    // Open Graph
    expect(content).toContain('property="og:type" content="website"');
    expect(content).toContain('property="og:title"');
    expect(content).toContain('property="og:description"');
    expect(content).toContain('property="og:url" content="https://mybusroute.vercel.app/"');
    expect(content).toContain('property="og:image"');

    // Twitter / X
    expect(content).toContain('name="twitter:card" content="summary_large_image"');
    expect(content).toContain('name="twitter:creator" content="@thekazishakib"');

    // Geo tagging (Dhaka)
    expect(content).toContain('name="geo.region" content="BD-13"');
    expect(content).toContain('name="geo.placename" content="Dhaka, Bangladesh"');
    expect(content).toContain('name="geo.position" content="23.8103;90.4125"');

    // JSON-LD Schema & Sitelinks Searchbox
    expect(content).toContain('type="application/ld+json"');
    expect(content).toContain('"@type": "WebApplication"');
    expect(content).toContain('"@type": "WebSite"');
    expect(content).toContain('"@type": "SearchAction"');
    expect(content).toContain('"query-input": "required name=search_term_string"');
    expect(content).toContain('Kazi Shakib');

    // Google verification & semantic crawler prerender
    expect(content).toContain('google-site-verification');
    expect(content).toContain('Prerender / Semantic Crawl Fallback');
  });
});
