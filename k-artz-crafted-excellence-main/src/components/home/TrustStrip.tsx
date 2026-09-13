import { Gem, PencilRuler, Truck, Wrench } from 'lucide-react';

const usps = [
  {
    icon: Gem,
    title: 'Premium Quality',
    description: 'Materials that hold up outdoors',
  },
  {
    icon: PencilRuler,
    title: 'Custom Designs',
    description: 'Made for your space and brand',
  },
  {
    icon: Truck,
    title: 'On-time Delivery',
    description: 'Committed timelines, kept',
  },
  {
    icon: Wrench,
    title: 'Expert Installation',
    description: 'Fitted and finished by our team',
  },
];

/** One pass of the USP list; duplicated inside the track for a seamless loop. */
const UspGroup = ({ hidden = false }: { hidden?: boolean }) => (
  <ul
    aria-hidden={hidden || undefined}
    className="flex min-w-[100vw] shrink-0 items-center justify-around"
  >
    {usps.map((usp) => (
      <li key={usp.title} className="flex shrink-0 items-start gap-3 px-6 md:px-10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
          <usp.icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="whitespace-nowrap text-sm font-bold leading-tight text-foreground md:text-base">
            {usp.title}
          </h3>
          <p className="mt-1 whitespace-nowrap text-xs leading-snug text-muted-foreground md:text-sm">
            {usp.description}
          </p>
        </div>
      </li>
    ))}
  </ul>
);

/** Credibility strip sitting directly beneath the hero, scrolling left to right. */
const TrustStrip = () => (
  <section aria-label="Why choose K'artz" className="border-y border-border bg-card/50">
    <div className="group relative overflow-hidden py-10 md:py-12">
      <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <UspGroup />
        <UspGroup hidden />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent md:w-24" />
    </div>
  </section>
);

export default TrustStrip;
