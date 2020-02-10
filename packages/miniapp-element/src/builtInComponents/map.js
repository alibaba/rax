import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'map',
  props: [{
    name: 'longitude',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('longitude'), 10);
      return !isNaN(value) ? value : 39.92;
    },
  }, {
    name: 'latitude',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('latitude'), 10);
      return !isNaN(value) ? value : 116.46;
    },
  }, {
    name: 'scale',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scale'), 10);
      return !isNaN(value) ? value : 16;
    },
  }, {
    name: 'markers',
    get(domNode) {
      const value = domNode.getAttribute('markers');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'polyline',
    get(domNode) {
      const value = domNode.getAttribute('polyline');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'circles',
    get(domNode) {
      const value = domNode.getAttribute('circles');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'controls',
    get(domNode) {
      const value = domNode.getAttribute('controls');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'includePoints',
    get(domNode) {
      const value = domNode.getAttribute('include-points');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'showLocation',
    get(domNode) {
      return !!domNode.getAttribute('show-location');
    },
  }, {
    name: 'polygons',
    get(domNode) {
      const value = domNode.getAttribute('polygons');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'subkey',
    get(domNode) {
      return domNode.getAttribute('subkey') || '';
    },
  }, {
    name: 'layerStyle',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('layer-style'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'rotate',
    get(domNode) {
      return +domNode.getAttribute('rotate') || 0;
    },
  }, {
    name: 'skew',
    get(domNode) {
      return +domNode.getAttribute('skew') || 0;
    },
  }, {
    name: 'enable3D',
    get(domNode) {
      return !!domNode.getAttribute('enable-3D');
    },
  }, {
    name: 'showCompass',
    get(domNode) {
      return !!domNode.getAttribute('show-compass');
    },
  }, {
    name: 'enableOverlooking',
    get(domNode) {
      return !!domNode.getAttribute('enable-overlooking');
    },
  }, {
    name: 'enableZoom',
    get(domNode) {
      const value = domNode.getAttribute('enable-zoom');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'enableScroll',
    get(domNode) {
      const value = domNode.getAttribute('enable-scroll');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'enableRotate',
    get(domNode) {
      return !!domNode.getAttribute('enable-rotate');
    },
  }, {
    name: 'enableSatellite',
    get(domNode) {
      return !!domNode.getAttribute('enable-satellite');
    },
  }, {
    name: 'enableTraffic',
    get(domNode) {
      return !!domNode.getAttribute('enable-traffic');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onMapTap(evt) {
      callSimpleEvent('tap', evt, this.domNode);
    },
    onMapMarkerTap(evt) {
      callSimpleEvent('markertap', evt, this.domNode);
    },
    onMapControlTap(evt) {
      callSimpleEvent('controltap', evt, this.domNode);
    },
    onMapCalloutTap(evt) {
      callSimpleEvent('callouttap', evt, this.domNode);
    },
    onMapUpdated(evt) {
      callSimpleEvent('updated', evt, this.domNode);
    },
    onMapRegionChange(evt) {
      callSimpleEvent('regionchange', evt, this.domNode);
    },
    onMapPoiTap(evt) {
      callSimpleEvent('poitap', evt, this.domNode);
    },
  },
};
