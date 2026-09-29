import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlFiles = [];
function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) scan(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
}
scan(rootDir);

console.log(`Auditing and fixing ${htmlFiles.length} HTML files...`);

// High-impact meta description overrides
const customDescriptions = {
  'our-highlights.html': 'Discover enterprise engineering breakthroughs, cloud compilers, telemetry systems, and the proprietary .secure format invented by Coralgenz Global.',
  'our-products.html': "Explore Coralgenz Global's proprietary software suite: Coralgenz Vault (.secure encrypted storage), Cloud Compiler IDE, and Smart QR Telemetry platform.",
  'our-services.html': 'Comprehensive software engineering services: custom software development, modern web app engineering, MVP prototyping, PWAs, and legacy modernization.',
  'our-highlights/clean-architecture-standards.html': 'Explore Clean Architecture and Domain-Driven Design standards implemented by Coralgenz Global for high-performance, maintainable enterprise software.',
  'privacy-policy.html': 'Official Corporate Privacy Policy of Coralgenz Global. Detailed data governance standards, user rights, zero-knowledge privacy, and compliance framework.',
  'coralgenz-vault-security.html': 'Architectural breakdown of Coralgenz Vault and the proprietary .secure format invented by Coralgenz Global, featuring 16-layer V10 zero-knowledge encryption.'
};

for (const file of htmlFiles) {
  const relFile = path.relative(rootDir, file).replace(/\\/g, '/');
  const is404 = relFile === '404.html';
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  let cleanRoute = '/' + relFile;
  if (cleanRoute.endsWith('index.html')) cleanRoute = cleanRoute.replace('index.html', '');
  else cleanRoute = cleanRoute.replace(/\.html$/, '');
  if (cleanRoute.length > 1 && cleanRoute.endsWith('/')) cleanRoute = cleanRoute.slice(0, -1);

  const canonicalUrl = `https://coralgenz.co.in${cleanRoute === '/' ? '/' : cleanRoute}`;

  // 1. Update Custom Descriptions if specified
  if (customDescriptions[relFile]) {
    const newDesc = customDescriptions[relFile];
    if (content.match(/<meta[^>]+name=["']description["']/i)) {
      content = content.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']/i, `<meta name="description" content="${newDesc}">`);
    } else {
      content = content.replace(/<title>([^<]*)<\/title>/i, `<title>$1</title>\n  <meta name="description" content="${newDesc}">`);
    }
    modified = true;
  }

  // 2. Ensure comprehensive robots & googlebot meta tags on content pages
  if (!is404) {
    if (!content.includes('name="googlebot"')) {
      content = content.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n  <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`);
      modified = true;
    }
  }

  // 3. Ensure OpenGraph og:site_name & Twitter Cards
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const currentTitle = titleMatch ? titleMatch[1].trim() : 'Coralgenz Global';
  const descMatch = content.match(/<meta[^>]+name=["']description["']\s+content=["']([^"']*)["']/i);
  const currentDesc = descMatch ? descMatch[1].trim() : 'Coralgenz Global - Enterprise IT & Software Engineering';

  let defaultImage = 'https://coralgenz.co.in/assets/images/DVyu6tz4dqPirA4TwAJZUz5CUw.png';
  if (relFile.includes('vault') || relFile.includes('secure-format')) {
    defaultImage = 'https://coralgenz.co.in/assets/images/secure-format-showcase.jpg';
  } else if (relFile.includes('compiler')) {
    defaultImage = 'https://coralgenz.co.in/assets/images/kmUbbqN7jwVRUVuglgbqRYXOtY.png';
  } else if (relFile.includes('qr')) {
    defaultImage = 'https://coralgenz.co.in/assets/images/keurnaCtookRPkuKPv04gdjnYl0.png';
  }

  if (!is404 && !content.includes('twitter:card')) {
    const twitterTags = `\n  <!-- Twitter Card -->\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:url" content="${canonicalUrl}">\n  <meta name="twitter:title" content="${currentTitle}">\n  <meta name="twitter:description" content="${currentDesc}">\n  <meta name="twitter:image" content="${defaultImage}">`;
    content = content.replace(/<\/head>/i, `${twitterTags}\n</head>`);
    modified = true;
  }

  if (!is404 && !content.includes('property="og:site_name"')) {
    content = content.replace(/<meta\s+property=["']og:title["']/i, `<meta property="og:site_name" content="Coralgenz Global">\n  <meta property="og:title"`);
    modified = true;
  }

  // 4. Fix empty href="#" in index.html or elsewhere
  if (content.includes('href="#" onclick="openCourseStatusModal(event)"')) {
    content = content.replace('href="#" onclick="openCourseStatusModal(event)"', 'href="javascript:void(0)" role="button" aria-label="Check Internship Status" onclick="openCourseStatusModal(event)"');
    modified = true;
  }

  // 5. Image performance attributes: add loading="lazy" and decoding="async" where missing
  const imgRegex = /<img\s+([^>]*?)>/gi;
  content = content.replace(imgRegex, (full, attrs) => {
    let newAttrs = attrs;
    // Don't add lazy loading to brand logos in nav or hero images with class containing hero/brand
    const isHeroOrLogo = /brand-logo|hero-img|preload|eager/i.test(attrs);
    if (!newAttrs.includes('loading=') && !isHeroOrLogo) {
      newAttrs += ' loading="lazy"';
      modified = true;
    } else if (!newAttrs.includes('loading=') && isHeroOrLogo) {
      newAttrs += ' loading="eager" fetchpriority="high"';
      modified = true;
    }
    if (!newAttrs.includes('decoding=')) {
      newAttrs += ' decoding="async"';
      modified = true;
    }
    return `<img ${newAttrs}>`;
  });

  // 6. Add BreadcrumbList to coralgenz-vault-privacy.html if missing
  if (relFile === 'coralgenz-vault-privacy.html' && !content.includes('BreadcrumbList')) {
    const breadcrumbSchema = `      {
        "@type": "BreadcrumbList",
        "@id": "https://coralgenz.co.in/coralgenz-vault-privacy#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://coralgenz.co.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Privacy Policy",
            "item": "https://coralgenz.co.in/privacy-policy"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Coralgenz Vault Zero-Knowledge Privacy Architecture",
            "item": "https://coralgenz.co.in/coralgenz-vault-privacy"
          }
        ]
      },`;
    content = content.replace('"@graph": [', `"@graph": [\n${breadcrumbSchema}`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Optimized SEO on: ${relFile}`);
  }
}

// 7. Update robots.txt
const robotsContent = `# ==============================================================================
# CORALGENZ GLOBAL - SEARCH ENGINE CRAWLER DIRECTIVES
# 100% Valid Search Engine Directives for Instant Indexing & Image Crawling
# ==============================================================================

User-agent: *
Allow: /
Allow: /assets/
Allow: /assets/images/
Allow: /assets/css/
Allow: /assets/js/
Allow: /our-services/
Allow: /our-highlights/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /dist/

# Googlebot
User-agent: Googlebot
Allow: /
Allow: /assets/
Allow: /assets/images/
Allow: /*.js$
Allow: /*.css$

# Googlebot-Image
User-agent: Googlebot-Image
Allow: /assets/images/
Allow: /

# Bingbot
User-agent: Bingbot
Allow: /
Allow: /assets/

# Applebot & Twitterbot & Social Crawlers
User-agent: Applebot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# XML Sitemaps
Sitemap: https://coralgenz.co.in/sitemap.xml
Sitemap: https://coralgenz.co.in/image-sitemap.xml
`;
fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsContent, 'utf8');
console.log('✅ Updated robots.txt with standardized crawler directives');

// 8. Update sitemap.xml timestamps
let sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
sitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod>2026-09-29</lastmod>');
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('✅ Updated sitemap.xml lastmod timestamps to 2026-09-29');

console.log('\nAll SEO Master Fixes Completed Successfully!');
