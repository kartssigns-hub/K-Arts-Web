import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppQuoteButton from '@/components/catalog/WhatsAppQuoteButton';
import { useSeo } from '@/hooks/useSeo';
import {
  BUSINESS,
  ENQUIRY_SERVICES,
  contactFormEnquiryMessage,
  generalEnquiryMessage,
} from '@/config/business';
import { API_URL } from '@/config/api';
import { logger } from '@/lib/monitoring';
import { trackEvent } from '@/utils/analytics';

interface FormFields {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  /** Honeypot, see the hidden input in the form. */
  website: string;
}

type FieldErrors = Partial<Record<keyof FormFields, string>>;
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_FORM: FormFields = { name: '', phone: '', email: '', service: '', message: '', website: '' };

// The backend can be asleep when idle, so the first request may take a while to answer.
const SUBMIT_TIMEOUT_MS = 60_000;
const SLOW_HINT_AFTER_MS = 6_000;

const inputClass =
  'w-full bg-[#161b2c] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all';
const labelClass = 'text-xs font-bold text-gray-500 uppercase tracking-wider ml-1';

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-sm text-red-400 ml-1">
      {message}
    </p>
  ) : null;

const ContactPage = () => {
  useSeo({
    title: "Contact K'artz Signage — Get a Quote for Custom Signage",
    description: `Get in touch with K'artz Signage in ${BUSINESS.city} for LED signs, acrylic name plates, shop boards and custom signage. Call ${BUSINESS.phone} or send your requirement on WhatsApp.`,
    path: '/contact',
  });

  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSlow, setIsSlow] = useState(false);

  // Same details, prefilled into WhatsApp, for a faster reply or if sending fails
  const whatsAppMessage = contactFormEnquiryMessage(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setErrorMessage('');
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    const slowHint = setTimeout(() => setIsSlow(true), SLOW_HINT_AFTER_MS);

    try {
      const res = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page: '/contact' }),
        signal: controller.signal,
      });

      if (res.ok) {
        setStatus('success');
        trackEvent('Contact', 'Enquiry_Submitted', form.service || 'unspecified');
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string; fields?: FieldErrors } | null;

      if (res.status === 400 && data?.fields) {
        setFieldErrors(data.fields);
        setStatus('idle');
        return;
      }

      if (res.status === 429) {
        setErrorMessage(data?.error ?? 'Too many enquiries. Please message us on WhatsApp instead.');
        setStatus('error');
        return;
      }

      throw new Error(`Enquiry request failed (${res.status})`);
    } catch (err) {
      logger.error('Contact form submission failed', err, { timedOut: controller.signal.aborted });
      setErrorMessage(
        "We couldn't send your message right now. Please send it on WhatsApp instead, your details are already filled in.",
      );
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      clearTimeout(slowHint);
      setIsSlow(false);
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans selection:bg-yellow-500 selection:text-black relative overflow-x-hidden">
      <Navbar />

      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pt-40 lg:pb-16 relative z-10">

        {/* --- Header Section --- */}
        <div className="mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm text-xs text-gray-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            GET IN TOUCH
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Let’s Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Vision Together.</span>
          </h1>

          <div className="flex items-start">
            <div className="w-1 h-12 bg-yellow-500 mr-6 rounded-full"></div>
            <p className="text-gray-400 text-lg max-w-2xl italic pt-2">
              "From modern acrylic plates to bespoke signage, we are ready to craft the designs that make people remember you."
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* --- Left Column: Contact Info Cards --- */}
          <div className="space-y-8">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-4">Contact Details</p>

            {/* Phone Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Phone size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <a href={BUSINESS.phoneHref} className="text-gray-400 hover:text-yellow-400 transition-colors block mt-1">{BUSINESS.phone}</a>
                </div>
            </div>

            {/* Email Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Mail size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <a href={BUSINESS.emailHref} className="text-gray-400 hover:text-yellow-400 transition-colors block mt-1 break-all">{BUSINESS.email}</a>
                </div>
            </div>

            {/* Address Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <MapPin size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{BUSINESS.city}</h3>
                    {BUSINESS.addressLine && (
                      <p className="text-gray-400 mt-1">{BUSINESS.addressLine}</p>
                    )}
                </div>
            </div>

            {/* Fastest route to a human — most enquiries arrive this way. */}
            <div className="rounded-2xl border border-gray-800 bg-[#0e1422] p-6">
              <h3 className="text-lg font-semibold text-white">Prefer WhatsApp?</h3>
              <p className="text-gray-400 mt-1 mb-4 text-sm">
                Send your requirement and we'll reply with options and a quotation.
              </p>
              <WhatsAppQuoteButton
                message={generalEnquiryMessage()}
                label="Message us on WhatsApp"
                className="w-full h-12 rounded-full"
              />
            </div>
          </div>

          {/* --- Right Column: The Form --- */}
          <div className="relative">
            {/* Subtle glow behind the form */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl blur-2xl opacity-50"></div>

            {status === 'success' ? (
              <div
                role="status"
                className="relative bg-[#0b101b] border border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl text-center space-y-6"
              >
                <CheckCircle2 className="mx-auto text-yellow-500" size={56} />
                <h2 className="text-2xl font-bold">Thanks, {form.name.trim().split(/\s+/)[0]}!</h2>
                <p className="text-gray-400">
                  We've received your enquiry and will get back to you on{' '}
                  <span className="text-white">{form.phone}</span> soon.
                </p>
                <WhatsAppQuoteButton
                  message={whatsAppMessage}
                  label="Want a faster reply? WhatsApp us"
                  className="w-full h-12 rounded-full"
                />
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative bg-[#0b101b] border border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl space-y-6">

                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                {/* Honeypot: hidden from people, so only bots fill it in */}
                <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="contact-name" className={labelClass}>Your Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            name="name"
                            required
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            placeholder="your name"
                            className={inputClass}
                            value={form.name}
                            onChange={handleChange}
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        />
                        <FieldError id="contact-name-error" message={fieldErrors.name} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="contact-phone" className={labelClass}>Phone / WhatsApp</label>
                        <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            required
                            maxLength={20}
                            pattern="[0-9+()\-\s]{10,20}"
                            title="Enter a phone number with at least 10 digits"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                            className={inputClass}
                            value={form.phone}
                            onChange={handleChange}
                            aria-invalid={Boolean(fieldErrors.phone)}
                            aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                        />
                        <FieldError id="contact-phone-error" message={fieldErrors.phone} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="contact-email" className={labelClass}>
                          Email <span className="normal-case font-normal tracking-normal">(optional)</span>
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            name="email"
                            maxLength={254}
                            autoComplete="email"
                            placeholder="you@gmail.com"
                            className={inputClass}
                            value={form.email}
                            onChange={handleChange}
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        />
                        <FieldError id="contact-email-error" message={fieldErrors.email} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="contact-service" className={labelClass}>Service Interest</label>
                        <div className="relative">
                            <select
                                id="contact-service"
                                name="service"
                                className={`${inputClass} appearance-none cursor-pointer`}
                                value={form.service}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select a service type...</option>
                                {ENQUIRY_SERVICES.map((service) => (
                                  <option key={service.value} value={service.value}>{service.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                        <FieldError id="contact-service-error" message={fieldErrors.service} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="contact-message" className={labelClass}>Project Details</label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        maxLength={2000}
                        placeholder="Tell us about your requirements..."
                        className={`${inputClass} resize-none`}
                        value={form.message}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.message)}
                        aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    ></textarea>
                    <FieldError id="contact-message-error" message={fieldErrors.message} />
                </div>

                {status === 'error' && errorMessage && (
                  <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
                    <p className="flex items-start gap-2 text-sm text-red-200">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      {errorMessage}
                    </p>
                    <WhatsAppQuoteButton
                      message={whatsAppMessage}
                      label="Send on WhatsApp"
                      className="w-full h-11 rounded-full"
                    />
                  </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all duration-300 transform active:scale-[0.98] group disabled:opacity-70 disabled:cursor-wait disabled:hover:bg-white"
                >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {isSlow ? 'Still sending, one moment…' : 'Sending…'}
                      </>
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
