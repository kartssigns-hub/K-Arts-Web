import { Button, type ButtonProps } from '@/components/ui/button';
import { buildWhatsAppLink } from '@/config/business';
import { cn } from '@/lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

/**
 * Opens WhatsApp with a prefilled enquiry — WhatsApp Web on desktop, the app
 * on mobile. The message is always passed in by the caller so it can name the
 * specific product the customer was looking at.
 */

interface WhatsAppQuoteButtonProps extends Omit<ButtonProps, 'asChild' | 'onClick'> {
  message: string;
  label?: string;
  /** Green WhatsApp treatment; otherwise inherits the given Button variant. */
  branded?: boolean;
  showIcon?: boolean;
}

const WhatsAppQuoteButton = ({
  message,
  label = 'Get Quote on WhatsApp',
  branded = true,
  showIcon = true,
  className,
  variant,
  ...props
}: WhatsAppQuoteButtonProps) => (
  <Button
    asChild
    variant={branded ? 'default' : variant}
    className={cn(
      branded &&
        'bg-[#25D366] text-[#0b141a] hover:bg-[#1ebe5b] focus-visible:ring-[#25D366]',
      className,
    )}
    {...props}
  >
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — opens WhatsApp`}
    >
      {showIcon && <WhatsAppIcon className="h-4 w-4" />}
      {label}
    </a>
  </Button>
);

export default WhatsAppQuoteButton;
