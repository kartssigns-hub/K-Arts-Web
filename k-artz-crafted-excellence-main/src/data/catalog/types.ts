import type { LucideIcon } from 'lucide-react';

/**
 * Catalog domain types.
 *
 * The catalog is data-driven on purpose: adding a product should mean appending
 * one object to `products.ts`, never editing a component.
 */

export type CategorySlug =
  | 'home-name-plates'
  | 'shop-signage'
  | 'office-corporate'
  | 'restaurant-cafe'
  | 'salon-boutique'
  | 'led-illuminated-signs'
  | 'acrylic-products'
  | 'custom-signs';

export interface Category {
  slug: CategorySlug;
  /** Full name, used as the category page <h1>. */
  name: string;
  /** Short label for nav chips and compact cards. */
  shortName: string;
  /** One line shown on the homepage teaser card. */
  tagline: string;
  /** Paragraph shown on the category page and in its meta description. */
  description: string;
  icon: LucideIcon;
  image: string;
  /** True when `image` is a stand-in the owner should replace. */
  imageIsPlaceholder: boolean;
  /**
   * Wide artwork shown behind the category page header. Optional — categories
   * without one fall back to the plain background.
   */
  bannerImage?: string;
  /**
   * Leave products still on the placeholder image out of this category's
   * listing (and its count). They stay reachable by URL and in other categories.
   */
  hidePlaceholderProducts?: boolean;
  /** Display order across the site. */
  order: number;
}

export interface Product {
  id: string;
  /**
   * URL slug. Must be unique across BOTH categories and products, since they
   * share the /catalog/:slug namespace. Enforced at runtime in development —
   * see assertUniqueSlugs() in ./index.ts
   */
  slug: string;
  name: string;
  /** The product's home category — determines its breadcrumb. */
  categorySlug: CategorySlug;
  /**
   * Additional categories this product should also appear under. Lets one
   * product be listed in several places (an acrylic name plate belongs to both
   * "Home & Name Plates" and "Acrylic Products") without duplicating it.
   */
  alsoIn?: CategorySlug[];
  /** One line, shown on the product card. Keep under ~90 characters. */
  shortDescription: string;
  /** Paragraph, shown on the product detail page. */
  description: string;
  materials: string[];
  /** Size guidance. Custom sizing is the norm, so these are common formats. */
  sizes: string[];
  customization: string[];
  installation: boolean;
  image: string;
  gallery: string[];
  /** Free-text keywords that feed catalog search. */
  tags: string[];
  /** Surfaces the product in "Popular Designs" on the homepage. */
  featured: boolean;
  /**
   * Intentionally unset for every product right now — the business does not
   * publish prices. Populate per product to switch pricing on; the UI already
   * renders it when present and falls back to "Price on Request" when absent.
   */
  startingPrice?: number;
  /** True when `image`/`gallery` are stand-ins the owner should replace. */
  imageIsPlaceholder: boolean;
}
