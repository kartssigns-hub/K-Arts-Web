import * as Sentry from '@sentry/react';
import { API_URL } from '@/config/api';

/**
 * Browser error tracking (Sentry) and app logging.
 *
 * Sentry is off unless VITE_SENTRY_DSN is set, and only reports from production
 * builds, so local development never pollutes the issue list.
 */

export const initMonitoring = (): void => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    enabled: import.meta.env.PROD,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    // Vercel exposes the deployed commit to Vite builds, so issues show which deploy introduced them
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    // Continue traces into the backend (which also reports to Sentry) so a slow request shows both halves
    tracePropagationTargets: [API_URL],
    sendDefaultPii: false,
    ignoreErrors: [
      // Benign browser noise, not a bug in the app
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });
};

type LogContext = Record<string, unknown>;

/**
 * Use instead of console.*. Never put names, emails, phone numbers or message
 * text in the context.
 *
 * - debug: development console only
 * - warn:  development console + a Sentry breadcrumb (context for the next error)
 * - error: console + reported to Sentry
 */
export const logger = {
  debug(message: string, context?: LogContext): void {
    if (import.meta.env.DEV) console.debug(message, context ?? '');
  },

  warn(message: string, context?: LogContext): void {
    if (import.meta.env.DEV) console.warn(message, context ?? '');
    Sentry.addBreadcrumb({ level: 'warning', message, data: context });
  },

  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(message, error ?? '', context ?? '');
    Sentry.captureException(error instanceof Error ? error : new Error(message), {
      extra: { message, ...context },
    });
  },
};
