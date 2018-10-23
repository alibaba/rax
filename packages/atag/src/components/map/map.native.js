import { PolymerElement } from '@polymer/polymer';
import debounce from '../../shared/debounce';
import kebabCase from '../../shared/kebabCase';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /(iPhone|iPad|iPod)/.test(ua);
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
 * Initial default style for a-map
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
        observer: '@longitude',
      },
      latitude: {
        type: Number,
        value: 30.1,
        observer: '@latitude',
      },
      scale: {
        type: Number,
        value: 16,
        observer: '@scale',
        computed: '_computeScale(scale)',
      },
      markers: {
        type: Array,
        observer: '@markers',
      },
      polyline: {
        type: Array,
        observer: '@polyline',
      },
      circles: {
        type: Array,
        observer: '@circles',
      },
      controls: {
        type: Array,
        observer: '@controls',
      },
      polygons: {
        type: Array,
        observer: '@polygons',
      },
      includePoints: {
        type: Array,
        observer: '@includePoints',
      },
      showLocation: {
        type: Boolean,
        observer: '@showLocation',
      },
      showMapText: {
        type: Boolean,
        value: true,
        observer: '@showMapText',
      },
      routeStart: {
        type: Object,
        observer: '@routeStart',
      },
      routeEnd: {
        type: Object,
        observer: '@routeEnd',
      },
      routeColor: {
        type: String,
        observer: '@routeColor',
      },
      routeWidth: {
        type: Number,
        observer: '@routeWidth',
      },
    };
  }

  constructor() {
    super();

    this.uniqueId = 'map-' + ++nativeInstanceCount;
    this._container = document.createElement('object');

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
    container.style.width = '100%';
    container.style.height = '100%';

    const viewType = createTagWithAttrs('param', {
      name: 'viewType',
      value: 'wmlAMap',
    });
    container.appendChild(viewType);
    container.appendChild(createTagWithAttrs('param', {
      name: 'bridgeId',
      value: this.uniqueId,
    }));

    this.appendChild(container);
  }

  _createOrUpdateParam(key, value) {
    const paramRefKey = '_tag@' + key;
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
