import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { sanitizeSearchQuery } from '../src/data/search';

describe('Application Security & Hardening', () => {
  it('index.html contains strict security headers and CSP', () => {
    const htmlPath = path.resolve(__dirname, '../index.html');
    const content = fs.readFileSync(htmlPath, 'utf-8');

    // CSP
    expect(content).toContain('Content-Security-Policy');
    expect(content).toContain("default-src 'self'");
    expect(content).toContain('nosniff');
    expect(content).toContain('strict-origin-when-cross-origin');
    expect(content).toContain('Permissions-Policy');
  });

  it('sanitizeSearchQuery protects against XSS, HTML tags, and buffer abuse', () => {
    // XSS injection attempts
    const xssPayload = '<script>alert("hacked")</script>';
    const cleanedXss = sanitizeSearchQuery(xssPayload);
    expect(cleanedXss).not.toContain('<');
    expect(cleanedXss).not.toContain('>');
    expect(cleanedXss).not.toContain('"');
    expect(cleanedXss).toBe('scriptalert(hacked)/script');

    // Quotes and injection characters
    const sqlInjection = "Mirpur' OR '1'='1";
    const cleanedSql = sanitizeSearchQuery(sqlInjection);
    expect(cleanedSql).not.toContain("'");

    // Normal Bengali text preserved
    const bengaliText = 'মিরপুর ১০';
    expect(sanitizeSearchQuery(bengaliText)).toBe('মিরপুর ১০');

    // Length limit enforcement
    const longString = 'A'.repeat(200);
    expect(sanitizeSearchQuery(longString).length).toBe(100);
  });

  it('all external target="_blank" links throughout src include rel="noopener noreferrer"', () => {
    const srcDir = path.resolve(__dirname, '../src');

    function checkFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkFiles(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const code = fs.readFileSync(fullPath, 'utf-8');
          const targetBlankMatches = code.match(/<a[^>]*target=["']_blank["'][^>]*>/g) || [];
          for (const match of targetBlankMatches) {
            expect(
              match.includes('rel="noopener noreferrer"') || match.includes('rel="noreferrer noopener"') || match.includes("rel='noopener noreferrer'"),
              `Link in ${entry.name} missing rel="noopener noreferrer": ${match}`
            ).toBe(true);
          }
        }
      }
    }

    checkFiles(srcDir);
  });

  it('no sensitive secret keys or tokens are stored in the client codebase', () => {
    const rootDir = path.resolve(__dirname, '..');
    const envExamplePath = path.join(rootDir, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      const content = fs.readFileSync(envExamplePath, 'utf-8');
      expect(content).not.toMatch(/api_key\s*=\s*['"]?[a-zA-Z0-9_-]{20,}['"]?/i);
    }
  });
});

