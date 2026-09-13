import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WhatsAppQuoteButton from '@/components/catalog/WhatsAppQuoteButton';
import { BUSINESS, generalEnquiryMessage } from '@/config/business';

/**
 * Primary lead-capture band. Appears at the foot of the homepage and every
 * catalog page — the moment a visitor has browsed enough to have a question.
 */
const RequirementCta = () => (
  <section
    id="get-quote"
    aria-labelledby="requirement-cta-heading"
    className="relative overflow-hidden border-y border-border bg-card py-16 md:py-20"
  >
    <div
      className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      aria-hidden="true"
    />

    <div className="container relative mx-auto px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <h2
            id="requirement-cta-heading"
            className="text-3xl font-bold leading-tight text-foreground md:text-4xl"
          >
            Not sure what you need?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Send us your requirement and our team will suggest the right signage
            solution for your business.
          </p>

          <a
            href={BUSINESS.phoneHref}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Or call us on {BUSINESS.phone}
          </a>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
          <WhatsAppQuoteButton
            message={generalEnquiryMessage()}
            label="Send Requirement on WhatsApp"
            size="lg"
            className="h-12 rounded-full px-7"
          />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-border px-7 hover:border-accent hover:bg-transparent hover:text-accent"
          >
            <Link to="/contact">
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default RequirementCta;
