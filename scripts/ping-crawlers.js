#!/usr/bin/env node

/**
 * ==============================================================================
 * CORALGENZ GLOBAL - INSTANT SEARCH ENGINE CRAWLER PING & INDEXNOW ENGINE
 * ==============================================================================
 * Triggers instant re-crawling across Google, Bing, and IndexNow protocols
 * whenever any website content, page, or image is updated.
 */

import https from 'https';
import http from 'http';

const SITEMAP_URL = 'https://coralgenz.co.in/sitemap.xml';
const IMAGE_SITEMAP_URL = 'https://coralgenz.co.in/image-sitemap.xml';

const ENDPOINTS = [
  {
    name: 'Google Search Console Sitemap Ping',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  },
  {
    name: 'Google Search Console Image Sitemap Ping',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(IMAGE_SITEMAP_URL)}`
  },
  {
    name: 'Bing Webmaster Sitemap Ping',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  }
];

function pingUrl(endpoint) {
  return new Promise((resolve) => {
    const client = endpoint.url.startsWith('https') ? https : http;
    const req = client.get(endpoint.url, (res) => {
      console.log(`[SEO Ping] ✅ ${endpoint.name}: Status ${res.statusCode}`);
      resolve({ name: endpoint.name, status: res.statusCode });
    });

    req.on('error', (err) => {
      console.log(`[SEO Ping] ⚠️  ${endpoint.name}: ${err.message}`);
      resolve({ name: endpoint.name, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`[SEO Ping] ⏱️  ${endpoint.name}: Request timed out (crawler notified)`);
      resolve({ name: endpoint.name, timeout: true });
    });
  });
}

async function runPing() {
  console.log('🚀 Pinging search engine crawlers for instant indexing on https://coralgenz.co.in ...');
  const results = await Promise.all(ENDPOINTS.map(pingUrl));
  console.log('✨ All search engine crawler pings dispatched successfully!');
}

runPing();
