import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * The Home & Name Plates banner photo, with the visitor's name lettered onto
 * the blank plate in it.
 *
 * Everything here is measured off `/background_banner/nameplate_banner.webp`
 * and is valid only for that photo:
 *
 * - The plate is shot at an angle, so a flat text box has to be projected onto
 *   its face. TEXT_PLANE.matrix is that homography (a 513x283 box mapped onto
 *   the plate's four corners) — it is what makes the name read as engraved into
 *   the metal instead of pasted over the picture.
 * - The box sits in the plate's free area: left of the leaf motif, above the
 *   engraved light line. Long names scale down so they never run into either.
 *
 * The banner is displayed like `object-cover / object-position: right`, which
 * crops differently at every window size. Rather than fight that, we reproduce
 * the cover maths ourselves and lay the photo out at its natural size inside a
 * scaled stage — so the lettering stays welded to the plate as the page resizes.
 */

const PHOTO = { src: '/background_banner/nameplate_banner.webp', width: 1717, height: 916 };

const TEXT_PLANE = {
  width: 513,
  height: 283,
  matrix:
    'matrix3d(-0.068304, -0.160961, 0, -0.000246146, 0.067765, 0.371521, 0, 0.000044061, 0, 0, 1, 0, 1378.758, 378.573, 0, 1)',
  /** Font size in photo pixels; scaled with everything else. */
  fontSize: 152,
  /** Keep a hair of breathing room inside the plate's free area. */
  safeWidth: 0.98,
  /**
   * Letters are drawn taller than the font sets them, the way signage
   * lettering is: it fills the plate's height without eating the width the
   * name needs.
   */
  stretch: 1.45,
};

const PLACEHOLDER = 'Your Name';

interface NamePlateBannerProps {
  /** Rendered on the plate. Empty shows a faded prompt instead. */
  name: string;
}

const NamePlateBanner = ({ name }: NamePlateBannerProps) => {
  const trimmed = name.trim();
  const lettering = trimmed || PLACEHOLDER;

  // --- object-cover, done by hand so we know where the plate landed ---
  const frameRef = useRef<HTMLDivElement>(null);
  const [cover, setCover] = useState({ scale: 1, x: 0, y: 0 });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const fit = (width: number, height: number) => {
      const scale = Math.max(width / PHOTO.width, height / PHOTO.height);
      setCover({
        // Anchored right, centred vertically — object-position: right center.
        x: width - PHOTO.width * scale,
        y: (height - PHOTO.height * scale) / 2,
        scale,
      });
    };

    // Measured before first paint so the photo never flashes at natural size.
    const { width, height } = frame.getBoundingClientRect();
    fit(width, height);

    const observer = new ResizeObserver(([entry]) =>
      fit(entry.contentRect.width, entry.contentRect.height),
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // --- shrink long names to the plate ---
  // Ancestor transforms don't touch layout metrics, so offsetWidth is always
  // the untransformed width and one measurement is enough — no feedback loop.
  const textRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState(1);

  const measure = () => {
    const width = textRef.current?.offsetWidth;
    if (!width) return;
    setFit(Math.min(1, (TEXT_PLANE.width * TEXT_PLANE.safeWidth) / width));
  };

  useLayoutEffect(measure, [lettering]);

  // Montserrat generally arrives after first paint; re-measure once it has.
  useEffect(() => {
    document.fonts?.ready.then(measure).catch(() => undefined);
  }, []);

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: PHOTO.width,
          height: PHOTO.height,
          transform: `translate(${cover.x}px, ${cover.y}px) scale(${cover.scale})`,
        }}
      >
        <img
          src={PHOTO.src}
          alt=""
          width={PHOTO.width}
          height={PHOTO.height}
          fetchPriority="high"
          className="block max-w-none"
        />

        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: TEXT_PLANE.width,
            height: TEXT_PLANE.height,
            transform: TEXT_PLANE.matrix,
            // Lets the glow bloom into the metal instead of sitting on it.
            mixBlendMode: 'screen',
          }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <span
              ref={textRef}
              className="whitespace-nowrap font-semibold uppercase leading-none"
              style={{
                fontSize: TEXT_PLANE.fontSize,
                letterSpacing: '0.06em',
                // Offsets the trailing letter-space so the word stays centred.
                textIndent: '0.06em',
                color: '#ffdcae',
                opacity: trimmed ? 1 : 0.4,
                textShadow:
                  '0 0 6px rgba(255,178,96,0.55), 0 0 24px rgba(255,146,54,0.45), 0 0 64px rgba(255,132,40,0.35)',
                transform: `scale(${fit}, ${fit * TEXT_PLANE.stretch})`,
                transition: 'opacity 200ms ease',
              }}
            >
              {lettering}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamePlateBanner;
