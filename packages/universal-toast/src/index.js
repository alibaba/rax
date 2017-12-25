import {isWeex} from 'universal-env';

const LONG_DELAY = 3500; // 3.5 seconds
const SHORT_DELAY = 2000; // 2 seconds

let queue = [];
let isProcessing = false;
let toastWin;

function showToastWindow(message) {
  if (!toastWin) {
    toastWin = document.createElement('div');

    for (let key in styles.container) {
      toastWin.style[key] = styles.container[key];
    }

    document.body.appendChild(toastWin);
  }

  toastWin.style.transform = 'translateX(-50%)';
  toastWin.style.webkitTransform = 'translateX(-50%)';
  toastWin.innerHTML = message;

  // setTimeout(() => {
  //   toastWin.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  // }, 0);
}

function hideToastWindow() {
  if (!toastWin) {
    return;
  }

  setTimeout(() => {
    toastWin.style.transform = 'translateX(-50%) scale(0.8)';
    toastWin.style.webkitTransform = 'translateX(-50%) scale(0.8)';
  }, 0);
}

let toast = {
  push(message, duration) {
    queue.push({
      message,
      duration
    });
    this.show();
  },

  show() {
    // All messages had been toasted already, so remove the toast window,
    if (!queue.length) {
      if (toastWin) {
        toastWin.parentNode.removeChild(toastWin);
      }
      toastWin = null;
      return;
    }

    // the previous toast is not ended yet.
    if (isProcessing) {
      return;
    }
    isProcessing = true;

    let toastInfo = queue.shift();
    showToastWindow(toastInfo.message);
    setTimeout(() => {
      hideToastWindow();
      isProcessing = false;
      setTimeout(() => this.show(), 600);
    }, toastInfo.duration);
  }
};

let Toast = {
  SHORT: SHORT_DELAY,
  LONG: LONG_DELAY,

  /*
   * @param message {String}
   * @param duration {Number}
   * @param userStyle {Object} user defined style
   */
  show(message, duration = SHORT_DELAY) {
    if (isWeex) {
      let weexModal = __weex_require__('@weex-module/modal');

      if (weexModal.toast) {
        weexModal.toast({
          message,
          duration: Number(duration) / 1000,
        });
      }
    } else {
      toast.push(message, duration);
    }
  },
};

let styles = {
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    boxSizing: 'border-box',
    maxWidth: '80%',
    color: '#ffffff',
    padding: '8px 16px',
    position: 'fixed',
    left: '50%',
    bottom: '50%',
    fontSize: '16px',
    lineHeight: '32px',
    fontWeight: '600',
    borderRadius: '4px',
    textAlign: 'center',
    transition: 'all 0.4s ease-in-out',
    webkitTransition: 'all 0.4s ease-in-out',
    transform: 'translateX(-50%)',
    webkitTransform: 'translateX(-50%)',
    zIndex: 9999
  }
};

export default Toast;
