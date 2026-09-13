import type { CategorySlug, Product } from './types';
import { IMAGES } from './images';

/**
 * ─── HOW TO ADD A PRODUCT ──────────────────────────────────────────────────
 * Append one object to the `products` array below. Only `slug`, `name`,
 * `categorySlug`, `shortDescription`, `description` and `materials` are
 * required; everything else has a sensible default.
 *
 *   {
 *     slug: 'brass-name-plates',          // must be unique across the catalog
 *     name: 'Brass Name Plates',
 *     categorySlug: 'home-name-plates',
 *     shortDescription: 'Engraved solid brass with a polished finish.',
 *     description: 'Longer paragraph for the product page…',
 *     materials: ['Solid brass', 'Engraved lettering'],
 *     image: IMAGES.namePlateBrass,       // omit to use the placeholder
 *     featured: true,                     // shows it in "Popular Designs"
 *   }
 *
 * No component, route or page needs editing. `imageIsPlaceholder` is derived
 * automatically, and a duplicate slug throws in development.
 *
 * Pricing: `startingPrice` is deliberately unset on every product — the
 * business does not publish prices, so the UI shows "Price on Request". Set it
 * on a product to display a figure there instead.
 * ───────────────────────────────────────────────────────────────────────────
 */

interface ProductSeed {
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  alsoIn?: CategorySlug[];
  shortDescription: string;
  description: string;
  materials: string[];
  customization?: string[];
  sizes?: string[];
  tags?: string[];
  image?: string;
  gallery?: string[];
  featured?: boolean;
  installation?: boolean;
  startingPrice?: number;
}

const DEFAULT_SIZES = ['Made to order — any size', 'Common sizes available'];

const DEFAULT_CUSTOMIZATION = [
  'Your name, text or logo',
  'Choice of colour and finish',
  'Font selection',
  'Custom size',
];

/** Fills defaults so each entry above stays short and hard to get wrong. */
const defineProduct = (seed: ProductSeed): Product => {
  const image = seed.image ?? IMAGES.placeholder;
  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    categorySlug: seed.categorySlug,
    alsoIn: seed.alsoIn,
    shortDescription: seed.shortDescription,
    description: seed.description,
    materials: seed.materials,
    customization: seed.customization ?? DEFAULT_CUSTOMIZATION,
    sizes: seed.sizes ?? DEFAULT_SIZES,
    tags: seed.tags ?? [],
    image,
    gallery: seed.gallery ?? [],
    featured: seed.featured ?? false,
    installation: seed.installation ?? true,
    startingPrice: seed.startingPrice,
    imageIsPlaceholder: image === IMAGES.placeholder,
  };
};

const seeds: ProductSeed[] = [
  // ───────────────────────────── HOME & NAME PLATES ─────────────────────────
  {
    slug: 'acrylic-name-plates',
    name: 'Acrylic Name Plates',
    categorySlug: 'home-name-plates',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Laser-cut acrylic with clean, modern lettering.',
    description:
      'A clean, contemporary name plate cut from cast acrylic and finished by hand. Available in clear, frosted, black, white and solid colours, with lettering either engraved into the surface or raised off it. Suits flat doors, brick and textured walls alike.',
    materials: ['Cast acrylic', 'Laser-cut lettering', 'Stainless steel standoffs'],
    tags: ['acrylic', 'name plate', 'home', 'door', 'modern'],
    image: IMAGES.designerAcrylicPlate,
    featured: true,
  },
  {
    slug: 'led-name-plates',
    name: 'LED Name Plates',
    categorySlug: 'home-name-plates',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Softly illuminated name plates that stay readable after dark.',
    description:
      'A name plate with warm LED illumination built in, so your name is legible from the gate at night. Low-wattage modules run cool and draw very little power, and the wiring is concealed behind the plate during installation.',
    materials: ['Acrylic face', 'Warm/cool white LED modules', 'Powder-coated backing'],
    customization: [
      'Your name, text or logo',
      'Warm or cool white lighting',
      'Choice of colour and finish',
      'Custom size',
    ],
    tags: ['led', 'illuminated', 'name plate', 'home', 'backlit', 'night'],
    image: IMAGES.backlitAcrylicPlate,
    featured: true,
  },
  {
    slug: '3d-acrylic-name-plates',
    name: '3D Acrylic Name Plates',
    categorySlug: 'home-name-plates',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Raised letters that stand off the plate for real depth.',
    description:
      'Individually cut acrylic letters mounted above the base plate so they cast a genuine shadow. The depth reads well in daylight and gives the plate a crafted, dimensional look rather than a printed one.',
    materials: ['Layered cast acrylic', 'Raised letter mounting'],
    tags: ['3d', 'acrylic', 'name plate', 'raised', 'letters'],
    image: IMAGES.designerAcrylicPlate,
  },
  {
    slug: 'premium-designer-name-plates',
    name: 'Premium Designer Name Plates',
    categorySlug: 'home-name-plates',
    shortDescription: 'Mixed-material designs for a distinctive entrance.',
    description:
      'Our design-led range, combining materials and finishes — brushed metal against acrylic, engraved detail, decorative borders or motifs. Designed with you rather than picked from a sheet, for entrances that deserve something considered.',
    materials: ['Mixed metals', 'Cast acrylic', 'Engraved detailing'],
    customization: [
      'Bespoke design developed with you',
      'Decorative motifs and borders',
      'Mixed material and finish combinations',
      'Custom size',
    ],
    tags: ['premium', 'designer', 'name plate', 'luxury', 'bespoke'],
    image: IMAGES.motifGoldPlate,
  },
  {
    slug: 'backlit-name-plates',
    name: 'Backlit Name Plates',
    categorySlug: 'home-name-plates',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'A halo of light behind the letters for a premium glow.',
    description:
      'Letters mounted forward of the wall with LEDs concealed behind them, throwing a soft halo of light onto the surface. The light source itself stays hidden, which is what gives backlit signage its understated, high-end look.',
    materials: ['Acrylic or metal letters', 'Concealed LED modules', 'Standoff mounts'],
    tags: ['backlit', 'halo', 'led', 'name plate', 'premium'],
    image: IMAGES.haloLitDoorPlate,
  },
  {
    slug: 'wooden-finish-name-plates',
    name: 'Wooden Finish Name Plates',
    categorySlug: 'home-name-plates',
    shortDescription: 'Warm wood tones for traditional and rustic entrances.',
    description:
      'Natural wood grain or a weather-resistant wood-finish laminate, paired with engraved or raised lettering. Suits traditional homes, wooden doors and interiors where metal and acrylic would feel too cold.',
    materials: ['Seasoned wood or wood-finish laminate', 'Engraved or raised lettering'],
    tags: ['wooden', 'wood', 'rustic', 'traditional', 'name plate'],
    image: IMAGES.woodGrainPlate,
  },
  {
    slug: 'acrylic-wood-name-plates',
    name: 'Acrylic + Wood Name Plates',
    categorySlug: 'home-name-plates',
    shortDescription: 'Wood warmth with a crisp acrylic layer over it.',
    description:
      'A wooden base with clear or coloured acrylic layered on top, giving you the warmth of wood and the precision of laser-cut acrylic in one plate. A popular pick for modern homes that still want some texture at the door.',
    materials: ['Wood base', 'Cast acrylic overlay', 'Standoff fixings'],
    tags: ['acrylic', 'wood', 'combination', 'name plate', 'modern'],
    image: IMAGES.carvedWoodAcrylicPlate,
  },
  {
    slug: 'villa-bungalow-name-plates',
    name: 'Villa & Bungalow Name Plates',
    categorySlug: 'home-name-plates',
    shortDescription: 'Larger format plates scaled for gates and boundary walls.',
    description:
      'Sized and built for the wider entrances of villas and bungalows, where a standard door plate would look lost. Weather-rated materials and fixings throughout, with optional illumination for the gate.',
    materials: ['Weather-rated acrylic, metal or stone-effect panel', 'Outdoor fixings'],
    tags: ['villa', 'bungalow', 'gate', 'outdoor', 'large', 'name plate'],
    image: IMAGES.residenceMetalPlate,
    featured: true,
  },
  {
    slug: 'apartment-society-name-plates',
    name: 'Apartment & Society Name Plates',
    categorySlug: 'home-name-plates',
    shortDescription: 'Matching plates for flats, floors and society entrances.',
    description:
      'Consistent plates across a building — flat numbers, floor markers and the society name board — all in one design language. We can produce a matched set in bulk so every door on every floor looks like part of the same scheme.',
    materials: ['Acrylic or ACP panel', 'Engraved or vinyl lettering'],
    customization: [
      'Matched set across all flats',
      'Flat, floor and block numbering',
      'Society branding and colours',
      'Bulk quantities',
    ],
    tags: ['apartment', 'society', 'flat', 'building', 'bulk', 'name plate'],
    image: IMAGES.backlitAcrylicPlate,
  },
  {
    slug: 'custom-family-name-plates',
    name: 'Custom Family Name Plates',
    categorySlug: 'home-name-plates',
    alsoIn: ['custom-signs'],
    shortDescription: 'Built entirely around your family name and door.',
    description:
      "Start from a blank sheet. Send a reference you like or just describe the entrance, and we'll work out the layout, material and size with you before anything is cut. Family motifs, regional scripts and multi-language plates are all possible.",
    materials: ['Your choice of acrylic, metal, wood or a combination'],
    customization: [
      'Fully bespoke layout and design',
      'Multi-language and regional scripts',
      'Family motifs and symbols',
      'Any material or finish',
    ],
    tags: ['custom', 'family', 'bespoke', 'personalised', 'name plate'],
    image: IMAGES.backlitWoodenPlate,
  },

  // ─────────────────────────────── SHOP SIGNAGE ─────────────────────────────
  {
    slug: 'led-shop-boards',
    name: 'LED Shop Boards',
    categorySlug: 'shop-signage',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Bright, weather-rated shop boards that read from a distance.',
    description:
      'The workhorse of retail signage — an illuminated board sized to your shopfront, bright enough to be picked out from across the road and rated for the monsoon. Energy-efficient LED modules keep the running cost low even with long trading hours.',
    materials: ['ACP or MS frame', 'Acrylic face', 'Weatherproof LED modules'],
    customization: [
      'Your shop name and logo',
      'Brand colours matched',
      'Sized to your shopfront',
      'Single or double sided',
    ],
    tags: ['led', 'shop', 'board', 'storefront', 'retail', 'outdoor'],
    image: IMAGES.chitraLedBoard,
    gallery: [
      IMAGES.cakeOClockAcpBoard,
      IMAGES.vardaanBacklitBoard,
      IMAGES.kalashreeAcrylicBoard,
      IMAGES.abnaChannelLetters,
      IMAGES.ledShopBoard,
    ],
    featured: true,
  },
  {
    slug: 'acrylic-shop-boards',
    name: 'Acrylic Shop Boards',
    categorySlug: 'shop-signage',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Clean non-illuminated boards for well-lit frontages.',
    description:
      'A crisp acrylic board for shopfronts that already get good light, or where illumination is not wanted. Lighter and quicker to install than a lit board, with the same sharp laser-cut lettering.',
    materials: ['Cast acrylic panel', 'Laser-cut or printed lettering'],
    tags: ['acrylic', 'shop', 'board', 'retail', 'non-illuminated'],
    image: IMAGES.kalashreeAcrylicBoard,
  },
  {
    slug: '3d-letter-boards',
    name: '3D Letter Boards',
    categorySlug: 'shop-signage',
    shortDescription: 'Individually cut letters mounted straight onto the facade.',
    description:
      'Letters cut individually and fixed directly to the wall or fascia, with no surrounding panel. The depth and shadow give a shopfront a considerably more premium look than a flat printed board, and each letter can be lit if you want it.',
    materials: ['Acrylic, ACP or metal letters', 'Concealed standoff fixings'],
    customization: [
      'Any font and letter height',
      'Choice of material and finish',
      'Optional illumination',
      'Straight or curved layout',
    ],
    tags: ['3d', 'letters', 'shop', 'facade', 'dimensional'],
    image: IMAGES.acp3dLetterBoard,
    featured: true,
  },
  {
    slug: 'glow-sign-boards',
    name: 'Glow Sign Boards',
    categorySlug: 'shop-signage',
    shortDescription: 'Evenly lit flex-face boards — the classic shop glow sign.',
    description:
      'A translucent flex or acrylic face lit evenly from behind, so the whole board glows rather than just the letters. Cost-effective at large sizes, which is why it remains the standard for wide shopfronts and highway-facing frontage.',
    materials: ['Flex or acrylic face', 'MS/ACP frame', 'Internal LED array'],
    tags: ['glow', 'sign', 'board', 'flex', 'illuminated', 'shop'],
    image: IMAGES.ledShopBoard,
  },
  {
    slug: 'acp-acrylic-boards',
    name: 'ACP + Acrylic Boards',
    categorySlug: 'shop-signage',
    shortDescription: 'ACP panel base with raised acrylic letters over it.',
    description:
      'An aluminium composite panel background with acrylic lettering raised on top. ACP gives a flat, durable, professional-looking base that resists weathering, while the acrylic letters carry the brand colour and depth.',
    materials: ['Aluminium composite panel (ACP)', 'Cast acrylic letters'],
    customization: [
      'ACP colour and finish',
      'Letter colour and depth',
      'Optional backlighting',
      'Sized to your frontage',
    ],
    tags: ['acp', 'acrylic', 'board', 'shop', 'panel', 'durable'],
    image: IMAGES.cakeOClockAcpBoard,
  },
  {
    slug: 'backlit-shop-boards',
    name: 'Backlit Shop Boards',
    categorySlug: 'shop-signage',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Halo-lit lettering for an upmarket storefront.',
    description:
      'Letters lit from behind so light spills onto the fascia around them, leaving the letter faces solid. It reads as noticeably more premium than a fully lit board and photographs well, which matters for cafes, studios and boutiques.',
    materials: ['Acrylic or metal letters', 'Concealed LED modules', 'Standoff mounts'],
    tags: ['backlit', 'halo', 'shop', 'board', 'premium', 'led'],
    image: IMAGES.vardaanBacklitBoard,
  },
  {
    slug: 'frontlit-letters',
    name: 'Frontlit Letters',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['shop-signage'],
    shortDescription: 'Letters that light up through the face itself.',
    description:
      'Built-up letters with a translucent acrylic face lit from inside, so the letter face itself glows. The brightest and most legible option at a distance, which makes it the standard choice for busy roads and larger frontage.',
    materials: ['Acrylic face', 'ACP or aluminium returns', 'Internal LED modules'],
    tags: ['frontlit', 'letters', 'led', 'illuminated', 'shop', 'bright'],
    image: IMAGES.archFrontlitLetters,
  },
  {
    slug: 'channel-letters',
    name: 'Channel Letters',
    categorySlug: 'shop-signage',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Built-up three-dimensional letters with returns.',
    description:
      'Fabricated letters with proper sides ("returns") rather than flat cut-outs, each one built as its own housing. They can be lit at the front, from behind, or both, and they are the most durable format we build for outdoor use.',
    materials: ['Aluminium or ACP returns', 'Acrylic face', 'LED modules'],
    tags: ['channel', 'letters', 'built-up', 'dimensional', 'shop', 'outdoor'],
    image: IMAGES.abnaChannelLetters,
  },
  {
    slug: 'shop-logo-signs',
    name: 'Shop Logo Signs',
    categorySlug: 'shop-signage',
    shortDescription: 'Your logo reproduced accurately at signage scale.',
    description:
      'We reproduce your logo as a physical sign, matching the artwork properly rather than approximating it — correct proportions, correct colours, cut cleanly. Send whatever file you have and we will work from it.',
    materials: ['Acrylic, ACP or metal', 'Colour-matched finish'],
    customization: [
      'Exact logo reproduction from your artwork',
      'Brand colour matching',
      'Optional illumination',
      'Any size',
    ],
    tags: ['logo', 'shop', 'brand', 'sign'],
    image: IMAGES.acp3dLetterBoard,
  },
  {
    slug: 'counter-signs',
    name: 'Counter Signs',
    categorySlug: 'shop-signage',
    alsoIn: ['restaurant-cafe'],
    shortDescription: 'Compact branded signs for billing and service counters.',
    description:
      'Small-format signage for the point where customers actually stop — the billing counter, the service desk, the takeaway window. Freestanding or wall-mounted, and often the last piece of branding a customer sees.',
    materials: ['Acrylic', 'Optional LED edge lighting'],
    tags: ['counter', 'billing', 'desk', 'shop', 'restaurant', 'compact'],
  },
  {
    slug: 'qr-code-boards',
    name: 'QR Code Boards',
    categorySlug: 'shop-signage',
    alsoIn: ['restaurant-cafe', 'acrylic-products'],
    shortDescription: 'Durable QR displays for payments and digital menus.',
    description:
      'A permanent, scannable home for your payment QR or digital menu, instead of a printed sheet that curls and fades. Printed onto acrylic and tested for scan reliability before it leaves us. Freestanding, wall-mounted or table-top.',
    materials: ['Acrylic panel', 'UV-printed QR', 'Optional stand'],
    customization: [
      'Your QR code and branding',
      'Table, counter or wall format',
      'Multiple units for larger venues',
      'Custom size',
    ],
    tags: ['qr', 'payment', 'upi', 'menu', 'scan', 'digital'],
  },
  {
    slug: 'open-closed-signs',
    name: 'Open / Closed Signs',
    categorySlug: 'shop-signage',
    alsoIn: ['restaurant-cafe'],
    shortDescription: 'Reversible or illuminated trading-status signs.',
    description:
      'A clear signal of whether you are trading, in a format that lasts — reversible hanging boards, or illuminated versions that are unmistakable at night. Small item, but it saves customers walking away when you are actually open.',
    materials: ['Acrylic', 'Optional LED illumination', 'Hanging or suction fixings'],
    tags: ['open', 'closed', 'trading', 'door', 'shop', 'restaurant'],
  },

  // ────────────────────────── OFFICE & CORPORATE ────────────────────────────
  {
    slug: 'reception-signs',
    name: 'Reception Signs',
    categorySlug: 'office-corporate',
    alsoIn: ['salon-boutique', 'acrylic-products'],
    shortDescription: 'The logo wall behind your reception desk.',
    description:
      'The first thing a visitor looks at when they walk in. Built as raised letters, a backlit logo or an acrylic panel, scaled to the wall behind your desk and finished to match the interior rather than fight it.',
    materials: ['Acrylic, ACP or metal', 'Optional backlighting', 'Standoff mounts'],
    customization: [
      'Your company logo and name',
      'Backlit, frontlit or non-illuminated',
      'Brand colour matching',
      'Scaled to your reception wall',
    ],
    tags: ['reception', 'office', 'logo', 'wall', 'corporate', 'lobby'],
  },
  {
    slug: 'company-name-boards',
    name: 'Company Name Boards',
    categorySlug: 'office-corporate',
    shortDescription: 'Exterior and lobby boards carrying your company name.',
    description:
      'The board that identifies your premises from outside — at the building entrance, on the compound wall, or in a shared lobby directory. Weather-rated for exterior positions and built to stay legible for years.',
    materials: ['ACP, acrylic or steel', 'Engraved or raised lettering'],
    tags: ['company', 'name', 'board', 'office', 'building', 'corporate'],
    image: IMAGES.archFrontlitLetters,
  },
  {
    slug: 'acrylic-logo-signs',
    name: 'Acrylic Logo Signs',
    categorySlug: 'office-corporate',
    alsoIn: ['salon-boutique', 'acrylic-products'],
    shortDescription: 'Your logo cut from acrylic and mounted off the wall.',
    description:
      'Laser-cut acrylic reproducing your logo exactly, mounted on standoffs so it sits proud of the wall and casts a soft shadow. Clean, versatile and equally at home in an office, a salon or a studio.',
    materials: ['Cast acrylic', 'Stainless steel standoffs'],
    customization: [
      'Exact logo reproduction',
      'Clear, frosted, mirror or solid colour',
      'Standoff or flush mounting',
      'Any size',
    ],
    tags: ['acrylic', 'logo', 'office', 'wall', 'salon', 'brand'],
    featured: true,
  },
  {
    slug: 'cabin-name-plates',
    name: 'Cabin Name Plates',
    categorySlug: 'office-corporate',
    shortDescription: 'Door plates for cabins and private offices.',
    description:
      'Name and designation plates for cabin doors, produced as a matched set across the floor. Slide-in insert versions are available where people move desks often, so you are not remaking the plate each time.',
    materials: ['Acrylic or steel', 'Engraved or printed lettering'],
    customization: [
      'Name and designation',
      'Fixed or interchangeable insert',
      'Matched across all cabins',
      'Company branding',
    ],
    tags: ['cabin', 'door', 'office', 'name plate', 'designation'],
  },
  {
    slug: 'employee-name-plates',
    name: 'Employee Name Plates',
    categorySlug: 'office-corporate',
    shortDescription: 'Desk and workstation plates, made in matched sets.',
    description:
      'Desk-top or partition-mounted plates carrying name and role. We produce them in bulk to one consistent design, with interchangeable inserts if your seating changes regularly.',
    materials: ['Acrylic', 'Optional metal base', 'Printed or engraved insert'],
    tags: ['employee', 'desk', 'workstation', 'office', 'name plate', 'bulk'],
  },
  {
    slug: 'meeting-room-signs',
    name: 'Meeting Room Signs',
    categorySlug: 'office-corporate',
    shortDescription: 'Room identification with optional occupancy sliders.',
    description:
      'Signs identifying meeting rooms, conference rooms and training rooms, with an optional vacant/occupied slider so nobody has to open the door to check. Part of a matched wayfinding set across the floor.',
    materials: ['Acrylic', 'Optional sliding occupancy indicator'],
    tags: ['meeting', 'room', 'conference', 'office', 'occupancy'],
  },
  {
    slug: 'direction-signs',
    name: 'Direction Signs',
    categorySlug: 'office-corporate',
    alsoIn: ['restaurant-cafe'],
    shortDescription: 'Arrows and wayfinding that get people where they need to go.',
    description:
      'Directional signage for corridors, lobbies and multi-floor premises — arrows, room lists and floor directories, designed as one coherent system so a visitor can follow it without asking anyone.',
    materials: ['Acrylic or ACP', 'Printed or engraved graphics'],
    customization: [
      'Arrow and text layout',
      'Matched wayfinding system',
      'Wall, ceiling or projecting mount',
      'Company branding',
    ],
    tags: ['direction', 'wayfinding', 'arrow', 'office', 'corridor', 'navigation'],
  },
  {
    slug: 'department-signs',
    name: 'Department Signs',
    categorySlug: 'office-corporate',
    shortDescription: 'Clear identification for each department or zone.',
    description:
      'Signs marking departments, teams and functional zones across a floor plate. Consistent sizing and typography throughout, so the whole office reads as one system rather than a collection of one-off signs.',
    materials: ['Acrylic or ACP', 'Engraved or printed lettering'],
    tags: ['department', 'zone', 'office', 'identification'],
  },
  {
    slug: 'floor-signs',
    name: 'Floor Signs',
    categorySlug: 'office-corporate',
    shortDescription: 'Floor numbers and level markers for lobbies and stairwells.',
    description:
      'Level identification for lift lobbies, staircases and landings. Large, high-contrast numbering that is readable at a glance, which matters both for everyday navigation and during an evacuation.',
    materials: ['Acrylic or ACP', 'High-contrast lettering'],
    tags: ['floor', 'level', 'lift', 'lobby', 'staircase', 'number'],
  },
  {
    slug: 'safety-signs',
    name: 'Safety Signs',
    categorySlug: 'office-corporate',
    shortDescription: 'Exit, fire and hazard signage for the workplace.',
    description:
      'Emergency exit routes, fire equipment locations, hazard warnings and mandatory instruction signs, using standard symbols and colours so they are understood immediately. Glow-in-the-dark material is available where the situation calls for it.',
    materials: ['Acrylic, ACP or photoluminescent panel', 'Standard safety graphics'],
    customization: [
      'Standard safety symbols',
      'Glow-in-the-dark option',
      'Multi-language text',
      'Site-specific layouts',
    ],
    tags: ['safety', 'exit', 'fire', 'emergency', 'hazard', 'office'],
  },

  // ────────────────────────── RESTAURANT & CAFE ─────────────────────────────
  {
    slug: 'restaurant-sign-boards',
    name: 'Restaurant Sign Boards',
    categorySlug: 'restaurant-cafe',
    shortDescription: 'Frontage signage that fills tables in the evening.',
    description:
      'The main board over your restaurant frontage, designed for evening trade when most of your customers actually arrive. Illumination tuned to be inviting rather than glaring, and weather-rated for an exposed position.',
    materials: ['ACP or MS frame', 'Acrylic face', 'LED modules'],
    tags: ['restaurant', 'board', 'frontage', 'dining', 'illuminated'],
  },
  {
    slug: 'cafe-signage',
    name: 'Cafe Signage',
    categorySlug: 'restaurant-cafe',
    shortDescription: 'Warm, characterful signage for cafes and coffee bars.',
    description:
      'Signage with a bit of warmth to it — softer lighting, mixed materials, sometimes hand-finished detail. Built to suit the smaller, more textured spaces cafes tend to occupy, and to look good in a photo.',
    materials: ['Acrylic, wood or metal', 'Warm-white LED options'],
    tags: ['cafe', 'coffee', 'warm', 'ambience', 'signage'],
  },
  {
    slug: 'menu-boards',
    name: 'Menu Boards',
    categorySlug: 'restaurant-cafe',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Backlit or standing menu displays, easy to update.',
    description:
      'Wall-mounted or freestanding menu displays, backlit so they stay readable in low light. We can build them with replaceable inserts, so a price change means swapping a sheet rather than rebuilding the board.',
    materials: ['Acrylic panel', 'LED backlighting', 'Replaceable insert system'],
    customization: [
      'Backlit or non-illuminated',
      'Replaceable menu inserts',
      'Wall-mounted or freestanding',
      'Single or multi-panel',
    ],
    tags: ['menu', 'board', 'restaurant', 'cafe', 'backlit', 'display'],
  },
  {
    slug: 'table-numbers',
    name: 'Table Numbers',
    categorySlug: 'restaurant-cafe',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Sturdy numbered stands that survive daily service.',
    description:
      'Table identification that holds up to being knocked, wiped down and moved several times a day. Freestanding acrylic blocks or weighted stands, produced as a full numbered set for your floor plan.',
    materials: ['Cast acrylic', 'Weighted or standing base'],
    customization: [
      'Full numbered set',
      'Restaurant branding',
      'Clear, frosted or coloured acrylic',
      'Table-top or clamp mount',
    ],
    tags: ['table', 'number', 'restaurant', 'cafe', 'service'],
  },
  {
    slug: 'washroom-signs',
    name: 'Washroom Signs',
    categorySlug: 'restaurant-cafe',
    alsoIn: ['office-corporate'],
    shortDescription: 'Restroom identification that matches your interior.',
    description:
      'Washroom and restroom signage using clear standard symbols, but finished to match your interior rather than looking like a hardware-store part. Accessible and gender-neutral options available.',
    materials: ['Acrylic or metal', 'Engraved or raised symbols'],
    tags: ['washroom', 'restroom', 'toilet', 'restaurant', 'office', 'symbol'],
  },
  {
    slug: 'wall-logo-signs',
    name: 'Wall Logo Signs',
    categorySlug: 'restaurant-cafe',
    alsoIn: ['salon-boutique', 'office-corporate'],
    shortDescription: 'Interior logo walls guests photograph and tag.',
    description:
      'An interior feature wall carrying your logo, sized and lit so it looks good in a phone photo. It earns its keep twice — as decor for the room, and as free reach every time a guest posts from your venue.',
    materials: ['Acrylic, wood or metal', 'Optional backlighting'],
    customization: [
      'Your logo at feature scale',
      'Backlit or non-illuminated',
      'Material and finish to match interior',
      'Sized to the wall',
    ],
    tags: ['wall', 'logo', 'interior', 'restaurant', 'salon', 'feature'],
    image: IMAGES.neonScriptSign,
  },
  {
    slug: 'photo-wall-signs',
    name: 'Photo Wall & Instagram Signs',
    categorySlug: 'restaurant-cafe',
    alsoIn: ['custom-signs'],
    shortDescription: 'A dedicated backdrop built to be photographed.',
    description:
      'A neon-style or illuminated statement piece designed as a photo backdrop — a quote, your handle, or a shape that suits the room. Positioned and lit with the camera in mind, since that is the entire point of it.',
    materials: ['Neon-style LED flex', 'Acrylic backing'],
    customization: [
      'Custom text, quote or handle',
      'Choice of LED colour',
      'Any shape or script',
      'Sized to the wall',
    ],
    tags: ['instagram', 'photo', 'neon', 'backdrop', 'social', 'feature'],
    image: IMAGES.neonScriptSign,
  },

  // ─────────────────────────── SALON & BOUTIQUE ─────────────────────────────
  {
    slug: 'salon-led-boards',
    name: 'Salon LED Boards',
    categorySlug: 'salon-boutique',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Softly lit frontage boards for salons and studios.',
    description:
      'Frontage signage for salons, tuned for a softer, more flattering light than retail signage usually uses. Bright enough to be seen from the street, restrained enough that the space still reads as premium.',
    materials: ['Acrylic face', 'Warm-white LED modules', 'ACP frame'],
    tags: ['salon', 'led', 'board', 'beauty', 'frontage'],
  },
  {
    slug: 'salon-logo-signs',
    name: 'Salon Logo Signs',
    categorySlug: 'salon-boutique',
    shortDescription: 'Logo pieces for the reception and styling areas.',
    description:
      'Your salon logo as a physical sign for the reception wall or behind the styling chairs. Mirror acrylic, brushed metal and backlit finishes all work well here and photograph nicely in client pictures.',
    materials: ['Mirror or coloured acrylic', 'Optional backlighting'],
    tags: ['salon', 'logo', 'reception', 'beauty', 'brand'],
  },
  {
    slug: 'beauty-parlour-signs',
    name: 'Beauty Parlour Signs',
    categorySlug: 'salon-boutique',
    shortDescription: 'Approachable frontage signage for beauty parlours.',
    description:
      'Signage for beauty parlours that manages to look welcoming and professional at the same time. Clear service listing where you need it, so people know what you offer before they come in.',
    materials: ['Acrylic or ACP panel', 'Printed or cut lettering'],
    tags: ['beauty', 'parlour', 'salon', 'frontage', 'services'],
  },
  {
    slug: 'boutique-signage',
    name: 'Boutique Signage',
    categorySlug: 'salon-boutique',
    shortDescription: 'Restrained, fashion-led signage for boutiques.',
    description:
      'Signage for clothing and lifestyle boutiques, where the styling matters as much as the visibility. Typography-led, minimal, finished in materials chosen to sit with the shopfit rather than stand apart from it.',
    materials: ['Acrylic, metal or wood', 'Minimal typographic treatment'],
    tags: ['boutique', 'fashion', 'retail', 'minimal', 'premium'],
  },
  {
    slug: 'makeup-studio-signs',
    name: 'Makeup Studio Signs',
    categorySlug: 'salon-boutique',
    shortDescription: 'Well-lit signage for makeup and bridal studios.',
    description:
      'Signage for makeup and bridal studios, where lighting quality is part of the service. Even, colour-accurate illumination that suits a space clients will be photographed in.',
    materials: ['Acrylic', 'Colour-accurate LED modules'],
    tags: ['makeup', 'studio', 'bridal', 'beauty', 'lighting'],
  },
  {
    slug: 'nail-studio-signs',
    name: 'Nail Studio Signs',
    categorySlug: 'salon-boutique',
    shortDescription: 'Compact, colourful signage for nail bars and studios.',
    description:
      'Signage scaled for the smaller footprints nail studios usually work with, and happy to carry more colour than most of our range. Neon-style and pastel acrylic finishes both suit this space well.',
    materials: ['Coloured acrylic', 'Neon-style LED flex'],
    tags: ['nail', 'studio', 'beauty', 'neon', 'colourful', 'compact'],
  },
  {
    slug: 'offer-boards',
    name: 'Offer & Promotion Boards',
    categorySlug: 'salon-boutique',
    alsoIn: ['shop-signage'],
    shortDescription: 'Updatable boards for offers, packages and pricing.',
    description:
      'Boards for promoting current offers and packages, built with replaceable or writable panels so you can change what is on them without ordering a new sign each season.',
    materials: ['Acrylic with writable or insert panel', 'Optional frame'],
    customization: [
      'Writable or replaceable insert',
      'Freestanding or wall-mounted',
      'Branded header',
      'Any size',
    ],
    tags: ['offer', 'promotion', 'package', 'pricing', 'updatable', 'salon'],
  },

  // ────────────────────── LED & ILLUMINATED SIGNS ───────────────────────────
  {
    slug: 'led-acrylic-letters',
    name: 'LED Acrylic Letters',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Individually lit acrylic letters, front or halo lit.',
    description:
      'Each letter built as its own lit unit, so the lighting stays even across a word instead of pooling in the middle. Can be frontlit, halo-lit from behind, or both at once for a dual effect.',
    materials: ['Cast acrylic', 'LED modules', 'Aluminium returns'],
    customization: [
      'Frontlit, backlit or both',
      'Any font and letter height',
      'LED colour temperature',
      'Indoor or outdoor build',
    ],
    tags: ['led', 'acrylic', 'letters', 'illuminated', '3d'],
    image: IMAGES.archFrontlitLetters,
    featured: true,
  },
  {
    slug: 'backlit-acrylic',
    name: 'Backlit Acrylic Panels',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Evenly lit acrylic panels for logos and graphics.',
    description:
      'A full acrylic panel lit evenly from behind — the right approach for logos and graphics that are too detailed to build as separate letters. Diffusion is worked out to avoid hotspots and visible LED dots.',
    materials: ['Diffused acrylic panel', 'LED array', 'Aluminium housing'],
    tags: ['backlit', 'acrylic', 'panel', 'logo', 'diffused', 'led'],
  },
  {
    slug: 'led-logos',
    name: 'LED Logos',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['restaurant-cafe', 'office-corporate'],
    shortDescription: 'Your logo built as an illuminated feature piece.',
    description:
      'Your logo engineered as an illuminated sign, with the lighting worked out around the artwork — thin strokes, tight counters and gradients all need different handling. Colour matched to your brand.',
    materials: ['Acrylic and metal', 'LED modules', 'Custom fabrication'],
    tags: ['led', 'logo', 'illuminated', 'brand', 'feature'],
  },
  {
    slug: 'led-name-boards',
    name: 'LED Name Boards',
    categorySlug: 'led-illuminated-signs',
    shortDescription: 'Illuminated boards carrying a name or title.',
    description:
      'A straightforward illuminated board for a business, building or premises name. The dependable option where you need legibility at night without the cost of individually built letters.',
    materials: ['Acrylic face', 'ACP frame', 'LED modules'],
    tags: ['led', 'name', 'board', 'illuminated', 'business'],
    image: IMAGES.ledShopBoard,
  },
  {
    slug: 'neon-style-signs',
    name: 'Neon Style Signs',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['custom-signs', 'restaurant-cafe'],
    shortDescription: 'LED flex neon — the look of glass neon, none of the fragility.',
    description:
      'Modern LED flex bent to shape, giving you the look of traditional glass neon without the fragility, heat or power draw. Safe indoors, available in a range of colours, and it will run for years.',
    materials: ['LED neon flex', 'Clear or cut acrylic backing'],
    customization: [
      'Custom text, script or shape',
      'Choice of LED colour',
      'Cut-to-shape or rectangular backing',
      'Dimmer and remote options',
    ],
    tags: ['neon', 'led', 'flex', 'custom', 'interior', 'feature'],
    image: IMAGES.neonScriptSign,
    featured: true,
  },
  {
    slug: 'edge-lit-acrylic',
    name: 'Edge-lit Acrylic Signs',
    categorySlug: 'led-illuminated-signs',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Light entering the edge, glowing through engraved artwork.',
    description:
      'LEDs fire into the edge of a clear acrylic sheet; the light travels through it and escapes where the artwork is engraved, so the design glows while the panel stays transparent. A distinctive effect for interiors.',
    materials: ['Clear cast acrylic', 'Edge-mounted LED strip', 'Engraved artwork'],
    tags: ['edge-lit', 'acrylic', 'engraved', 'transparent', 'interior', 'led'],
  },
  {
    slug: '3d-illuminated-letters',
    name: '3D Illuminated Letters',
    categorySlug: 'led-illuminated-signs',
    shortDescription: 'Deep built-up letters with real depth and light.',
    description:
      'Built-up letters with substantial depth, lit at the face, the halo or both. The most commanding format we make, and the one to choose when the signage itself is meant to be the landmark.',
    materials: ['Fabricated aluminium or ACP', 'Acrylic face', 'LED modules'],
    tags: ['3d', 'illuminated', 'letters', 'deep', 'premium', 'landmark'],
    image: IMAGES.acp3dLetterBoard,
  },

  // ───────────────────────── ACRYLIC PRODUCTS ───────────────────────────────
  {
    slug: 'acrylic-letters',
    name: 'Acrylic Letters',
    categorySlug: 'acrylic-products',
    shortDescription: 'Non-illuminated cut letters in any font or size.',
    description:
      'Individual letters laser-cut from acrylic and mounted flush or on standoffs. No wiring, no power, nothing to maintain — the simplest way to put clean dimensional lettering on a wall.',
    materials: ['Cast acrylic (3mm–20mm)', 'Flush or standoff mounting'],
    customization: [
      'Any font and letter height',
      'Clear, frosted, mirror or solid colour',
      'Acrylic thickness',
      'Flush or standoff mount',
    ],
    tags: ['acrylic', 'letters', 'cut', 'dimensional', 'wall'],
  },
  {
    slug: 'acrylic-wall-signs',
    name: 'Acrylic Wall Signs',
    categorySlug: 'acrylic-products',
    shortDescription: 'Panel signs for interior walls, mounted off the surface.',
    description:
      'A single acrylic panel carrying text, artwork or a logo, mounted on standoffs so it floats slightly off the wall. Versatile enough for a reception, a corridor, a clinic or a studio.',
    materials: ['Cast acrylic panel', 'UV printing or vinyl', 'Standoff mounts'],
    tags: ['acrylic', 'wall', 'panel', 'interior', 'sign'],
  },
  {
    slug: 'acrylic-door-plates',
    name: 'Acrylic Door Plates',
    categorySlug: 'acrylic-products',
    shortDescription: 'Compact plates for doors, cabins and rooms.',
    description:
      'Small-format acrylic plates for doors — names, numbers, room labels or short instructions. Produced as matched sets for a whole floor or building, with adhesive or screw fixing.',
    materials: ['Cast acrylic', 'Engraved or printed lettering'],
    tags: ['acrylic', 'door', 'plate', 'room', 'compact', 'set'],
  },
  {
    slug: 'transparent-acrylic-signs',
    name: 'Transparent Acrylic Signs',
    categorySlug: 'acrylic-products',
    shortDescription: 'Clear acrylic so the lettering appears to float.',
    description:
      'Optically clear acrylic with the lettering applied or engraved, so the text seems to sit on the wall by itself. Works best on plain, evenly coloured surfaces where the panel edge disappears.',
    materials: ['Optically clear cast acrylic', 'Engraved or applied lettering'],
    tags: ['transparent', 'clear', 'acrylic', 'floating', 'minimal'],
  },
  {
    slug: 'mirror-acrylic-signs',
    name: 'Mirror Acrylic Signs',
    categorySlug: 'acrylic-products',
    shortDescription: 'Mirror-finish acrylic in silver, gold or rose gold.',
    description:
      'Mirror-finish acrylic that reads like polished metal at a fraction of the weight, in silver, gold and rose gold. A favourite for salons, boutiques and event signage where a bit of shine is the point.',
    materials: ['Mirror-finish cast acrylic', 'Standoff or adhesive mounting'],
    customization: [
      'Silver, gold or rose gold finish',
      'Any shape, logo or text',
      'Standoff or flush mount',
      'Any size',
    ],
    tags: ['mirror', 'acrylic', 'gold', 'silver', 'reflective', 'premium'],
  },

  // ───────────────────────────── CUSTOM SIGNS ───────────────────────────────
  {
    slug: 'custom-acrylic-designs',
    name: 'Custom Acrylic Designs',
    categorySlug: 'custom-signs',
    alsoIn: ['acrylic-products'],
    shortDescription: 'Acrylic work built to a brief, not to a catalogue entry.',
    description:
      "Acrylic fabrication for anything our standard range does not cover — unusual shapes, layered builds, awkward mounting situations. Tell us the constraint and we'll work out how to make it.",
    materials: ['Cast acrylic in any thickness, colour or finish'],
    customization: [
      'Any shape, layer or build',
      'Full design support',
      'Non-standard mounting',
      'Any size',
    ],
    tags: ['custom', 'acrylic', 'bespoke', 'fabrication'],
  },
  {
    slug: 'custom-led-signs',
    name: 'Custom LED Signs',
    categorySlug: 'custom-signs',
    alsoIn: ['led-illuminated-signs'],
    shortDescription: 'Illuminated signage engineered around your idea.',
    description:
      'Illuminated signage designed from scratch — unusual formats, animated or colour-changing effects, or lighting that has to work around a difficult site. We handle the electrical design and the installation.',
    materials: ['LED modules or flex', 'Acrylic and metal fabrication'],
    customization: [
      'Any shape, size or effect',
      'Colour-changing and dimmable options',
      'Indoor or outdoor build',
      'Full electrical design',
    ],
    tags: ['custom', 'led', 'illuminated', 'bespoke', 'special'],
  },
  {
    slug: 'custom-logos',
    name: 'Custom Logo Signs',
    categorySlug: 'custom-signs',
    shortDescription: 'Complex logos translated into a buildable sign.',
    description:
      'Some logos do not translate straight into signage — thin strokes, fine gradients, tight counters. We work out how to build yours so it stays recognisable at size and survives its environment.',
    materials: ['Material selected to suit the artwork'],
    customization: [
      'Artwork adapted for fabrication',
      'Exact brand colour matching',
      'Any material or finish',
      'Optional illumination',
    ],
    tags: ['custom', 'logo', 'brand', 'bespoke'],
  },
  {
    slug: 'custom-wall-signs',
    name: 'Custom Wall Signs',
    categorySlug: 'custom-signs',
    shortDescription: 'Feature wall pieces made for one specific space.',
    description:
      'Larger interior wall pieces designed for a particular room — a quote, a mural-scale logo, a mixed-material composition. We work from the wall dimensions and the lighting in the space.',
    materials: ['Mixed materials to suit the space'],
    tags: ['custom', 'wall', 'feature', 'interior', 'mural'],
  },
  {
    slug: 'custom-business-signs',
    name: 'Custom Business Signs',
    categorySlug: 'custom-signs',
    shortDescription: 'Complete signage sets for a whole premises.',
    description:
      'A full signage package for a business — exterior board, reception piece, wayfinding, door plates and safety signage, all designed together so the whole premises reads consistently instead of looking assembled piecemeal.',
    materials: ['Mixed materials across the signage set'],
    customization: [
      'Complete premises signage package',
      'One consistent design language',
      'Phased supply and installation',
      'Site survey included',
    ],
    tags: ['custom', 'business', 'complete', 'package', 'premises'],
  },
  {
    slug: 'customer-provided-designs',
    name: 'Your Design, Made Real',
    categorySlug: 'custom-signs',
    shortDescription: 'Send us your artwork or sketch and we build it.',
    description:
      'Already have a design? Send the artwork, a sketch, or even a photo of something you saw. We will tell you what it takes to build, flag anything that will not work at that size, and quote it before starting.',
    materials: ['Determined by your design'],
    customization: [
      'Built from your artwork or sketch',
      'Feasibility and material advice',
      'Adjustments suggested before production',
      'Any size',
    ],
    tags: ['custom', 'your design', 'artwork', 'sketch', 'bespoke'],
  },
  {
    slug: 'special-event-signs',
    name: 'Special Event Signs',
    categorySlug: 'custom-signs',
    shortDescription: 'Signage and backdrops for weddings and events.',
    description:
      'Welcome boards, name and date pieces, seating plans, photo backdrops and stage signage for weddings, launches and functions. Built as keepsakes where you want to hold on to them afterwards.',
    materials: ['Acrylic, LED neon flex, wood', 'Freestanding or hanging fixings'],
    customization: [
      'Names, dates and event details',
      'Freestanding, hanging or backdrop',
      'Keepsake-quality finish',
      'Any size',
    ],
    tags: ['event', 'wedding', 'party', 'backdrop', 'welcome', 'custom'],
  },
];

export const products: Product[] = seeds.map(defineProduct);
