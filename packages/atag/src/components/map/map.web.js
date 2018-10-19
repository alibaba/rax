import { PolymerElement } from '@polymer/polymer';

const API_KEY = 'f8da82225187d49348c217617a564ed0';
const API_SRC = `https://webapi.amap.com/maps?v=1.4.7&key=${API_KEY}`;

let cbs = [];
function mapReady(callback) {
  if (typeof AMap !== 'undefined') {
    callback();
  } else {
    cbs.push(callback);
  }
}

let uid = 0;

export default class MapElement extends PolymerElement {
  static get is() {
    return 'a-map';
  }

  static get properties() {
    return {
      /**
       * Center longitude
       */
      longitude: {
        type: Number,
        notify: true,
        value: 120.0208958,
        observer: '_longitudeChange'
      },
      /**
       * Center latitude
       */
      latitude: {
        type: Number,
        notify: true,
        value: 30.2819823,
        observer: '_latitudeChange'
      },
      /**
       * scale -> zoom
       */
      scale: {
        type: Number,
        notify: true,
        value: 10,
        observer: '_scaleChange'
      },
      resizeEnable: {
        type: Boolean,
        notify: true,
        value: true
      },

      makers: {
        type: Array,
        notify: true,
        value: true,
        observer: '_makersChange'
      }
    };
  }

  constructor(...args) {
    super(...args);
    /**
     *  load amap js
     */
    if (typeof AMap === 'undefined') {
      const script = document.createElement('script');
      script.onload = () => {
        for (let i = 0, l = cbs.length; i < l; i++) {
          cbs[i].call(this);
        }
      };
      document.body.appendChild(script);
      script.src = API_SRC;
    }
    this.uid = ++uid;

    const div = document.createElement('div');
    this.mapEl = div;
    div.id = 'map' + this.uid;
  }

  _longitudeChange(val) {
    if (this.map) {
      this.map.setCenter(new AMap.LngLat(val, this.latitude));
    }
  }
  _latitudeChange(val) {
    if (this.map) {
      this.map.setCenter(new AMap.LngLat(this.longitude, val));
    }
  }
  _scaleChange(val) {
    if (this.map) {
      this.map.setZoom(val);
    }
  }
  _makersChange(makers) {
    if (this.map) {
      for (let i = 0, l = makers.length; i < l; i++) {
        const [lng, lat] = makers[i].position;
        const marker = new AMap.Marker({
          position: new AMap.LngLat(lng, lat),
          title: makers[i].title
        });

        this.map.add([marker]);
      }
    }
  }

  get zoom() {
    return parseInt(this.getAttribute('zoom'), 10) || 10;
  }

  ready() {
    super.ready();
    const style = this.getAttribute('style') || 'height:250px';
    this.appendChild(this.mapEl);
    this._createStyle(style);

    mapReady(() => {
      this.map = new AMap.Map(this.mapEl, {
        resizeEnable: this.resizeEnable,
        zoom: this.scale,
        center: [this.longitude, this.latitude]
      });

      this._initPlugins(this.map);
      this._bindEvents();
    });
  }

  _createStyle(css) {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `#${this.mapEl.id} {${css}}`;
    this.appendChild(styleEl);
  }

  /**
   * init map
   */
  _initPlugins(map) {
    // todo plugin
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
      // async load
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
      var scale = new AMap.Scale();
      map.addControl(scale);
    });
  }

  _clickHandler = evt => {
    const customEvt = new CustomEvent('click', {
      detail: {
        lnglat: evt.lnglat,
        pixel: evt.pixel
      }
    });
    this.dispatchEvent(customEvt);
  };

  _bindEvents() {
    if (this.map) {
      this.map.on('click', this._clickHandler);
    }
  }

  _unbindEvents() {
    if (this.map) {
      this.map.off('click', this._clickHandler);
    }
  }
}

