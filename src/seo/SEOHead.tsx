import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG } from './config';
import { useT } from '../i18n/useT';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  schemaType?: 'TransitService' | 'FAQPage' | 'WebPage';
  faqItems?: Array<{ question: string; answer: string }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  schemaType = 'TransitService',
  faqItems,
}) => {
  const { lang } = useT();
  const location = useLocation();

  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${currentPath === '/' ? '' : currentPath}`;

  // Determine page meta defaults
  let pageTitle = title;
  let pageDesc = description;

  if (!pageTitle || !pageDesc) {
    if (currentPath === '/') {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.home.titleBn : SEO_CONFIG.pages.home.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.home.descriptionBn : SEO_CONFIG.pages.home.descriptionEn;
    } else if (currentPath.startsWith('/routes')) {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.routes.titleBn : SEO_CONFIG.pages.routes.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.routes.descriptionBn : SEO_CONFIG.pages.routes.descriptionEn;
    } else if (currentPath.startsWith('/fare')) {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.fare.titleBn : SEO_CONFIG.pages.fare.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.fare.descriptionBn : SEO_CONFIG.pages.fare.descriptionEn;
    } else if (currentPath.startsWith('/about')) {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.about.titleBn : SEO_CONFIG.pages.about.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.about.descriptionBn : SEO_CONFIG.pages.about.descriptionEn;
    } else if (currentPath.startsWith('/privacy')) {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.privacy.titleBn : SEO_CONFIG.pages.privacy.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.privacy.descriptionBn : SEO_CONFIG.pages.privacy.descriptionEn;
    } else if (currentPath.startsWith('/terms')) {
      pageTitle = lang === 'bn' ? SEO_CONFIG.pages.terms.titleBn : SEO_CONFIG.pages.terms.titleEn;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.terms.descriptionBn : SEO_CONFIG.pages.terms.descriptionEn;
    } else {
      pageTitle = SEO_CONFIG.siteName;
      pageDesc = lang === 'bn' ? SEO_CONFIG.pages.home.descriptionBn : SEO_CONFIG.pages.home.descriptionEn;
    }
  }

  useEffect(() => {
    document.title = pageTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', pageDesc);
    setMeta('author', SEO_CONFIG.author.name);

    setMeta('geo.region', SEO_CONFIG.geo.region);
    setMeta('geo.placename', SEO_CONFIG.geo.placename);
    setMeta('geo.position', `${SEO_CONFIG.geo.latitude};${SEO_CONFIG.geo.longitude}`);
    setMeta('ICBM', SEO_CONFIG.geo.icbm);

    setMeta('og:title', pageTitle, true);
    setMeta('og:description', pageDesc, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', SEO_CONFIG.siteName, true);
    setMeta('og:locale', lang === 'bn' ? 'bn_BD' : 'en_US', true);
    setMeta('og:image', SEO_CONFIG.social.image, true);

    setMeta('twitter:card', SEO_CONFIG.social.twitterCard);
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDesc);
    setMeta('twitter:image', SEO_CONFIG.social.image);
    setMeta('twitter:creator', SEO_CONFIG.social.twitterHandle);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    const schemaScriptId = 'seo-structured-data';
    let schemaScript = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaScriptId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SEO_CONFIG.siteUrl}/#website`,
          url: SEO_CONFIG.siteUrl,
          name: SEO_CONFIG.siteName,
          description: SEO_CONFIG.pages.home.descriptionEn,
          publisher: {
            '@type': 'Organization',
            name: SEO_CONFIG.organization.name,
            url: SEO_CONFIG.organization.url,
            logo: SEO_CONFIG.organization.logo,
            founder: {
              '@type': 'Person',
              name: SEO_CONFIG.author.name,
              url: SEO_CONFIG.author.url,
            },
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebApplication',
          '@id': `${SEO_CONFIG.siteUrl}/#webapp`,
          name: 'BusRoute Dhaka',
          url: SEO_CONFIG.siteUrl,
          applicationCategory: 'TravelApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BDT',
          },
          creator: {
            '@type': 'Person',
            name: SEO_CONFIG.author.name,
            url: SEO_CONFIG.author.url,
          },
        },
      ],
    };

    if (faqItems && faqItems.length > 0) {
      structuredData['@graph'].push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [pageTitle, pageDesc, canonicalUrl, lang, faqItems]);

  return null;
};

