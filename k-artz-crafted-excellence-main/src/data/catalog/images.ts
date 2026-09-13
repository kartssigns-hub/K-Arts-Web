/**
 * Central image registry for the catalog.
 *
 * ─── HOW TO ADD REAL PHOTOS ────────────────────────────────────────────────
 * 1. Drop the photo into the right folder under `public/` — name plates go in
 *    `public/name_plates/`, category banners in `public/background_banner/`.
 * 2. Add a key below pointing at it, e.g.
 *    `receptionLogo: '/name_plates/reception_logo.webp'`.
 * 3. In `products.ts`, give that product `image: IMAGES.receptionLogo`.
 * That is the whole process — `imageIsPlaceholder` updates itself and no
 * component needs changing.
 *
 * Please compress photos before adding them. Raw camera PNGs are 4–6 MB
 * each; exporting at ~1600px wide as WebP or JPEG keeps them under ~200 KB
 * and makes the catalog dramatically faster to load.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Key names describe what each photograph actually shows, so products are
 * never illustrated with the wrong kind of signage. Every product still
 * pointing at `placeholder` is flagged `imageIsPlaceholder: true` in the data,
 * which makes the gaps easy to find and fill.
 */

export const IMAGES = {
  // --- Real K'artz photographs (public/) ---

  /** "Aadam's — The Residence": raised metal letters on a marble panel. */
  residenceMetalPlate: '/name_plates/aadams_nameplate.webp',

  /** "Aarti Adawade H-204": warm backlit acrylic flat name plate. */
  backlitAcrylicPlate: '/name_plates/aarti_nameplate.webp',

  /** "Pratham Pawar": clear acrylic on brass standoffs, gold raised letters. */
  designerAcrylicPlate: '/name_plates/pratham_nameplate.webp',

  /** "Dr. Smita / Dr. Prakash Bhambure 605": halo-backlit letters on a frosted panel. */
  haloLitDoorPlate: '/name_plates/office_nameplate.webp',

  /** "Mr. Prakash Shetty": wooden plate lit from behind through cut-out lettering and a Ram motif. */
  backlitWoodenPlate: '/name_plates/ram_nameplate.webp',

  /** "Swapnali Sunita Natekar 305": raised gold Devanagari with an orange Swami motif. */
  motifGoldPlate: '/name_plates/swami_nameplate.webp',

  /** "Gorakhe Randive 403": raised white letters on a wood-grain panel. */
  woodGrainPlate: '/name_plates/wooden1_nameplate.webp',

  /** "Upasani": a shaped carved-wood plate with white acrylic letters over it. */
  carvedWoodAcrylicPlate: '/name_plates/wooden2_nameplate.webp',

  /** School entrance arch in frontlit illuminated letters, shot at night. */
  archFrontlitLetters: '/ledb1.webp',

  /** K'artz's own shopfront — multi-panel illuminated LED shop board. */
  ledShopBoard: '/ledb2.webp',

  /** "Shambhu": blue LED neon-flex script on a dark wall. */
  neonScriptSign: '/sign1.webp',

  /** "Hoodies": 3D frontlit acrylic letters mounted on an ACP panel. */
  acp3dLetterBoard: '/sign2.webp',

  // --- LED shop boards (public/led_boards/) ---

  /** "Chitra Chicken Centre": lit Devanagari letters and an edge-lit rooster cut-out on a red board. */
  chitraLedBoard: '/led_boards/chitra_ledboard.webp',

  /** "The Cake O'Clock": raised white letters and a lit logo panel on a brown ACP board. */
  cakeOClockAcpBoard: '/led_boards/cakeoclock_ledboard.webp',

  /** "Vardaan Unisex Salon & Spa": halo-lit gold mirror letters and lotus logo on a black panel. */
  vardaanBacklitBoard: '/led_boards/vardaan_ledboard.webp',

  /** "Kalashree Arts": raised white and yellow acrylic Devanagari letters on a brown board. */
  kalashreeAcrylicBoard: '/led_boards/kalashree_ledboard.webp',

  /** "Abna O": multi-colour built-up channel letters with lit faces, mounted on a wall. */
  abnaChannelLetters: '/led_boards/abna_ledboard.webp',

  // --- Stand-in, awaiting real photography ---
  placeholder: '/placeholder.svg',
} as const;

export type ImageKey = keyof typeof IMAGES;
