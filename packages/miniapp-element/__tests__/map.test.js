const _ = require('./utils');

test('map', async() => {
  const page = global.$$page;
  const componentId = _.load({
    template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
    usingComponents: {
      element: _.elementId,
    },
  }, 'page');
  const component = _.render(componentId);

  const wrapper = document.createElement('wrapper');
  document.body.appendChild(wrapper);
  component.attach(wrapper);
  expect(_.match(component.dom, `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`)).toBe(true);

  const body = component.querySelector('.h5-body');
  const node = page.document.createElement('wx-component');
  node.setAttribute('behavior', 'map');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const map = body.querySelector('.h5-wx-component');

  // longitude
  await _.checkNumber(map, node, 'longitude', 'longitude', 39.92);

  // latitude
  await _.checkNumber(map, node, 'latitude', 'latitude', 116.46);

  // scale
  await _.checkNumber(map, node, 'scale', 'scale', 16);

  // markers
  await _.checkArray(map, node, 'markers', 'markers', [], [{
    iconPath: '/resources/others.png',
    id: 0,
    latitude: 23.099994,
    longitude: 113.324520,
    width: 50,
    height: 50,
  }]);

  // polyline
  await _.checkArray(map, node, 'polyline', 'polyline', [], [{
    points: [{
      longitude: 113.3245211,
      latitude: 23.10229,
    }, {
      longitude: 113.324520,
      latitude: 23.21229,
    }],
    color: '#FF0000DD',
    width: 2,
    dottedLine: true,
  }]);

  // circles
  await _.checkArray(map, node, 'circles', 'circles', [], [{
    latitude: 23.10229,
    longitude: 113.3245211,
    color: '#FF0000DD',
    radius: 15,
  }]);

  // controls
  await _.checkArray(map, node, 'controls', 'controls', [], [{
    id: 1,
    iconPath: '/resources/location.png',
    position: {
      left: 0,
      top: 300 - 50,
      width: 50,
      height: 50,
    },
    clickable: true,
  }]);

  // includePoints
  await _.checkArray(map, node, 'includePoints', 'include-points', [], [{
    longitude: 113.3245211,
    latitude: 23.10229,
  }]);

  // showLocation
  await _.checkBoolean(map, node, 'showLocation', 'show-location', false);

  // polygons
  await _.checkArray(map, node, 'polygons', 'polygons', [], [{
    points: [{
      longitude: 113.3245211,
      latitude: 23.10229,
    }, {
      longitude: 113.324520,
      latitude: 23.21229,
    }],
  }]);

  // subkey
  await _.checkString(map, node, 'subkey', 'subkey', '');

  // layerStyle
  await _.checkNumber(map, node, 'layerStyle', 'layer-style', 1);

  // rotate
  await _.checkNumber(map, node, 'rotate', 'rotate', 0);

  // skew
  await _.checkNumber(map, node, 'skew', 'skew', 0);

  // enable3D
  await _.checkBoolean(map, node, 'enable3D', 'enable-3D', false);

  // showCompass
  await _.checkBoolean(map, node, 'showCompass', 'show-compass', false);

  // enableOverlooking
  await _.checkBoolean(map, node, 'enableOverlooking', 'enable-overlooking', false);

  // enableZoom
  await _.checkBoolean(map, node, 'enableZoom', 'enable-zoom', true);

  // enableScroll
  await _.checkBoolean(map, node, 'enableScroll', 'enable-scroll', true);

  // enableRotate
  await _.checkBoolean(map, node, 'enableRotate', 'enable-rotate', false);

  // enableSatellite
  await _.checkBoolean(map, node, 'enableSatellite', 'enable-satellite', false);

  // enableTraffic
  await _.checkBoolean(map, node, 'enableTraffic', 'enable-traffic', false);


  // event
  const wxMap = map.querySelector('.wx-comp-map');
  await _.checkEvent(wxMap, node, ['tap', 'markertap', 'controltap', 'callouttap', 'updated', 'regionchange', 'poitap']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
