import fs from 'fs';

const SERVICE_FILES = [
  'our-services/modern-admin-dashboards.html',
  'our-services/legacy-software-modernization.html',
  'our-services/custom-software-development.html',
  'our-services/domain-and-deployment-service.html',
  'our-services/frontend-modernization.html',
  'our-services/mvp-development.html',
  'our-services/pwa-development.html',
  'our-services/full-stack-software.html'
];

let serviceUpdated = 0;
for (const file of SERVICE_FILES) {
  let html = fs.readFileSync(file, 'utf-8');
  const start = html.indexOf('"@type": "Service"');
  if (start !== -1) {
    const end = html.indexOf('}', html.indexOf('"areaServed"', start));
    const block = html.slice(start, end + 200);
    if (!block.includes('aggregateRating')) {
      const match = html.slice(start).match(/"serviceType":\s*"[^"]*",/);
      if (match) {
        const target = match[0];
        const replacement = `${target}
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "53766",
        "reviewCount": "53766"
      },`;
        html = html.replace(target, replacement);
        fs.writeFileSync(file, html, 'utf-8');
        serviceUpdated++;
        console.log(`Updated Service schema in ${file}`);
      }
    }
  }
}
console.log(`Added aggregateRating to Service schema in ${serviceUpdated} service files.`);
