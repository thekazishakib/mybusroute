/**
 * Central SEO configuration for Dhaka Bus Route & Fare Finder
 */

export const SEO_CONFIG = {
  siteName: 'BusRoute | বাসরুট',
  siteNameBn: 'বাসরুট — ঢাকা বাস রুট ও ভাড়া ফাইন্ডার',
  siteNameEn: 'BusRoute — Dhaka City Local Bus Route & Fare Finder',
  siteUrl: 'https://mybusroute.vercel.app',
  author: {
    name: 'Kazi Shakib',
    url: 'https://www.kazishakib.com',
    github: 'https://github.com/thekazishakib',
    linkedin: 'https://bd.linkedin.com/in/kazishakib',
    role: 'Lead Developer & Architect',
  },
  organization: {
    name: 'BusRoute BD',
    url: 'https://mybusroute.vercel.app',
    logo: 'https://mybusroute.vercel.app/logo.png',
    foundingYear: 2026,
    dataSources: [
      'Bangladesh Road Transport Authority (BRTA)',
      'Dhaka Transport Coordination Authority (DTCA)',
    ],
  },
  geo: {
    region: 'BD-13',
    placename: 'Dhaka, Bangladesh',
    latitude: 23.8103,
    longitude: 90.4125,
    icbm: '23.8103, 90.4125',
  },
  social: {
    twitterHandle: '@thekazishakib',
    twitterCard: 'summary_large_image',
    image: 'https://mybusroute.vercel.app/hero-bus.png',
  },
  pages: {
    home: {
      titleBn: 'বাসরুট — ঢাকার লোকাল বাসের রুট ও আনুমানিক ভাড়া অনুসন্ধান',
      titleEn: 'BusRoute — Dhaka City Local Bus Routes & Fare Finder',
      descriptionBn: 'ঢাকার ১৮৪টি বাসের রুট, ২৬০টি স্টপেজ এবং বিআরটিএ প্রজ্ঞাপন অনুযায়ী আনুমানিক বাস ভাড়া জানুন। নির্ভুল ইন্টারচেঞ্জ ও রোড ম্যাপ।',
      descriptionEn: 'Instant Dhaka city local bus route finder with 184 routes, 260 stops, road-accurate route maps, and estimated fares based on BRTA rates.',
      path: '/',
    },
    routes: {
      titleBn: 'সকল বাস ও রুট তালিকা — বাসরুট ঢাকা',
      titleEn: 'All Buses & Routes Directory — BusRoute Dhaka',
      descriptionBn: 'ঢাকার সকল সক্রিয় লোকাল বাস সার্ভিসের পূর্ণাঙ্গ তালিকা, প্রারম্ভিক ও শেষ স্টপেজ, মধ্যবর্তী স্টপ ও ভাড়ার তথ্য।',
      descriptionEn: 'Complete directory of Dhaka city local bus services with detailed stoppage lists, start/end terminals, and fare guidelines.',
      path: '/routes',
    },
    fare: {
      titleBn: 'ঢাকা বাস ভাড়া নির্দেশিকা ও বিআরটিএ চার্ট — বাসরুট',
      titleEn: 'Dhaka Bus Fare Guide & BRTA Circular Chart — BusRoute',
      descriptionBn: 'বিআরটিএ প্রজ্ঞাপন অনুযায়ী ঢাকা মেট্রোপলিটন এলাকার কিলোমিটার প্রতি বাস ভাড়া (৳২.৭০/কিমি), সর্বনিম্ন ভাড়া এবং শিক্ষার্থীদের হাফ ভাড়া নির্দেশিকা।',
      descriptionEn: 'Dhaka bus fare guidelines based on BRTA circular: ৳2.70 per km, minimum fare, and student 50% discount policies.',
      path: '/fare',
    },
    about: {
      titleBn: 'আমাদের সম্পর্কে ও ডেভেলপার পরিচিতি — বাসরুট',
      titleEn: 'About BusRoute & Developer Spotlight — BusRoute',
      descriptionBn: 'বাসরুট প্ল্যাটফর্মের লক্ষ্য, সরকারি ডেটা সোর্স (BRTA/DTCA) এবং ডেভেলপার কাজী সাকিব (Kazi Shakib) এর পরিচিতি ও প্রযুক্তিগত বিবরণ।',
      descriptionEn: 'Learn about BusRoute, transit data architecture sourced from BRTA/DTCA, and lead developer Kazi Shakib.',
      path: '/about',
    },
    privacy: {
      titleBn: 'গোপনীয়তা নীতি (Privacy Policy) — বাসরুট',
      titleEn: 'Privacy Policy — BusRoute Dhaka',
      descriptionBn: 'বাসরুট প্ল্যাটফর্মের গোপনীয়তা নীতি, ডেটা সুরক্ষা এবং ব্যবহারকারীর তথ্যের নিরাপত্তা সংক্রান্ত নীতিমালা।',
      descriptionEn: 'BusRoute Dhaka privacy policy, data practices, local storage usage, and user protection standards.',
      path: '/privacy',
    },
    terms: {
      titleBn: 'শর্তাবলী ও ডিসক্লেইমার (Terms & Disclaimer) — বাসরুট',
      titleEn: 'Terms of Service & Transit Disclaimer — BusRoute',
      descriptionBn: 'বাসরুট ব্যবহারের নিয়মাবলী, বিআরটিএ সরকারি ভাড়ার ডিসক্লেইমার এবং স্বাধীন পাবলিক ট্রানজিট সহায়িকা নীতিমালা।',
      descriptionEn: 'BusRoute terms of use, BRTA transit fare disclaimer, limitations of liability, and service conditions.',
      path: '/terms',
    },
  },
} as const;

