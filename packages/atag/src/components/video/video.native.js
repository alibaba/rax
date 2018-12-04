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
        nativeAttr: 'url',
      },
      poster: {
        type: String,
        notify: true,
        observer: '_observePoster',
        nativeAttr: 'videoPoster',
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
        nativeAttr: 'playStatus',
        // 1: playing  0：paused
        formatter(val) {
          return val ? '1' : '0';
        },
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
        // 1: muted  0：inmuted
        formatter(val) {
          return val ? '1' : '0';
        },
      },
      objectfit: {
        type: String,
        value: 'contain',
        observer: '_observeObjectfit',
        nativeAttr: 'objectFit',
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
    this._setupAndroid = debounce(this._setupAndroid, NATIVE_UPDATE_DEBOUNCE_TIME);
  }

  connectedCallback(...args) {
    document.addEventListener('WVEmbed.Ready', this._nativeReady);
    this._container = document.createElement('object');

    /**
     * All observers are automaticlly generated.
     */
    Object.keys(NativeVideo.properties).forEach((attr) => {
      this['_observe' + attr[0].toUpperCase() + attr.slice(1)] = debounce((val) => {
        const nativeAttr = NativeVideo.properties[attr].nativeAttr || attr;
        if (NativeVideo.properties[attr].formatter) {
          val = NativeVideo.properties[attr].formatter(val);
        }
        this._createOrUpdateParam(nativeAttr, val);
      }, NATIVE_UPDATE_DEBOUNCE_TIME);
    });

    super.connectedCallback(...args);
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
      paramRef.setAttribute(DATA_TIMESTAMP, Date.now());
      /**
       * NOTE: In android, we should call WindVane to
       * notify native to update param value.
       */
      if (isAndroid) this._updateParamWithAndroid(key, value);
    } else {
      this[paramRefKey] = createTagWithAttrs('param', {
        name: key,
        value,
        [DATA_TIMESTAMP]: Date.now(),
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

    // for native hack
    // all events triggered at object tag proxyed to this
    container.$$id = this.$$id;

    this.appendChild(container);

    // android should execute setup before play
    // iOS will read src from <params> el
    if (isAndroid && this.src) {
      this._setupAndroid();
    }

    if (this.autoplay) {
      this.play();
    }
  }


  _updateParamWithAndroid(key, val) {
    switch (key) {
      // case '':
      //
      //   break;

      // default: this._setupAndroid();
    }
  }

  _observeSrc(src) {
    if (isIOS) {
      this._createOrUpdateParam('src', src);
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

  /**
   * interface play for videoEl
   */
  play() {
    if (isIOS) {
      this._createOrUpdateParam('playStatus', '1');
    } else if (isAndroid) {
      this._callNativeControl('play', {
        videoUrl: this.src,
        isLoop: this.loop,
        poster: this.poster,
        objectFit: this.objectfit
      });
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
  _nativeReady = (evt) => {
    if (this.isNativeReady) return;
    if (evt.param && evt.param.bridgeId === this.getBridgeId()) {
      this.isNativeReady = true;
      let fn;
      while (fn = this.nativeReadyCallbacks.shift()) {
        fn();
      }
    }
  };
}
