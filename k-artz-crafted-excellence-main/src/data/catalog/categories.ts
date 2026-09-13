import {
  Home,
  Store,
  Building2,
  UtensilsCrossed,
  Scissors,
  Lightbulb,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { Category } from './types';
import { IMAGES } from './images';

/**
 * The eight top-level catalog categories, organised around what a customer
 * needs rather than around materials or manufacturing technique.
 */
export const categories: Category[] = [
  {
    slug: 'home-name-plates',
    name: 'Home & Name Plates',
    shortName: 'Home',
    tagline: 'Name plates for homes, flats, villas and societies.',
    description:
      'Name plates that give your home an entrance worth noticing — from clean acrylic and engraved steel to backlit LED and wood-finish designs, made to your family name, door size and wall.',
    icon: Home,
    image: IMAGES.residenceMetalPlate,
    imageIsPlaceholder: false,
    bannerImage: '/background_banner/nameplate_banner.webp',
    order: 1,
  },
  {
    slug: 'shop-signage',
    name: 'Shop Signage',
    shortName: 'Shop',
    tagline: 'Shop boards and storefront signage that pull customers in.',
    description:
      'Storefront signage built to be seen from across the road and to survive the weather — LED shop boards, 3D letters, glow signs and ACP-backed panels, sized to your shopfront.',
    icon: Store,
    image: IMAGES.ledShopBoard,
    imageIsPlaceholder: false,
    bannerImage: '/background_banner/shop_banner.webp',
    hidePlaceholderProducts: true,
    order: 2,
  },
  {
    slug: 'office-corporate',
    name: 'Office & Corporate',
    shortName: 'Office',
    tagline: 'Reception logos, cabin plates and workplace wayfinding.',
    description:
      'Signage that makes an office read as organised and professional — reception logo walls, company name boards, cabin and department plates, and a wayfinding set that matches throughout the floor.',
    icon: Building2,
    image: IMAGES.archFrontlitLetters,
    imageIsPlaceholder: false,
    bannerImage: '/background_banner/office_banner.webp',
    order: 3,
  },
  {
    slug: 'restaurant-cafe',
    name: 'Restaurant & Cafe',
    shortName: 'Restaurant',
    tagline: 'Menu boards, wall logos and signage with atmosphere.',
    description:
      'Signage for places people sit down in — illuminated menu boards, wall logos, table numbers, QR stands and photo-wall pieces that suit the light and mood of your space.',
    icon: UtensilsCrossed,
    image: IMAGES.placeholder,
    imageIsPlaceholder: true,
    bannerImage: '/background_banner/resto_banner.webp',
    order: 4,
  },
  {
    slug: 'salon-boutique',
    name: 'Salon & Boutique',
    shortName: 'Salon',
    tagline: 'Elegant signage for salons, studios and boutiques.',
    description:
      'Softly lit, finish-conscious signage for salons, beauty studios and boutiques — logo walls, LED name boards, reception pieces and offer displays that read premium rather than loud.',
    icon: Scissors,
    image: IMAGES.placeholder,
    imageIsPlaceholder: true,
    bannerImage: '/background_banner/salon_banner.webp',
    order: 5,
  },
  {
    slug: 'led-illuminated-signs',
    name: 'LED & Illuminated Signs',
    shortName: 'LED',
    tagline: 'Backlit, frontlit and neon-style illuminated signage.',
    description:
      'Everything that lights up — backlit halo letters, frontlit acrylic faces, edge-lit panels and neon-style flex. Energy-efficient modules, weather-rated for outdoor use, wired and installed by us.',
    icon: Lightbulb,
    image: IMAGES.neonScriptSign,
    imageIsPlaceholder: false,
    order: 6,
  },
  {
    slug: 'acrylic-products',
    name: 'Acrylic Products',
    shortName: 'Acrylic',
    tagline: 'Laser-cut acrylic name plates, logos, letters and panels.',
    description:
      'Precision laser-cut and hand-finished acrylic in clear, frosted, mirror and solid colours — name plates, logos, letters, door plates and wall panels, with or without illumination.',
    icon: Layers,
    image: IMAGES.designerAcrylicPlate,
    imageIsPlaceholder: false,
    order: 7,
  },
  {
    slug: 'custom-signs',
    name: 'Custom Signs',
    shortName: 'Custom',
    tagline: 'Bring your own design, or we design it with you.',
    description:
      "Anything not covered by a standard product. Send a sketch, a reference photo or just a description of the space, and we'll work out the material, size and lighting with you before we build it.",
    icon: Sparkles,
    image: IMAGES.acp3dLetterBoard,
    imageIsPlaceholder: false,
    order: 8,
  },
];
