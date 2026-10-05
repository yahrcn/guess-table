/**
 * index.html's og:image/twitter:image are relative paths (we don't know the deployed
 * domain at build time) — resolve them to absolute URLs here instead of hardcoding one.
 * Also sets og:url/canonical to the actual current URL, so sharing a room link previews
 * that room's URL rather than always the homepage.
 */
export function absolutizeSeoTags(): void {
  const origin = window.location.origin;

  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const tag = document.querySelector(selector);
    const content = tag?.getAttribute('content');
    if (tag && content && content.startsWith('/')) {
      tag.setAttribute('content', origin + content);
    }
  }

  const ogUrlTag = document.querySelector('meta[property="og:url"]');
  if (ogUrlTag) {
    ogUrlTag.setAttribute('content', window.location.href);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:url');
    meta.setAttribute('content', window.location.href);
    document.head.appendChild(meta);
  }

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.href);
}
