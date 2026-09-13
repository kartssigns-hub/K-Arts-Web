/**
 * Single source of truth for K'artz business/contact data.
 *
 * Every phone number, email address and WhatsApp link in the app must come from
 * here. Do not hardcode contact details in components.
 *
 * Fields left as empty strings are NOT known to us yet — fill them in when the
 * business provides them. The UI is written to hide anything that is empty, so
 * an unset value degrades gracefully instead of rendering a blank row.
 */

export const BUSINESS = {
  name: "K'artz",
  legalName: 'Kalashree Arts',
  established: 1997,

  phone: '+91 9822110512',
  phoneHref: 'tel:+919822110512',

  /** E.164 without the leading '+', as required by wa.me links. */
  whatsappNumber: '919822110512',

  email: 'contact@kartzsignage.com',
  emailHref: 'mailto:contact@kartzsignage.com',

  city: 'Pune, Maharashtra, India',
  /** Just the city, for sentences like "Installation available across Pune". */
  cityShort: 'Pune',
  site: 'https://www.kartzsignage.com',

  /** Not yet supplied by the business — intentionally blank, not invented. */
  addressLine: '',
  hours: '',

  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },
} as const;

/** Years in business, derived so it never goes stale. */
export const yearsInBusiness = (): number =>
  new Date().getFullYear() - BUSINESS.established;

/**
 * Builds a wa.me deep link with a prefilled message.
 * Opens WhatsApp Web on desktop and the native app on mobile.
 */
export const buildWhatsAppLink = (message: string): string =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;

/** Enquiry text for a specific catalog product. */
export const productEnquiryMessage = (productName: string): string =>
  `Hi ${BUSINESS.name}, I'm interested in the ${productName}. Please share details and a quotation.`;

/** Enquiry text for a whole catalog category. */
export const categoryEnquiryMessage = (categoryName: string): string =>
  `Hi ${BUSINESS.name}, I'm looking for ${categoryName}. Please share the available options and pricing.`;

/** Generic enquiry used by the "Not sure what you need?" CTA. */
export const generalEnquiryMessage = (): string =>
  `Hi ${BUSINESS.name}, I'd like help choosing the right signage for my requirement. Please guide me.`;

/** Enquiry text for a name plate the customer previewed with their own name. */
export const namePlateEnquiryMessage = (name: string): string =>
  name
    ? `Hi ${BUSINESS.name}, I'd like a name plate with the name "${name}". Please share designs and pricing.`
    : `Hi ${BUSINESS.name}, I'd like a custom name plate for my home. Please share designs and pricing.`;

/** Service options on the contact form. `value` is what the backend stores. */
export const ENQUIRY_SERVICES = [
  { value: 'signage', label: 'Architectural Signage' },
  { value: 'plates', label: 'Acrylic Name Plates' },
  { value: 'branding', label: 'Corporate Branding' },
  { value: 'custom', label: 'Custom Fabrication' },
] as const;

export const enquiryServiceLabel = (value: string | undefined): string | undefined =>
  ENQUIRY_SERVICES.find((service) => service.value === value)?.label;

/** Contact form details as a WhatsApp message, for visitors who want a faster reply. */
export const contactFormEnquiryMessage = ({
  name,
  service,
  message,
}: {
  name: string;
  service?: string;
  message?: string;
}): string => {
  const lines = [name.trim() ? `Hi ${BUSINESS.name}, this is ${name.trim()}.` : `Hi ${BUSINESS.name},`];
  const serviceLabel = enquiryServiceLabel(service);
  if (serviceLabel) lines.push(`I'm interested in ${serviceLabel}.`);
  if (message?.trim()) lines.push(message.trim());
  if (lines.length === 1) lines.push("I'd like help choosing the right signage. Please share options and pricing.");
  return lines.join('\n');
};
