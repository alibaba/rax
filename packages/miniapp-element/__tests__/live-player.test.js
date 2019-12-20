const _ = require('./utils');

test('live-player', async() => {
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
  node.setAttribute('behavior', 'live-player');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const livePlayer = body.querySelector('.h5-wx-component');

  // src
  await _.checkUrl(livePlayer, node, 'src', 'src', '');

  // mode
  await _.checkString(livePlayer, node, 'mode', 'mode', 'live');

  // autoplay
  await _.checkBoolean(livePlayer, node, 'autoplay', 'autoplay', false);

  // muted
  await _.checkBoolean(livePlayer, node, 'muted', 'muted', false);

  // orientation
  await _.checkString(livePlayer, node, 'orientation', 'orientation', 'vertical');

  // objectFit
  await _.checkString(livePlayer, node, 'objectFit', 'object-fit', 'contain');

  // backgroundMute
  await _.checkBoolean(livePlayer, node, 'backgroundMute', 'background-mute', false);

  // minCache
  await _.checkNumber(livePlayer, node, 'minCache', 'min-cache', 1);

  // maxCache
  await _.checkNumber(livePlayer, node, 'maxCache', 'max-cache', 3);

  // soundMode
  await _.checkString(livePlayer, node, 'soundMode', 'sound-mode', 'speaker');

  // autoPauseIfNavigate
  await _.checkBoolean(livePlayer, node, 'autoPauseIfNavigate', 'auto-pause-if-navigate', true);

  // autoPauseIfOpenNative
  await _.checkBoolean(livePlayer, node, 'autoPauseIfOpenNative', 'auto-pause-if-open-native', true);

  // event
  const wxLivePlayer = livePlayer.querySelector('.wx-comp-live-player');
  await _.checkEvent(wxLivePlayer, node, ['statechange', 'fullscreenchange', 'netstatus']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
