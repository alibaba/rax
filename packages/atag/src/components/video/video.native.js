import { PolymerElement } from '@polymer/polymer';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /(iPhone|iPad|iPod)/.test(ua);
/**
 * HACK: <params> mark changed time to trigger
 * MutationObserver to make native known changes
 */
const DATA_TIMESTAMP = 'data-timestamp';

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
      loop: {
        type: Boolean,
        value: false,
      },
      autoplay: {
        type: Boolean,
        value: false,
      },
      controls: {
        type: Boolean,
        value: true
      },
      muted: {
        type: Boolean,
        value: false,
      },
      objectfit: {
        type: String,
        value: 'contain',
      }
    };
  }

  constructor(...args) {
    super(...args);
    this.uniqueId = String(++videoInstanceCount);
  }

  ready() {
    super.ready();

    document.addEventListener('WVEmbed.Ready', this._nativeReady);
    /**
     * Assign default style
     */
    this.style.display = 'block';

    this.createLightDOM();
  }

  createLightDOM() {
    const container = this.container = document.createElement('object');
    container.setAttribute('type', 'application/view');
    container.className = 'atag-native-video';
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.height = '100%';

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

    // number(1为静音，0为不静音)
    const muted = this._mutedParamEl = VideoElement.createParamTag(
      'muted',
      this.muted ? 1 : 0
    );

    // String（contain：包含，fill：填充，cover：覆盖）
    const objectFit = this._objectFitParamEl = VideoElement.createParamTag(
      'objectFit',
      this.objectfit
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
    container.appendChild(muted);
    container.appendChild(objectFit);
    container.appendChild(bridgeId);

    // for native hack
    // all events triggered at object tag proxyed to this
    container.$$id = this.$$id;

    this.appendChild(container);

    // android should execute setup before play
    // iOS will read src from <params> el
    if (isAndroid && this.src) {
      this.callNativeControl('setup', {
        videoUrl: this.src,
        isLoop: this.loop,
        objectFit: this.objectfit
      });
    }

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
        case 'muted': {
          this.mute(newVal);
          break;
        }
        case 'objectfit': {
          this.changeObjectFit(newVal);
          break;
        }
        case 'loop': {
          this.changeLoop(newVal);
          break;
        }
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('WVEmbed.Ready', this._nativeReady);
  }

  getBridgeId() {
    return this.uniqueId;
  }

  showControls() {
    if (isIOS && this._controlsParamEl) {
      this._controlsParamEl.setAttribute('value', 'true');
      this._controlsParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
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
      this._controlsParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
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
      this._playStatusParamsEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('play', {
        videoUrl: this.src,
        isLoop: this.loop,
        objectFit: this.objectfit
      });
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
      this._playStatusParamsEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('pause', {});
    } else {
      console.warn('Play status params el not exists');
    }
  }

  mute(isMute) {
    if (isIOS && this._mutedParamEl) {
      // status(1为静音，0为不静音)
      this._mutedParamEl.setAttribute('value', isMute ? '1' : '0');
      this._mutedParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('muted', { status: isMute ? '1' : '0' });
    } else {
      console.warn('Muted status params el not exists');
    }
  }

  changeObjectFit(objectFit) {
    if (isIOS && this._objectFitParamEl) {
      this._objectFitParamEl.setAttribute('value', objectFit);
      this._objectFitParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('setup', {
        videoUrl: this.src,
        isLoop: this.loop,
        objectFit
      });
    }
  }

  changeLoop(isLoop) {
    if (isIOS && this._objectFitParamEl) {
      this._loopParamEl.setAttribute('value', '' + isLoop);
      this._loopParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('setup', {
        videoUrl: this.src,
        isLoop,
        objectFit: this.objectfit
      });
    }
  }

  /**
   * stop video play
   */
  stop() {
    if (isIOS && this._playStatusParamsEl) {
      this._playStatusParamsEl.setAttribute('value', '2');
      this._playStatusParamsEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('stop', {});
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
      this._fullscreenParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
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
      this._fullscreenParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.callNativeControl('exitFullScreen', {});
    } else {
      console.warn('Fullscreen status params el not exists');
    }
  }

  enableLoop() {
    if (isIOS && this._loopParamEl) {
      this._loopParamEl.setAttribute('value', 'true');
      this._loopParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this.loop = true;
    }
  }
  disableLoop() {
    if (isIOS && this._loopParamEl) {
      this._loopParamEl.setAttribute('value', 'false');
      this._loopParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
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
    param.setAttribute(DATA_TIMESTAMP, Date.now());
    return param;
  }
}
