import { useEffect } from 'react';
import { BUSINESS } from '@/config/business';

/**
 * Per-route SEO for this SPA.
 *
 * The app is a Vite SPA with a single static index.html, so every route would
 * otherwise report the same title and description. This hook sets the title,
 * description, canonical URL, Open Graph / Twitter tags and optional JSON-LD
 * structured data on mount, and restores whatever was there on unmount.
 *
 * Deliberately dependency-free — no react-helmet, no extra bundle weight.
 *
 * Note: crawlers that do not execute JavaScript will still only see the static
 * index.html. If organic search becomes a priority, prerendering or SSR is the
 * next step; this hook covers everything achievable client-side.
 */

interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/catalog/led-name-plates". Combined with the site origin. */
  path?: string;
  /** Absolute or root-relative image URL for social previews. */
  image?: string;
  /** schema.org structured data, serialised into a JSON-LD <script>. */
  jsonLd?: Record<string, unknown>;
}

const JSON_LD_ID = 'kartz-route-jsonld';

const upsertMeta = (
  selector: string,
  attr: 'name' | 'property',
  key: string,
  content: string,
): (() => void) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  const created = !element;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  const previous = element.getAttribute('content');
  element.setAttribute('content', content);

  return () => {
    if (created) {
      element?.remove();
    } else if (previous !== null) {
      element?.setAttribute('content', previous);
    }
  };
};

const upsertCanonical = (href: string): (() => void) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const created = !link;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  const previous = link.getAttribute('href');
  link.setAttribute('href', href);

  return () => {
    if (created) {
      link?.remove();
    } else if (previous !== null) {
      link?.setAttribute('href', previous);
    }
  };
};

export const useSeo = ({ title, description, path, image, jsonLd }: SeoOptions): void => {
  // Call sites pass an inline object literal, which would be a new reference on
  // every render. Comparing the serialised form keeps the effect stable.
  const serialisedJsonLd = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const url = path ? `${BUSINESS.site}${path}` : BUSINESS.site;
    const absoluteImage = image
      ? image.startsWith('http')
        ? image
        : `${BUSINESS.site}${image}`
      : undefined;

    const cleanups: Array<() => void> = [
      upsertMeta('meta[name="description"]', 'name', 'description', description),
      upsertMeta('meta[property="og:title"]', 'property', 'og:title', title),
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description),
      upsertMeta('meta[property="og:url"]', 'property', 'og:url', url),
      upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title),
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description),
      upsertCanonical(url),
    ];

    if (absoluteImage) {
      cleanups.push(
        upsertMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage),
        upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage),
      );
    }

    let script: HTMLScriptElement | null = null;
    if (serialisedJsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = JSON_LD_ID;
      script.textContent = serialisedJsonLd;
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      cleanups.forEach((restore) => restore());
      script?.remove();
    };
  }, [title, description, path, image, serialisedJsonLd]);
};
