import { PolymerElement } from '@polymer/polymer';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /(iPhone|iPad|iPod)/.test(ua);

let videoInstanceCount = 0;
export default class VideoElement extends PolymerElement {
  static get is() {
    return 'a-video';
  }

  static get properties() {
    return {
      src: {
        type: String,
        notify: true
      },
      poster: {
        type: String,
        notify: true
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      muted: {
        type: Boolean
      },
      loop: {
        type: Boolean
      },
      autoplay: {
        type: Boolean,
        value: false
      },
      controls: {
        type: Boolean
      }
    };
  }

  constructor(...args) {
    super(...args);

    document.addEventListener('WVEmbed.Ready', this._nativeReady);
    this.uniqueId = String(++videoInstanceCount);
  }

  connectedCallback() {
    super.connectedCallback();

    const container = this.container = document.createElement('object');
    container.type = 'application/view';
    container.className = 'atag-native-video';

    const type = VideoElement.createParamTag('viewType', 'wmlVideo');
    const url = VideoElement.createParamTag('url', this.src);
    const controls = this._controlsParamEl = VideoElement.createParamTag(
      'controls',
      this.controls ? 'true' : 'false'
    );
    // 1:playing  0：paused
    const playStatus = this._playStatusParamsEl = VideoElement.createParamTag(
      'playStatus',
      '0'
    );

    // 1:enterFullscreen; 0：exitFullscreen；-1: do nothing
    const fullScreenStatus = this._fullscreenParamEl = VideoElement.createParamTag(
      'fullScreenStatus',
      '-1'
    );

    const loop = this._loopParamEl = VideoElement.createParamTag(
      'loop',
      this.loop
    );

    const bridgeId = VideoElement.createParamTag(
      'bridgeId',
      this.getBridgeId()
    );
    container.appendChild(type);
    container.appendChild(url);
    container.appendChild(controls);
    container.appendChild(playStatus);
    container.appendChild(fullScreenStatus);
    container.appendChild(loop);
    container.appendChild(bridgeId);

    this.setStyle(this.getAttribute('style'));

    // for native hack
    // all events triggered at object tag proxyed to this
    container.$$id = this.$$id;

    this.appendChild(container);

    if (this.autoplay) {
      this.play();
    }
  }

  attributeChangedCallback(key, oldVal, newVal) {
    super.attributeChangedCallback(key, oldVal, newVal);
    if (oldVal !== newVal) {
      switch (key) {
        case 'controls': {
          newVal ? this.showControls() : this.hideControls();
          break;
        }
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('WVEmbed.Ready', this._nativeReady);
  }

  setStyle(style) {
    if (typeof style === 'string') {
      this.container.style.cssText = style;
    }
  }

  getBridgeId() {
    return this.uniqueId;
  }

  showControls() {
    if (isIOS && this._controlsParamEl) {
      this._controlsParamEl.setAttribute('value', 'true');
    } else if (isAndroid) {
      this.callNativeControl('changeControllerStatus', {
        status: '1'
      });
    } else {
      console.warn('Controls status params el not exists');
    }
  }

  hideControls() {
    if (isIOS && this._controlsParamEl) {
      this._controlsParamEl.setAttribute('value', 'false');
    } else if (isAndroid) {
      this.callNativeControl('changeControllerStatus', {
        status: '0'
      });
    } else {
      console.warn('Controls status params el not exists');
    }
  }

  /**
   * interface play for videoEl
   */
  play() {
    if (isIOS && this._playStatusParamsEl) {
      this._playStatusParamsEl.setAttribute('value', '1');
    } else if (isAndroid) {
      this.callNativeControl('play', { videoUrl: this.src, isLoop: this.loop });
    } else {
      console.warn('Play status params el not exists');
    }
  }

  /**
   * interface pause for videoEl
   */
  pause() {
    if (isIOS && this._playStatusParamsEl) {
      this._playStatusParamsEl.setAttribute('value', '0');
    } else if (isAndroid) {
      this.callNativeControl('pause', {});
    } else {
      console.warn('Play status params el not exists');
    }
  }

  /**
   * interface of entering fullscreen
   */
  requestFullScreen() {
    if (isIOS && this._fullscreenParamEl) {
      this._fullscreenParamEl.setAttribute('value', '1');
    } else if (isAndroid) {
      this.callNativeControl('enterFullScreen', {});
    } else {
      console.warn('Fullscreen status params el not exists');
    }
  }

  /**
   * interface of exiting fullscreen
   */
  exitFullScreen() {
    if (isIOS && this._fullscreenParamEl) {
      this._fullscreenParamEl.setAttribute('value', '0');
    } else if (isAndroid) {
      this.callNativeControl('exitFullScreen', {});
    } else {
      console.warn('Fullscreen status params el not exists');
    }
  }

  enableLoop() {
    if (isIOS && this._loopParamEl) {
      this._loopParamEl.setAttribute('value', 'true');
    } else if (isAndroid) {
      this.loop = true;
    }
  }
  disableLoop() {
    if (isIOS && this._loopParamEl) {
      this._loopParamEl.setAttribute('value', 'false');
    } else if (isAndroid) {
      this.loop = false;
    }
  }

  isNativeReady = false;
  nativeReadyCallbacks = [];

  callNativeControl(method, params) {
    const execute = () => {
      window.WindVane.call('WVEmbedView_' + this.getBridgeId(), method, params);
    };
    if (this.isNativeReady) {
      execute();
    } else {
      this.nativeReadyCallbacks.push(execute);
    }
  }

  _nativeReady = evt => {
    this.isNativeReady = true;
    let fn;
    while (fn = this.nativeReadyCallbacks.shift()) {
      fn();
    }
  };

  static createParamTag(key, value) {
    const param = document.createElement('param');
    param.setAttribute('name', key);
    param.setAttribute('value', value);
    return param;
  }
}
