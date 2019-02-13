import { PolymerElement } from '@polymer/polymer';
import debounce from './debounce';
import { isAndroid, isIOS } from './device';

const DATA_TIMESTAMP = 'data-timestamp';
/**
 * Debounce native params update.
 */
const NATIVE_UPDATE_DEBOUNCE_TIME = 16;

/**
 * Debug output.
 */
const DEBUG_MESSAGE_PREFIX = '[CompositeRenderDebug]';
function debug(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(DEBUG_MESSAGE_PREFIX, ...args);
  }
}

/**
 * @Note In iOS, embed event will be fired to window; in android is document.
 */
const embedEventTarget = isIOS ? window : document;

/**
 * Mapping types.
 * Built-in references without a dependency on `root`.
 */
const TypeMap = {
  string: String,
  number: Number,
  boolean: Boolean,
  array: Array,
  object: Object,
};

/**
 * Register composite render by config.
 * @param config
 * @return {void}
 */
export function registerCompositeRender(config) {
  if (Array.isArray(config)) {
    config.forEach(c => registerCompositeRender(c));
    return;
  }

  const klass = compositeClassFactory(config);
  customElements.define(klass.is, klass);
  /**
   * Initial default style for a-map.
   */
  const customStyle = document.createElement('style');
  customStyle.innerHTML = `${config.tag} { display: block; }`;
  document.head.appendChild(customStyle);

  debug('Define', klass.is, 'with config:', config);
}

/**
 * Create a tag with attributes.
 * @param tagName {String} Tag name.
 * @param attrs {Object} Tag attrs.
 * @return {HTMLElement}
 */
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
 * Directly call windvane.
 * @Note not recommended.
 * @param bridgeId {String} Unique id of tag instance.
 * @param method {String}
 * @param params {Object}
 */
function callWindVane(bridgeId, method, params) {
  try {
    window.WindVane.call('WVEmbedView_' + bridgeId, method, params);
  } catch (error) {
    debug('Error while calling windvane, bridgeId: %s, method: %s, params: %o', bridgeId, method, params);
    throw error;
  }
}

/**
 * Factory of composite render tag element.
 * @param config {Object} Config of composite render.
 * @return Class
 */
function compositeClassFactory(config) {
  const props = {};
  const originalProps = config.properties || {};
  const propKeys = Object.keys(originalProps);
  for (let i = 0, l = propKeys.length; i < l; i ++) {
    const key = propKeys[i];
    const { type, value, nativeAttr } = originalProps[key];
    props[key] = {
      type: TypeMap[type],
      value,
      observer: '_observe' + key,
      nativeAttr: nativeAttr || key,
    };
  }
  let instanceCount = 0;
  return class CompositeRenderTag extends PolymerElement {
    static get is() {
      return config.tag;
    }

    static get properties() {
      return props;
    }

    constructor() {
      super();
      this._id = config.tag + '_' + ++instanceCount;
    }

    connectedCallback() {
      embedEventTarget.addEventListener('embedviewevent', this._handleEmbedMapEvent);

      if (isAndroid) {
        document.addEventListener('WVEmbed.Ready', this._handleNativeReady);
      }
      this._container = document.createElement('object');
      this._createLightDOM();
      /**
       * All observers are automaticlly generated.
       */
      for (let i = 0, l = propKeys.length; i < l; i++) {
        const key = propKeys[i];
        this['_observe' + key] = debounce((val) => {
          const nativeAttr = props[key].nativeAttr;
          this._createOrUpdateParam(nativeAttr, val);
        }, NATIVE_UPDATE_DEBOUNCE_TIME);
      }

      super.connectedCallback();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      embedEventTarget.removeEventListener('embedviewevent', this._handleEmbedMapEvent);
      if (isAndroid) {
        document.removeEventListener('WVEmbed.Ready', this._handleNativeReady);
      }
    }

    _createLightDOM() {
      const container = this._container = document.createElement('object');
      container.setAttribute('type', 'application/view');
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
        value: config.viewType,
      }));
      container.appendChild(createTagWithAttrs('param', {
        name: 'bridgeId',
        value: this._id,
      }));

      // for native hack
      // all events triggered at object tag proxyed to this
      container.$$id = this.$$id;

      // Reset innerHTML if exists
      this.innerHTML = '';
      this.appendChild(container);
    }

    _handleEmbedMapEvent = (evt) => {
      let data = isIOS ? evt.data.data : evt.param;
      this._handleEmbedMapData(data);
    }

    _handleEmbedMapData({ eventType, bridgeId, ...eventDetail }) {
      if (bridgeId === this._id) {
        let eventName = eventType.replace(/^on/, '').toLowerCase();
        this._dispatchEvent(eventName, eventDetail);
      }
    }

    _dispatchEvent(eventName, detail) {
      this.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail,
      }));
    }

    /**
     * Create or update a <param>'s prop,
     * cache a <param>'s reference to el.
     */
    _createOrUpdateParam(key, value) {
      // Pass JSON format for Array or Plain-Object.
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      // Unique key to cache ref to element.
      const paramKey = '__param_ref__' + key;
      let paramEl = this[paramKey];
      if (!paramEl) {
        paramEl = this[paramKey] = createTagWithAttrs('param', { name: key });
        this._container.appendChild(paramEl);
      }

      paramEl.setAttribute('value', value);
      paramEl.setAttribute(DATA_TIMESTAMP, Date.now());

      return paramEl;
    }

    _isNativeReady = false;
    _windVaneReadyCallbacks = [];
    _callNativeControl(method, params) {
      if (this._isNativeReady) {
        callWindVane(this._id, method, params);
      } else {
        this._windVaneReadyCallbacks.push(callWindVane.bind(window, this._id, method, params));
      }
    }
    /**
     * Each embed view will emit whose ready event
     * identifier by param.bridgeId
     */
    _handleNativeReady = (evt) => {
      if (evt.param && evt.param.bridgeId === this._id) {
        this._isNativeReady = true;
        let fn;
        while (fn = this._windVaneReadyCallbacks.shift()) fn();
      }
    };
  };
}


