export default {
  name: 'map',
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
