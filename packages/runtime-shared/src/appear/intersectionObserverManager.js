import PolyfilledIntersectionObserver from './IntersectionObserver';

// Shared intersectionObserver instance.
let intersectionObserver;
const IntersectionObserver = (function(window) {
  if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // features are natively supported
    return window.IntersectionObserver;
  } else {
    // polyfilled IntersectionObserver
    return PolyfilledIntersectionObserver;
  }
})(window);
const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.0
};

export function createIntersectionObserver(options = defaultOptions) {
  intersectionObserver = new IntersectionObserver(handleIntersect, options);
}

export function destroyIntersectionObserver() {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
}

export function observerElement(element) {
  if (!intersectionObserver) createIntersectionObserver();

  if (element === document) element = document.documentElement;

  intersectionObserver.observe(element);
}

function handleIntersect(entries) {
  entries.forEach((entry) => {
    const { target, intersectionRatio } = entry;

    // is in view
    if (intersectionRatio > 0) {
      target.dataset.appeared = true;
      target.dispatchEvent(createEvent('appear'));
    } else if (target.dataset.appeared) {
      target.dataset.appeared = false;
      target.dispatchEvent(createEvent('disappear'));
    }
  });
}

function createEvent(eventName) {
  return new CustomEvent(eventName, {
    bubbles: false,
    cancelable: true,
  });
}
