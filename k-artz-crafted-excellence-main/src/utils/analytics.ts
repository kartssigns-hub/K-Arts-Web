import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
// OR import.meta.env.VITE_GA_MEASUREMENT_ID for Vite

export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log("GA Initialized");
  } else {
    console.warn("GA Measurement ID is missing");
  }
};

/**
 * Track generic events
 * @param category - The feature (e.g., 'AI Chat', 'Navigation')
 * @param action - The specific action (e.g., 'Submitted Query', 'Clicked Button')
 * @param label - Optional details (e.g., 'Prompt length: 50')
 */
export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

/**
 * Specific wrapper for AI Queries (Your Use Case)
 */
export const trackAIQuery = (queryLength: number) => {
  trackEvent("AI_Chat", "Query_Submitted", `Length: ${queryLength}`);
};