import { PolymerElement } from '@polymer/polymer';
import debounce from '../../shared/debounce';
import kebabCase from '../../shared/kebabCase';

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
        observer: '@scale',
        computed: '_computeScale(scale)',
      },
      markers: {
        type: Array,
        observer: '_observeMarkers',
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
      this['@' + attr] = debounce((val) => {
        this._createOrUpdateParam(attr, val);
      }, 16);
    });
  }

  ready() {
    super.ready();
    this._createLightDOM();
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
    } else {
      this[paramRefKey] = createTagWithAttrs('param', {
        name: kebabCase(key), value,
      });
      this._container.appendChild(this[paramRefKey]);
    }
    return this[paramRefKey];
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
}
