const _ = require('./utils');

test('swiper', async() => {
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
  node.setAttribute('behavior', 'swiper');
  node.innerHTML = `
        <wx-swiper-item item-id="1"><span>1</span></wx-swiper-item>
        <wx-swiper-item item-id="2"><span>2</span></wx-swiper-item>
        <wx-swiper-item><span>3</span></wx-swiper-item>
        <div>123</div>
    `;
  page.document.body.appendChild(node);
  await _.sleep(10);
  const swiper = body.querySelector('.h5-wx-component');

  // 检查 swiper-item
  expect(swiper.dom.childNodes[0].childNodes.length).toBe(3);
  expect(swiper.dom.childNodes[0].childNodes[0].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(swiper.dom.childNodes[0].childNodes[0].childNodes[0].innerHTML).toBe('1');
  expect(swiper.dom.childNodes[0].childNodes[1].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(swiper.dom.childNodes[0].childNodes[1].childNodes[0].innerHTML).toBe('2');
  expect(swiper.dom.childNodes[0].childNodes[2].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(swiper.dom.childNodes[0].childNodes[2].childNodes[0].innerHTML).toBe('3');
  expect(swiper.data.innerChildNodes[0].extra).toEqual({hidden: false, itemId: '1'});
  expect(swiper.data.innerChildNodes[1].extra).toEqual({hidden: false, itemId: '2'});
  expect(swiper.data.innerChildNodes[2].extra).toEqual({hidden: false, itemId: ''});

  // mindicator-dotsin
  await _.checkBoolean(swiper, node, 'indicatorDots', 'mindicator-dotsin', false);

  // indicator-color
  await _.checkString(swiper, node, 'indicatorColor', 'indicator-color', 'rgba(0, 0, 0, .3)');

  // indicator-active-color
  await _.checkString(swiper, node, 'indicatorActiveColor', 'indicator-active-color', '#000000');

  // autoplay
  await _.checkBoolean(swiper, node, 'autoplay', 'autoplay', false);

  // current
  await _.checkNumber(swiper, node, 'current', 'current', 0);

  // interval
  await _.checkNumber(swiper, node, 'interval', 'interval', 5000);

  // duration
  await _.checkNumber(swiper, node, 'duration', 'duration', 500);

  // circular
  await _.checkBoolean(swiper, node, 'circular', 'circular', false);

  // vertical
  await _.checkBoolean(swiper, node, 'vertical', 'vertical', false);

  // previous-margin
  await _.checkString(swiper, node, 'previousMargin', 'previous-margin', '0px');

  // next-margin
  await _.checkString(swiper, node, 'nextMargin', 'next-margin', '0px');

  // display-multiple-items
  await _.checkNumber(swiper, node, 'displayMultipleItems', 'display-multiple-items', 1);

  // skip-hidden-item-layout
  await _.checkBoolean(swiper, node, 'skipHiddenItemLayout', 'skip-hidden-item-layout', false);

  // easing-function
  await _.checkString(swiper, node, 'easingFunction', 'easing-function', 'default');

  // event
  const wxSwiper = swiper.querySelector('.wx-comp-swiper');
  await _.checkEvent(wxSwiper, node, ['change', 'transition', 'animationfinish']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
