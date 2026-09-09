/* -------------------------------------------------------------------------- */
/* Google Analytics 4 / Google Tag Manager bootstrap.                          */
/*                                                                             */
/* Nothing is loaded unless an ID is provided at build time:                   */
/*   VITE_GTM_ID             → loads Google Tag Manager (GTM-XXXXXXX)           */
/*   VITE_GA_MEASUREMENT_ID  → loads gtag.js directly (G-XXXXXXXXXX)            */
/* If both are set, GTM wins — configure the GA4 tag inside the container      */
/* instead of double-counting. IDs live in `.env.local` locally and in         */
/* GitHub repository variables for the Pages build (see deploy.yml).           */
/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined)?.trim() || undefined;
const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || undefined;

let initialized = false;

export const analyticsEnabled = Boolean(GTM_ID || GA_ID);

export const initAnalytics = (): void => {
  if (initialized || typeof window === "undefined" || !analyticsEnabled) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];

  if (GTM_ID) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
    document.head.appendChild(script);
    return;
  }

  if (GA_ID) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);

    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    /* send_page_view: false — the router reports page views so SPA navigations count. */
    window.gtag("config", GA_ID, { send_page_view: false });
  }
};

/** Report a (virtual) page view. Called by the router on every location change. */
export const trackPageView = (path: string): void => {
  if (!analyticsEnabled || typeof window === "undefined") return;
  const payload = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  };
  if (GTM_ID) {
    window.dataLayer?.push({ event: "page_view", ...payload });
  } else if (window.gtag) {
    window.gtag("event", "page_view", payload);
  }
};

/** Report a custom interaction, e.g. trackEvent("experience_open", { slug }). */
export const trackEvent = (name: string, params: Record<string, unknown> = {}): void => {
  if (!analyticsEnabled || typeof window === "undefined") return;
  if (GTM_ID) {
    window.dataLayer?.push({ event: name, ...params });
  } else if (window.gtag) {
    window.gtag("event", name, params);
  }
};
