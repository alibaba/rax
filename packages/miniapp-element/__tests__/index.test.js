const _ = require('./utils');

test('render', async() => {
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

  const node1 = page.document.createElement('article');
  const node2 = page.document.createElement('span');
  const node3 = page.document.createElement('div');
  const node4 = page.document.createTextNode('123');
  const node5 = page.document.createElement('span');
  const node6 = page.document.createTextNode('321');
  const node7 = page.document.createTextNode('555');
  const node8 = page.document.createElement('br');
  node5.appendChild(node7);
  node3.appendChild(node4);
  node3.appendChild(node5);
  node3.appendChild(node6);
  node1.appendChild(node2);
  node1.appendChild(node3);
  node1.appendChild(node8);
  page.document.body.appendChild(node1);
  await _.sleep(10);
  expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId}" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            <wx-view class="element--h5-div element--node-${node3.$$nodeId}" data-private-node-id="${node3.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                123
                <wx-view class="element--h5-span element--node-${node5.$$nodeId}" data-private-node-id="${node5.$$nodeId}" data-private-page-id="${page.pageId}" style="">555</wx-view>
                321
            </wx-view>
            <wx-view class="element--h5-br element--node-${node8.$$nodeId}" data-private-node-id="${node8.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
        </wx-view>
    </element>`));

  node1.removeChild(node3);
  node1.replaceChild(node4, node8);
  await _.sleep(10);
  expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId}" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            123
        </wx-view>
    </element>`));

  node1.style.display = 'flex';
  node2.classList.add('test-node2');
  await _.sleep(10);
  expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="display:flex;">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId} element--test-node2" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            123
        </wx-view>
    </element>`));

  document.body.removeChild(wrapper);
});
