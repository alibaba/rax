import { PolymerElement } from '@polymer/polymer';
import debounce from '../../shared/debounce';
import kebabCase from '../../shared/kebabCase';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /(iPhone|iPad|iPod)/.test(ua);
/**
 * HACK: <params> mark changed time to trigger
 * MutationObserver to make native known changes
 */
const DATA_TIMESTAMP = 'data-timestamp';
// Debounce native params update
const NATIVE_UPDATE_DEBOUNCE_TIME = 16;

function createTagWithAttrs(tagName, attrs) {
  let tag = document.createElement(tagName);
  if (typeof attrs === 'object') {
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) tag.setAttribute(key, attrs[key]);
    }
  }
  return tag;
}


/**
 * Initial default style for a-map.
 */
const customStyle = document.createElement('style');
customStyle.innerHTML = 'a-video { display: block; }';
document.head.appendChild(customStyle);

let videoInstanceCount = 0;
export default class NativeVideo extends PolymerElement {
  static get is() {
    return 'a-video';
  }

  static get properties() {
    return {
      src: {
        type: String,
        notify: true,
        observer: '_observeSrc',
      },
      poster: {
        type: String,
        notify: true,
        observer: '_observePoster',
      },
      loop: {
        type: Boolean,
        value: false,
        observer: '_observeLoop',
      },
      autoplay: {
        type: Boolean,
        value: false,
        observer: '_observeAutoplay',
      },
      controls: {
        type: Boolean,
        value: true,
        observer: '_observeControls',
      },
      muted: {
        type: Boolean,
        value: false,
        observer: '_observeMuted',
      },
      objectfit: {
        type: String,
        value: 'contain',
        observer: '_observeObjectfit',
      },
      width: {
        type: String,
      },
      height: {
        type: String
      },
    };
  }

  constructor(...args) {
    super(...args);
    this.uniqueId = String(++videoInstanceCount);
  }

  connectedCallback(...args) {
    super.connectedCallback(args);

    document.addEventListener('WVEmbed.Ready', this._nativeReady);

    this._container = document.createElement('object');
    /**
     * All observers are automaticlly generated.
     */
    Object.keys(NativeVideo.properties).forEach((attr) => {
      this['_observe' + attr[0].toUpperCase() + attr.slice(1)] = debounce((val) => {
        console.log(attr, val);
        this._createOrUpdateParam(attr, val);
      }, NATIVE_UPDATE_DEBOUNCE_TIME);
    });

  }

  ready() {
    super.ready();
    this._createLightDOM();
  }

  /**
   * Create or update a <param>'s prop,
   * cache a <param>'s reference to el.
   */
  _createOrUpdateParam(key, value) {
    const paramRefKey = '__param_ref__' + key;
    const paramRef = this[paramRefKey];

    /**
     * Pass JSON format for Array.
     */
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    if (paramRef) {
      paramRef.setAttribute('value', value);
      paramRef.setAttribute('data-timestamp', Date.now());
      /**
       * NOTE: In android, we should call WindVane to
       * notify native to update param value.
       */
      if (isAndroid) this._updateParamWithAndroid(key, value);
    } else {
      this[paramRefKey] = createTagWithAttrs('param', {
        name: kebabCase(key),
        value,
        'data-timestamp': Date.now(),
      });
      this._container.appendChild(this[paramRefKey]);
    }
    return this[paramRefKey];
  }

  _createLightDOM() {
    const container = this._container;
    container.setAttribute('type', 'application/view');
    container.className = 'atag-native-video';
    /**
     * <object>'s size should equal to shell's bounding.
     */
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.height = '100%';

    /**
     * `viewType` for embedView to recognize type.
     * `bridgeId` for hybird bridge to communicate with element instance.
     */
    container.appendChild(createTagWithAttrs('param', {
      name: 'viewType',
      value: 'wmlVideo',
    }));
    container.appendChild(createTagWithAttrs('param', {
      name: 'bridgeId',
      value: this.getBridgeId(),
    }));

    // const controls = this._controlsParamEl = NativeVideo.createParamTag(
    //   'controls',
    //   !!this.controls
    // );
    // // 1:playing  0：paused
    // const playStatus = this._playStatusParamsEl = NativeVideo.createParamTag(
    //   'playStatus',
    //   '0'
    // );
    //
    // // 1:enterFullscreen; 0：exitFullscreen；-1: do nothing
    // const fullScreenStatus = this._fullscreenParamEl = NativeVideo.createParamTag(
    //   'fullScreenStatus',
    //   '-1'
    // );
    //
    // const loop = this._loopParamEl = NativeVideo.createParamTag(
    //   'loop',
    //   this.loop
    // );
    //
    // // number(1为静音，0为不静音)
    // const muted = this._mutedParamEl = NativeVideo.createParamTag(
    //   'muted',
    //   this.muted ? 1 : 0
    // );
    //
    // // String（contain：包含，fill：填充，cover：覆盖）
    // const objectFit = this._objectFitParamEl = NativeVideo.createParamTag(
    //   'objectFit',
    //   this.objectfit
    // );
    //
    // const poster = this._posterParamEl = NativeVideo.createParamTag(
    //   'videoPoster',
    //   this.poster
    // );
    //
    // const bridgeId = NativeVideo.createParamTag(
    //   'bridgeId',
    //   this.getBridgeId()
    // );
    // container.appendChild(type);
    // container.appendChild(url);
    // container.appendChild(controls);
    // container.appendChild(playStatus);
    // container.appendChild(fullScreenStatus);
    // container.appendChild(loop);
    // container.appendChild(muted);
    // container.appendChild(objectFit);
    // container.appendChild(poster);
    // container.appendChild(bridgeId);

    // for native hack
    // all events triggered at object tag proxyed to this
    container.$$id = this.$$id;

    this.appendChild(container);

    // android should execute setup before play
    // iOS will read src from <params> el
    if (isAndroid && this.src) {
      this._setupAndroid()
    }

    if (this.autoplay) {
      this.play();
    }
  }

  _paramsMap = {};
  _createOrGetParam(param, value) {
    return this._paramsMap[param]
      || (this._paramsMap[param] = NativeVideo.createParamTag(param, value));
  }

  _observeSrc(src) {
    if (isIOS) {
      const srcParamEl = this._createOrGetParam('src', src);
      srcParamEl.setAttribute('value', src);
      srcParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else {
      this._setupAndroid();
    }
  }

  _setupAndroid() {
    this._callNativeControl('setup', {
      videoUrl: this.src,
      isLoop: this.loop,
      poster: this.poster,
      objectFit: this.objectfit,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('WVEmbed.Ready', this._nativeReady);
  }

  getBridgeId() {
    return this.uniqueId;
  }

  //
  // _changePoster(poster) {
  //   if (isIOS && this._posterParamEl) {
  //     this._posterParamEl.setAttribute('value', poster);
  //     this._posterParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
  //   } else if (isAndroid) {
  //     this._callNativeControl('setup', {
  //       videoUrl: this.src,
  //       isLoop: this.loop,
  //       poster,
  //       objectFit: this.objectfit,
  //     });
  //   }
  // }
  //
  // _changeControls(controls) {
  //   if (controls) {
  //     this._showControls();
  //   } else {
  //     this._hideControls();
  //   }
  // }
  //
  // _showControls() {
  //   if (isIOS && this._controlsParamEl) {
  //     this._controlsParamEl.setAttribute('value', 'true');
  //     this._controlsParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
  //   } else if (isAndroid) {
  //     this._callNativeControl('changeControllerStatus', {
  //       status: '1'
  //     });
  //   } else {
  //     console.warn('Controls status params el not exists');
  //   }
  // }
  //
  // _hideControls() {
  //   if (isIOS && this._controlsParamEl) {
  //     this._controlsParamEl.setAttribute('value', 'false');
  //     this._controlsParamEl.setAttribute(DATA_TIMESTAMP, Date.now());
  //   } else if (isAndroid) {
  //     this._callNativeControl('changeControllerStatus', {
  //       status: '0'
  //     });
  //   } else {
  //     console.warn('Controls status params el not exists');
  //   }
  // }

  /**
   * interface play for videoEl
   */
  play() {
    if (isIOS && this._playStatusParamsEl) {
      this._playStatusParamsEl.setAttribute('value', '1');
      this._playStatusParamsEl.setAttribute(DATA_TIMESTAMP, Date.now());
    } else if (isAndroid) {
      this._callNativeControl('play', {
        videoUrl: this.src,
        isLoop: this.loop,
        poster: this.poster,
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
    if (isIOS) {
      this._createOrUpdateParam('playStatus', '0');
    } else if (isAndroid) {
      this._callNativeControl('pause', {});
    }
  }

  mute(isMute = true) {
    const val = isMute ? '1' : '0';
    if (isIOS) {
      // 1 为静音，0 为不静音
      this._createOrUpdateParam('muted', val);
    } else if (isAndroid) {
      this._callNativeControl('muted', { status: val });
    }
  }

  /**
   * stop video play
   */
  stop() {
    if (isIOS) {
      this._createOrUpdateParam('playStatus', '2');
    } else if (isAndroid) {
      this._callNativeControl('stop', {});
    }
  }

  /**
   * interface of entering fullscreen
   */
  requestFullScreen() {
    if (isIOS) {
      this._createOrUpdateParam('fullScreenStatus', '1');
    } else if (isAndroid) {
      this._callNativeControl('enterFullScreen', {});
    }
  }

  /**
   * interface of exiting fullscreen
   */
  exitFullScreen() {
    if (isIOS) {
      this._createOrUpdateParam('fullScreenStatus', '0');
    } else if (isAndroid) {
      this._callNativeControl('exitFullScreen', {});
    }
  }

  enableLoop() {
    this.loop = true;
  }

  disableLoop() {
    this.loop = false;
  }

  isNativeReady = false;
  nativeReadyCallbacks = [];

  _callNativeControl(method, params) {
    const execute = () => {
      window.WindVane.call('WVEmbedView_' + this.getBridgeId(), method, params);
    };
    if (this.isNativeReady) {
      execute();
    } else {
      this.nativeReadyCallbacks.push(execute);
    }
  }

  /**
   * Each embed view will emit whose ready event
   * identifier by param.bridgeId
   */
  _nativeReady = evt => {
    if (evt.param && evt.param.bridgeId === this.getBridgeId()) {
      this.isNativeReady = true;
      let fn;
      while (fn = this.nativeReadyCallbacks.shift()) {
        fn();
      }
    }
  };
}
