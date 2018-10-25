/* global WindVane */
import { PolymerElement } from '@polymer/polymer';
import debounce from '../../shared/debounce';
import kebabCase from '../../shared/kebabCase';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
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
      polylines: {
        type: Array,
        observer: '_observePolylines',
      },
      circles: {
        type: Array,
        observer: '_observeCircles',
      },
      controls: {
        type: Array,
        observer: '_observeControls',
      },
      polygons: {
        type: Array,
        observer: '_observePolygons',
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
        observer: '_observeRouteStart',
      },
      routeEnd: {
        type: Object,
        observer: '_observeRouteEnd',
      },
      routeColor: {
        type: String,
        observer: '_observeRouteColor',
      },
      routeWidth: {
        type: Number,
        observer: '_observeRouteWidth',
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
      }, 16);
    });
  }

  ready() {
    super.ready();
    this._createLightDOM();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('amap-bridge-event', this._handleEmbedMapEvent);
    if (isAndroid) document.addEventListener('WVEmbed.Ready', this._handleWindVaneReady);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('amap-bridge-event', this._handleEmbedMapEvent);
    if (isAndroid) document.removeEventListener('WVEmbed.Ready', this._handleWindVaneReady);
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
      /**
       * NOTE: In android, we should call WindVane to
       * notify native to update param value.
       */
      if (isAndroid) this._updateParamWithAndroid(key, value);
    } else {
      this[paramRefKey] = createTagWithAttrs('param', {
        name: kebabCase(key), value,
      });
      this._container.appendChild(this[paramRefKey]);
    }
    return this[paramRefKey];
  }

  _updateParamWithAndroid(key, value) {
    switch (key) {
      case 'longitude':
      case 'latitude':
        this._callNativeControl('moveTo', {
          latitude: this.latitude,
          longitude: this.longitude,
        });
        break;

      case 'scale':
        this._callNativeControl('zoomTo', { zoomLevel: value });
        break;

      case 'routeStart':
      case 'routeEnd':
      case 'routeColor':
      case 'routeWidth':
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
        this._callNativeControl('update', {
          markers: this.markers,
          polylines: this.polylines,
          circles: this.circles,
          controls: this.controls,
          polygons: this.polygons,
          includePoints: this.includePoints,
          showLocation: this.showLocation,
          showMapText: this.showMapText,
        });
    }
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
  _handleEmbedMapEvent = (evt) => {
    const { param } = evt;
    const { eventType, bridgeId, ...eventDetail } = param;
    if (bridgeId === this.uniqueId) {
      // Transform native event name: onRegionChange -> regionchange
      const eventName = eventType.replace(/^on/, '').toLowerCase();
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
