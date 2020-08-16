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
    name: 'include-points',
    get(domNode) {
      const value = domNode.getAttribute('include-points');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'show-location',
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
    name: 'layer-style',
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
    name: 'enable-3D',
    get(domNode) {
      return !!domNode.getAttribute('enable-3D');
    },
  }, {
    name: 'show-compass',
    get(domNode) {
      return !!domNode.getAttribute('show-compass');
    },
  }, {
    name: 'enable-overlooking',
    get(domNode) {
      return !!domNode.getAttribute('enable-overlooking');
    },
  }, {
    name: 'enable-zoom',
    get(domNode) {
      const value = domNode.getAttribute('enable-zoom');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'enable-scroll',
    get(domNode) {
      const value = domNode.getAttribute('enable-scroll');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'enable-rotate',
    get(domNode) {
      return !!domNode.getAttribute('enable-rotate');
    },
  }, {
    name: 'enable-satellite',
    get(domNode) {
      return !!domNode.getAttribute('enable-satellite');
    },
  }, {
    name: 'enable-traffic',
    get(domNode) {
      return !!domNode.getAttribute('enable-traffic');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onMapTap',
    eventName: 'tap'
  },
  {
    name: 'onMapMarkerTap',
    eventName: 'markertap'
  },
  {
    name: 'onMapControlTap',
    eventName: 'controltap'
  },
  {
    name: 'onMapCalloutTap',
    eventName: 'callouttap'
  },
  {
    name: 'onMapUpdated',
    eventName: 'updated'
  },
  {
    name: 'onMapPoiTap',
    eventName: 'poitap'
  }],
  functionalSingleEvents: [
    {
      name: 'onMapRegionChange',
      eventName: 'regionchange',
      middleware(evt, domNode) {
        if (!evt.detail.causedBy) evt.detail.causedBy = evt.causedBy;
      }
    }
  ]
};
