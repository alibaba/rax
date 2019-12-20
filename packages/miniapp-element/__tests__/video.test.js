const _ = require('./utils');

test('video', async() => {
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
  const node = page.document.createElement('video');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const video = body.querySelector('.h5-video');

  // src
  await _.checkUrl(video, node, 'src', 'src', '');

  // duration
  await _.checkNumber(video, node, 'duration', 'duration', 0);

  // controls
  await _.checkBoolean(video, node, 'controls', 'controls', true);

  // danmuList
  await _.checkArray(video, node, 'danmuList', 'danmu-list', [], [{
    text: '第 1s 出现的弹幕',
    color: '#ff0000',
    time: 1
  }, {
    text: '第 3s 出现的弹幕',
    color: '#ff00ff',
    time: 3
  }]);

  // danmuBtn
  await _.checkBoolean(video, node, 'danmuBtn', 'danmu-btn', false);

  // enableDanmu
  await _.checkBoolean(video, node, 'enableDanmu', 'enable-danmu', false);

  // autoplay
  await _.checkBoolean(video, node, 'autoplay', 'autoplay', false);

  // loop
  await _.checkBoolean(video, node, 'loop', 'loop', false);

  // muted
  await _.checkBoolean(video, node, 'muted', 'muted', false);

  // initialTime
  await _.checkNumber(video, node, 'initialTime', 'initial-time', 0);

  // direction
  await _.checkNumber(video, node, 'direction', 'direction', -1);

  // showProgress
  await _.checkBoolean(video, node, 'showProgress', 'show-progress', true);

  // showFullscreenBtn
  await _.checkBoolean(video, node, 'showFullscreenBtn', 'show-fullscreen-btn', true);

  // showPlayBtn
  await _.checkBoolean(video, node, 'showPlayBtn', 'show-play-btn', true);

  // showCenterPlayBtn
  await _.checkBoolean(video, node, 'showCenterPlayBtn', 'show-center-play-btn', true);

  // enableProgressGesture
  await _.checkBoolean(video, node, 'enableProgressGesture', 'enable-progress-gesture', true);

  // objectFit
  await _.checkString(video, node, 'objectFit', 'object-fit', 'contain');

  // poster
  await _.checkUrl(video, node, 'poster', 'poster', '');

  // showMuteBtn
  await _.checkBoolean(video, node, 'showMuteBtn', 'show-mute-btn', false);

  // title
  await _.checkString(video, node, 'title', 'title', '');

  // playBtnPosition
  await _.checkString(video, node, 'playBtnPosition', 'play-btn-position', 'bottom');

  // enablePlayGesture
  await _.checkBoolean(video, node, 'enablePlayGesture', 'enable-play-gesture', false);

  // autoPauseIfNavigate
  await _.checkBoolean(video, node, 'autoPauseIfNavigate', 'auto-pause-if-navigate', true);

  // autoPauseIfOpenNative
  await _.checkBoolean(video, node, 'autoPauseIfOpenNative', 'auto-pause-if-open-native', true);

  // vslideGesture
  await _.checkBoolean(video, node, 'vslideGesture', 'vslide-gesture', false);

  // vslideGestureInFullscreen
  await _.checkBoolean(video, node, 'vslideGestureInFullscreen', 'vslide-gesture-in-fullscreen', true);

  // event
  const wxVideo = video.querySelector('.wx-comp-video');
  await _.checkEvent(wxVideo, node, ['play', 'pause', 'ended', 'timeupdate', 'fullscreenchange', 'waiting', 'error', 'progress']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
