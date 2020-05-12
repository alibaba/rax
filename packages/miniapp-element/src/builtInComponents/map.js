import callSingleEvent from '../events/callSingleEvent';

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
    canBeUserChanged: true,
    get(domNode) {
      return +domNode.getAttribute('rotate') || 0;
    },
  }, {
    name: 'skew',
    canBeUserChanged: true,
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
      callSingleEvent('tap', evt, this);
    },
    onMapMarkerTap(evt) {
      callSingleEvent('markertap', evt, this);
    },
    onMapControlTap(evt) {
      callSingleEvent('controltap', evt, this);
    },
    onMapCalloutTap(evt) {
      callSingleEvent('callouttap', evt, this);
    },
    onMapUpdated(evt) {
      callSingleEvent('updated', evt, this);
    },
    onMapRegionChange(evt) {
      const domNode = this.getDomNodeFromEvt('regionchange', evt);
      if (!domNode) return;

      if (!evt.detail.causedBy) evt.detail.causedBy = evt.causedBy;
      if (evt.type === 'end' || evt.detail.type === 'end') {
        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.rotate = evt.detail.rotate;
        domNode.__oldValues.skew = evt.detail.skew;
      }

      callSingleEvent('regionchange', evt, this);
    },
    onMapPoiTap(evt) {
      callSingleEvent('poitap', evt, this);
    },
  },
};
