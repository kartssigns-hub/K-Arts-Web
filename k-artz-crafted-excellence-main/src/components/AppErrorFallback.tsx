import { buildWhatsAppLink, generalEnquiryMessage } from '@/config/business';

/**
 * Shown when a render error escapes every component. The error itself has
 * already been reported to Sentry by the boundary, so this only needs to keep
 * the visitor from hitting a blank page and give them a way to reach us.
 */
const AppErrorFallback = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
    <h1 className="text-3xl font-bold">Something went wrong</h1>
    <p className="max-w-md text-muted-foreground">
      Please reload the page. If it keeps happening, message us on WhatsApp and we'll help you right away.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
      >
        Reload page
      </button>
      <a
        href={buildWhatsAppLink(generalEnquiryMessage())}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#0b141a]"
      >
        WhatsApp us
      </a>
    </div>
  </div>
);

export default AppErrorFallback;
