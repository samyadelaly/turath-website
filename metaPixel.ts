/**
 * Meta Pixel (Facebook & Instagram) Integration Utility for TURATH
 * 
 * Prepares standard Meta events without exposing credentials.
 * Utilizes import.meta.env.VITE_META_PIXEL_ID.
 * If VITE_META_PIXEL_ID is not configured, the website remains 100% functional
 * and all tracking functions safely and silently no-op.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

let isPixelInitialized = false;

/**
 * Safely initialize Meta Pixel if VITE_META_PIXEL_ID is provided.
 */
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (isPixelInitialized) return;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId || typeof pixelId !== 'string' || !pixelId.trim()) {
    // Pixel ID not configured yet; operate gracefully in dormant mode
    return;
  }

  const cleanPixelId = pixelId.trim();

  // Standard Meta Pixel snippet injection
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    }
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  if (window.fbq) {
    window.fbq('init', cleanPixelId);
    window.fbq('track', 'PageView');
    isPixelInitialized = true;
  }
}

/**
 * Track PageView event
 */
export function trackPageView(): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export interface ViewContentParams {
  id: string;
  name: string;
  category?: string;
  price?: string | number;
  currency?: string;
}

/**
 * Track ViewContent when a product page / detail view is loaded
 */
export function trackViewContent(params: ViewContentParams): void {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData: Record<string, any> = {
      content_ids: [params.id],
      content_name: params.name,
      content_type: 'product',
    };

    if (params.category) {
      eventData.content_category = params.category;
    }

    if (params.price) {
      const numPrice = typeof params.price === 'number' ? params.price : parseFloat(params.price);
      if (!isNaN(numPrice) && numPrice > 0) {
        eventData.value = numPrice;
        eventData.currency = params.currency || 'USD';
      }
    }

    window.fbq('track', 'ViewContent', eventData);
  }
}

export interface ContactEventParams {
  method: 'whatsapp' | 'email_form' | 'phone';
  productName?: string;
  productId?: string;
  category?: string;
}

/**
 * Track Contact / Lead when a real customer inquiry is triggered
 * (e.g., clicking WhatsApp inquiry or submitting the inquiry contact form)
 */
export function trackContact(params: ContactEventParams): void {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData: Record<string, any> = {
      content_category: params.category || 'General Inquiry',
      content_name: params.productName || 'Custom Consultation',
      inquiry_method: params.method,
    };

    if (params.productId) {
      eventData.content_ids = [params.productId];
    }

    // Trigger standard Contact event
    window.fbq('track', 'Contact', eventData);
    // Also trigger standard Lead event for high-intent architectural consultation requests
    window.fbq('track', 'Lead', eventData);
  }
}
