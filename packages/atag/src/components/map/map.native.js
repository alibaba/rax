/* global WindVane */
import { PolymerElement } from '@polymer/polymer';
import debounce from '../../shared/debounce';
import kebabCase from '../../shared/kebabCase';

// Debounce native params update
const NATIVE_UPDATE_DEBOUNCE_TIME = 16;
const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
let nativeInstanceCount = 0;

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
customStyle.innerHTML = 'a-map { display: block; }';
document.head.appendChild(customStyle);

export default class NativeMap extends PolymerElement {
  static get is() {
    return 'a-map';
  }

  static get properties() {
    return {
      longitude: {
        type: Number,
        value: 120.5,
        observer: '_observeLongitude',
      },
      latitude: {
        type: Number,
        value: 30.1,
        observer: '_observeLatitude',
      },
      scale: {
        type: Number,
        value: 16,
        observer: '_observeScale',
        computed: '_computeScale(scale)',
      },
      markers: {
        type: Array,
        observer: '_observeMarkers',
      },
      tileOverlay: {
        type: Object,
        observer: '_observeTileOverlay',
      },
      polyline: {
        type: Array,
        observer: '_observePolyline',
      },
      circles: {
        type: Array,
        observer: '_observeCircles',
      },
      controls: {
        type: Array,
        observer: '_observeControls',
      },
      polygon: {
        type: Array,
        observer: '_observePolygon',
      },
      includePoints: {
        type: Array,
        observer: '_observeIncludePoints',
      },
      showLocation: {
        type: Boolean,
        observer: '_observeShowLocation',
      },
      showMapText: {
        type: Boolean,
        value: true,
        observer: '_observeShowMapText',
      },
      routeStart: {
        type: Object,
        observer: '_observeRouteConfig',
      },
      routeEnd: {
        type: Object,
        observer: '_observeRouteConfig',
      },
      routeColor: {
        type: String,
        observer: '_observeRouteConfig',
      },
      routeWidth: {
        type: Number,
        observer: '_observeRouteConfig',
      },
    };
  }

  constructor() {
    super();

    this.uniqueId = 'map-' + ++nativeInstanceCount;
    this._container = document.createElement('object');

    /**
     * All observers are automaticlly generated.
     */
    Object.keys(NativeMap.properties).forEach((attr) => {
      this['_observe' + attr[0].toUpperCase() + attr.slice(1)] = debounce((val) => {
        this._createOrUpdateParam(attr, val);
      }, NATIVE_UPDATE_DEBOUNCE_TIME);
    });

    this._callNativeUpdate = debounce(this._callNativeUpdate, NATIVE_UPDATE_DEBOUNCE_TIME);
    this._observeRouteConfig = debounce(this._observeRouteConfig, NATIVE_UPDATE_DEBOUNCE_TIME);
  }

  ready() {
    super.ready();
    this._createLightDOM();
  }

  connectedCallback() {
    super.connectedCallback();
    if (isAndroid) {
      document.addEventListener('amap-bridge-event', this._handleAndroidEmbedMapEvent);
      document.addEventListener('WVEmbed.Ready', this._handleWindVaneReady);
    } else if (isIOS) {
      window.addEventListener('embedviewevent', this._handleIOSEmbedMapEvent);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (isAndroid) {
      document.removeEventListener('amap-bridge-event', this._handleAndroidEmbedMapEvent);
      document.removeEventListener('WVEmbed.Ready', this._handleWindVaneReady);
    } else if (isIOS) {
      window.removeEventListener('embedviewevent', this._handleIOSEmbedMapEvent);
    }
  }

  _createLightDOM() {
    const container = this._container;
    container.setAttribute('type', 'application/view');
    container.className = 'atag-native-map';
    /**
     * <object>'s size should equal to shell's bounding.
     */
    container.style.width = '100%';
    container.style.height = '100%';

    /**
     * `viewType` for embedView to recognize type.
     * `bridgeId` for hybird bridge to communicate with element instance.
     */
    container.appendChild(createTagWithAttrs('param', {
      name: 'viewType',
      value: 'wmlAMap',
    }));
    container.appendChild(createTagWithAttrs('param', {
      name: 'bridgeId',
      value: this.uniqueId,
    }));

    this.appendChild(container);
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

  _observeRouteConfig() {
    this._createOrUpdateParam('route-config', {
      'route-start': this.routeStart,
      'route-end': this.routeEnd,
      'route-width': this.routeWidth,
      'route-color': this.routeColor,
    });
  }

  _updatePosition = debounce(() => {
    this._callNativeControl('moveTo', {
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }, NATIVE_UPDATE_DEBOUNCE_TIME);

  _updateParamWithAndroid(key, value) {
    switch (key) {
      case 'longitude':
      case 'latitude':
        this._updatePosition();
        break;

      case 'scale':
        this._callNativeControl('zoomTo', { zoomLevel: value });
        break;

      case 'route-config':
        this._callNativeControl('drawRoute', {
          routeStart: this.routeStart,
          routeEnd: this.routeEnd,
          routeColor: this.routeColor,
          routeWidth: this.routeWidth,
        });
        break;

      /**
       * Others are overlayers above embed map,
       * call update to reset overlayer.
       */
      default:
        this._callNativeUpdate();
    }
  }

  _callNativeUpdate() {
    this._callNativeControl('update', {
      bridgeId: this.uniqueId,
      markers: this.markers,
      polyline: this.polyline,
      circles: this.circles,
      controls: this.controls,
      polygon: this.polygon,
      includePoints: this.includePoints,
      showLocation: this.showLocation,
      showMapText: this.showMapText,
    });
  }


  _handleIOSEmbedMapEvent = (evt) => {
    this._handleEmbedMapData(evt.data.data);
  }

  _handleAndroidEmbedMapEvent = (evt) => {
    this._handleEmbedMapData(evt.param);
  }

  /**
   * Embed map will emit native events through this
   * handler, param's bridgeId to identifier which map
   * instance is, param's eventType points out native
   * event type, one of followings:
   *  onMarkerTap
   *  onCalloutTap
   *  onControlTap
   *  onRegionChange
   *  onTap
   */
  _handleEmbedMapData({ eventType, bridgeId, ...eventDetail }) {
    if (bridgeId === this.uniqueId) {
      // Transform native event name: onRegionChange -> regionchange
      let eventName = eventType.replace(/^on/, '').toLowerCase();
      // All tap event listened will be normalized to click in process.
      if (eventName === 'tap') eventName = 'click';
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
   * Scale level from 5 to 18
   * default to 16.
   */
  _computeScale(scale) {
    if (!scale) {
      return 16;
    } else if (scale < 5) {
      return 5;
    } else if (scale > 18) {
      return 18;
    } else {
      return scale;
    }
  }

  _isWindVaneReady = false;
  _windVaneReadyCallbacks = [];
  /**
   * Each embed view will emit whose ready event
   * identifier by param.bridgeId
   */
  _handleWindVaneReady = (evt) => {
    if (evt.param && evt.param.bridgeId === this.uniqueId) {
      this._isWindVaneReady = true;
      let fn;
      while (fn = this._windVaneReadyCallbacks.shift()) {
        fn();
      }
    }
  };

  _callNativeControl(method, params, successCallback, errorCallback) {
    const execute = () => {
      typeof WindVane !== 'undefined' && WindVane.call(
        'WVEmbedView_' + this.uniqueId,
        method,
        params,
        successCallback,
        errorCallback
      );
    };
    if (this._isWindVaneReady) {
      execute();
    } else {
      this._windVaneReadyCallbacks.push(execute);
    }
  }
}
