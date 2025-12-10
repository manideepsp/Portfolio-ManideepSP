// ScrollReveal wrapper safe for client usage when served from `public/`.
// This file is copied to `public/lib/sr.js` so it can be loaded directly
// from the published site (and respects GitHub Pages base paths).

export function srConfig(delay = 0, distance = '20px', origin = 'bottom', duration = 600) {
  return { delay, distance, origin, duration };
}

export const sr = {
  async reveal(el, config = {}) {
    if (!el) return;

    if (NodeList.prototype.isPrototypeOf(el) || Array.isArray(el)) {
      Array.from(el).forEach((node, i) => {
        const extra = typeof config.delay === 'number' ? config.delay + i * 30 : i * 30;
        sr.reveal(node, { ...config, delay: extra });
      });
      return;
    }

    if (typeof window === 'undefined') return;

    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/scrollreveal@4.0.9/dist/scrollreveal.es.js');
      const ScrollReveal = mod.default || mod.ScrollReveal || mod;
      const srInstance = (typeof ScrollReveal === 'function') ? ScrollReveal() : (ScrollReveal && ScrollReveal.ScrollReveal ? ScrollReveal.ScrollReveal() : null);
      srInstance.reveal(el, {
        delay: config.delay || 0,
        distance: config.distance || '20px',
        origin: config.origin || 'bottom',
        duration: config.duration || 600,
        easing: 'cubic-bezier(.22,.9,.35,1)',
        opacity: 0,
        mobile: true,
        cleanup: true,
      });
    } catch (e) {
      setTimeout(() => {
        try {
          el.classList.add('sr-reveal');
          el.classList.remove('sr-initial');
        } catch (err) { }
      }, config.delay || 0);
    }
  },
};

export default sr;
