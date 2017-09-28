const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.0
};
let appearEvt, disappearEvt;
let intersectionObserver;

function initIntersection() {
  appearEvt = document.createEvent('HTMLEvents');
  disappearEvt = document.createEvent('HTMLEvents');
  appearEvt.initEvent('appear', false, true);
  disappearEvt.initEvent('disappear', false, true);

  intersectionObserver = new IntersectionObserver(handleIntersect, options);
}

function handleIntersect(entries) {
  entries.forEach((entry) => {
    const { target, boundingClientRect, intersectionRatio } = entry;

    // is inview
    if (intersectionRatio > 0) {
      target.dataset.appeared = true;
      target.dispatchEvent(appearEvt);
    } else if (target.dataset.appeared) {
      target.dataset.appeared = false;
      target.dispatchEvent(disappearEvt);
    }
  });
}

export function observerElement(element) {
  intersectionObserver.observe(element);
}

export function isExistIntersection() {
  return typeof IntersectionObserver === 'function';
}

export default function createIntersectionObserver() {
  initIntersection();
}
