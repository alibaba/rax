import debounce from '../debounce';

const REACH_BOTTOM_DISTANCE = 50; // px
const REACH_BOTTOM_EVENT_NAME = 'reachbottom';
const REACH_BOTTOM_EVENT_DEBOUNCE = 100; // ms

function createCheckReachBottom(window) {
  const { document } = window;

  const dispatchReachBottomEvent = debounce(function dispatchReachBottomEvent() {
    const el = document.body;
    el.dispatchEvent(new CustomEvent(REACH_BOTTOM_EVENT_NAME));
  }, REACH_BOTTOM_EVENT_DEBOUNCE);

  return function(evt) {
    const { innerHeight, pageYOffset } = window;
    const { scrollHeight } = document.body;

    if (pageYOffset > 0) {
      const closeToBottom = scrollHeight - (innerHeight + pageYOffset) <= REACH_BOTTOM_DISTANCE;
      if (closeToBottom) {
        dispatchReachBottomEvent();
      }
    }
  };
}

/**
 * Init reach bottom event.
 * @param win {Window}
 */
export function setupReachBottom(win = window) {
  win.addEventListener('scroll', createCheckReachBottom(win));
}
