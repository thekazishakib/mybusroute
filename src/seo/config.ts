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
      titleBn: 'বাসরুট — ঢাকার লোকাল বাসের রুট ও সরকারি ভাড়া অনুসন্ধান',
      titleEn: 'BusRoute — Dhaka City Local Bus Routes & Official Fare Finder',
      descriptionBn: 'ঢাকার ১৮৪টি বাসের রুট, ২৬০টি স্টপেজ এবং বিআরটিএ (BRTA) অনুমোদিত সঠিক বাস ভাড়া এক পলকে জানুন। নির্ভুল ইন্টারচেঞ্জ ও রোড ম্যাপ।',
      descriptionEn: 'Instant Dhaka city local bus route finder with 184 routes, 260 stops, road-accurate route maps, and official BRTA bus fares.',
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
      titleEn: 'Dhaka Bus Fare Guide & Official BRTA Fare Chart — BusRoute',
      descriptionBn: 'বিআরটিএ প্রজ্ঞাপন অনুযায়ী ঢাকা মেট্রোপলিটন এলাকার কিলোমিটার প্রতি বাস ভাড়া (৳২.৪৫/কিমি), সর্বনিম্ন ভাড়া এবং শিক্ষার্থীদের হাফ ভাড়া নীতিমালা।',
      descriptionEn: 'Official Dhaka bus fare rules per BRTA circular: ৳2.45 per km, minimum fare, and student 50% discount policies.',
      path: '/fare',
    },
    about: {
      titleBn: 'আমাদের সম্পর্কে ও ডেভেলপার পরিচিতি — বাসরুট',
      titleEn: 'About BusRoute & Developer Spotlight — BusRoute',
      descriptionBn: 'বাসরুট প্ল্যাটফর্মের লক্ষ্য, সরকারি ডেটা সোর্স (BRTA/DTCA) এবং ডেভেলপার কাজী সাকিব (Kazi Shakib) এর পরিচিতি ও প্রযুক্তিগত বিবরণ।',
      descriptionEn: 'Learn about BusRoute, transit data architecture sourced from BRTA/DTCA, and lead developer Kazi Shakib.',
      path: '/about',
    },
  },
} as const;

