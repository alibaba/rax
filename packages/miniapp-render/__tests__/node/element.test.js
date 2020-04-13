import mock from '../../renderMock';
import Node from '../../src/node/node';

let document;

beforeAll(() => {
  const page = mock.createPage('home');
  document = page.document;
});

test('element: id/tagName', () => {
  const node1 = document.querySelector('.bb');
  expect(node1.id).toBe('bb');

  const node2 = document.querySelector('header');
  expect(node2.tagName).toBe('HEADER');
  expect(node2.id).toBe('');

  node2.id = 'header';
  expect(node2.id).toBe('header');
  expect(document.getElementById('header').id).toBe('header');
  expect(document.querySelector('#header').id).toBe('header');

  node2.id = '';
  expect(node2.id).toBe('');
  expect(document.getElementById('header')).toBe(null);
  expect(document.querySelector('#header')).toBe(null);
});

test('element: className/classList', () => {
  const node1 = document.querySelector('#bb');
  expect(node1.className).toBe('bb');
  expect(node1.classList).toBeInstanceOf(Array);

  const node2 = document.querySelector('header');
  expect(node2.tagName).toBe('HEADER');
  expect(node2.className).toBe('');
  expect(node2.classList).toBeInstanceOf(Array);

  node2.className = 'header1 header2';
  expect(node2.className).toBe('header1 header2');
  expect(node2.classList.contains('header1')).toBe(true);
  expect(node2.classList.contains('header2')).toBe(true);
  expect(document.querySelector('.header1').className).toBe('header1 header2');
  expect(document.querySelector('.header2').className).toBe('header1 header2');

  node2.className = '';
  expect(node2.className).toBe('');
  expect(node2.classList.contains('header1')).toBe(false);
  expect(node2.classList.contains('header2')).toBe(false);
  expect(document.querySelector('.header1')).toBe(null);
  expect(document.querySelector('.header2')).toBe(null);

  node2.classList.add('header3');
  expect(node2.classList.contains('header3')).toBe(true);
  expect(document.querySelector('.header3').className).toBe('header3');

  node2.classList.remove('header3');
  expect(node2.classList.contains('header3')).toBe(false);
  expect(document.querySelector('.header3')).toBe(null);
});

test('element: nodeName/nodeType', () => {
  const node = document.querySelector('.bb1');
  const parent = document.querySelector('header');
  expect(node.nodeType).toBe(Node.ELEMENT_NODE);
  expect(node.childNodes[0].nodeType).toBe(Node.TEXT_NODE);

  expect(node.parentNode).toBe(parent);

  expect(node.nodeName).toBe('DIV');
  expect(parent.nodeName).toBe('HEADER');
  expect(document.nodeName).toBe('#document');
  expect(node.childNodes[0].nodeName).toBe('#text');
  expect(document.documentElement.nodeName).toBe('HTML');
});

test('element: childNodes/children/firstChild/lastChild', () => {
  const node1 = document.querySelector('.bb1');
  expect(node1.childNodes.length).toBe(1);
  expect(node1.children.length).toBe(0);
  expect(node1.childNodes[0].textContent).toBe('123');

  const node2 = document.querySelector('header');
  expect(node2.childNodes.length).toBe(2);
  expect(node2.children.length).toBe(2);
  expect(node2.childNodes[0].className).toBe('bb1');
  expect(node2.childNodes[1].className).toBe('bb2');
  expect(node2.childNodes[0]).toBe(node2.children[0]);
  expect(node2.childNodes[1]).toBe(node2.children[1]);

  expect(node2.firstChild).toBe(node2.childNodes[0]);
  expect(node2.lastChild).toBe(node2.childNodes[1]);
});

test('element: innerHTML/outerHTML', () => {
  const node1 = document.createElement('article');
  const node2 = document.createElement('span');
  const node3 = document.createElement('div');
  const node4 = document.createTextNode('123');
  const node5 = document.createElement('span');
  const node6 = document.createTextNode('321');
  const node7 = document.createTextNode('555');
  const node8 = document.createElement('br');
  node5.appendChild(node7);
  node3.appendChild(node4);
  node3.appendChild(node5);
  node3.appendChild(node6);
  node1.appendChild(node2);
  node1.appendChild(node3);
  node1.appendChild(node8);
  document.body.appendChild(node1);
  expect(node1.childNodes).toEqual([node2, node3, node8]);

  let parentUpdateCount = 0;
  let node1UpdateCount = 0;
  const onParentUpdate = function() {
    parentUpdateCount++;
  };
  const onNode1Update = function() {
    node1UpdateCount++;
  };
  node1.parentNode.addEventListener('$$childNodesUpdate', onParentUpdate);
  node1.addEventListener('$$childNodesUpdate', onNode1Update);

  node1.id = 'outer';
  node2.id = 'abc';
  node5.id = 'cba';
  node3.id = 'cc';
  node3.className = 'a b c';
  node3.style.position = 'absolute';
  node3.style.top = '10px';
  node3.style.left = '20px';
  expect(parentUpdateCount).toBe(1);
  expect(node1UpdateCount).toBe(6);
  expect(node1.tagName).toBe('ARTICLE');
  expect(node1.id).toBe('outer');
  expect(node1.innerHTML).toBe('<span id="abc"></span><div id="cc" class="a b c" style="position:absolute;top:10px;left:20px;">123<span id="cba">555</span>321</div><br />');
  expect(node1.outerHTML).toBe('<article id="outer"><span id="abc"></span><div id="cc" class="a b c" style="position:absolute;top:10px;left:20px;">123<span id="cba">555</span>321</div><br /></article>');

  node1.innerHTML = '<div id="a">321<span id="inner" b="inner">765</span>123</div><div id="c">555</div><p style="color: green; text-align: center;">I am content</p>';
  expect(node1.childNodes.length).toBe(3);
  expect(node1.childNodes[0].id).toBe('a');
  expect(node1.childNodes[0].childNodes.length).toBe(3);
  expect(node1.childNodes[0].childNodes[0].textContent).toBe('321');
  expect(node1.childNodes[0].childNodes[1].id).toBe('inner');
  expect(node1.childNodes[0].childNodes[1].tagName).toBe('SPAN');
  expect(node1.childNodes[0].childNodes[1].childNodes.length).toBe(1);
  expect(node1.childNodes[0].childNodes[1].childNodes[0].textContent).toBe('765');
  expect(node1.childNodes[0].childNodes[2].textContent).toBe('123');
  expect(node1.childNodes[1].id).toBe('c');
  expect(node1.childNodes[1].childNodes.length).toBe(1);
  expect(node1.childNodes[1].childNodes[0].textContent).toBe('555');
  expect(node1.childNodes[2].tagName).toBe('P');
  expect(node1.childNodes[2].style.color).toBe('green');
  expect(node1.childNodes[2].style.textAlign).toBe('center');
  expect(node1.childNodes[2].childNodes.length).toBe(1);
  expect(node1.childNodes[2].childNodes[0].textContent).toBe('I am content');
  expect(parentUpdateCount).toBe(1);
  expect(node1UpdateCount).toBe(7);

  node1.outerHTML = '<header id="outer2"><div id="a">321<span id="inner" b="inner">765</span>123</div><div id="c">555</div><p style="color: green; text-align: center;">I am content</p></header>';
  expect(node1.tagName).toBe('HEADER');
  expect(node1.id).toBe('outer2');
  expect(node1.childNodes.length).toBe(3);
  expect(node1.childNodes[0].id).toBe('a');
  expect(node1.childNodes[0].childNodes.length).toBe(3);
  expect(node1.childNodes[0].childNodes[0].textContent).toBe('321');
  expect(node1.childNodes[0].childNodes[1].id).toBe('inner');
  expect(node1.childNodes[0].childNodes[1].tagName).toBe('SPAN');
  expect(node1.childNodes[0].childNodes[1].childNodes.length).toBe(1);
  expect(node1.childNodes[0].childNodes[1].childNodes[0].textContent).toBe('765');
  expect(node1.childNodes[0].childNodes[2].textContent).toBe('123');
  expect(node1.childNodes[1].id).toBe('c');
  expect(node1.childNodes[1].childNodes.length).toBe(1);
  expect(node1.childNodes[1].childNodes[0].textContent).toBe('555');
  expect(node1.childNodes[2].tagName).toBe('P');
  expect(node1.childNodes[2].style.color).toBe('green');
  expect(node1.childNodes[2].style.textAlign).toBe('center');
  expect(node1.childNodes[2].childNodes.length).toBe(1);
  expect(node1.childNodes[2].childNodes[0].textContent).toBe('I am content');
  expect(parentUpdateCount).toBe(2);
  expect(node1UpdateCount).toBe(7);

  node1.parentNode.addEventListener('$$childNodesUpdate', onParentUpdate);
  node1.addEventListener('$$childNodesUpdate', onNode1Update);
  document.body.removeChild(node1);
});

test('element: innerText/textContent', () => {
  const node1 = document.createElement('div');
  node1.innerHTML = 'a<div>bc<span>de</span>f<div><span>g</span>h</div>ij</div>k';
  document.body.appendChild(node1);

  let updateCount = 0;
  const onUpdate = function() {
    updateCount++;
  };
  node1.addEventListener('$$childNodesUpdate', onUpdate);

  expect(node1.innerText).toBe('abcdefghijk');
  expect(node1.textContent).toBe('abcdefghijk');

  node1.innerText = '<div>123</div>';
  expect(node1.childNodes.length).toBe(1);
  expect(node1.innerHTML).toBe('<div>123</div>');
  expect(node1.textContent).toBe('<div>123</div>');
  expect(updateCount).toBe(1);

  node1.textContent = '<span>321</span>';
  expect(node1.childNodes.length).toBe(1);
  expect(node1.innerHTML).toBe('<span>321</span>');
  expect(node1.innerText).toBe('<span>321</span>');
  expect(updateCount).toBe(2);

  node1.innerHTML = '<span>321</span>';
  expect(node1.childNodes.length).toBe(1);
  node1.textContent = '';
  expect(node1.childNodes.length).toBe(0);

  node1.removeEventListener('$$childNodesUpdate', onUpdate);
  document.body.removeChild(node1);
});

test('element: dataset', () => {
  const node1 = document.createElement('div');
  node1.innerHTML = '<div data-a="abc" data-bc-d-efg="efg" data-hi-j=123></div>';

  const node2 = node1.childNodes[0];

  expect(node2.dataset).toEqual({
    a: 'abc',
    bcDEfg: 'efg',
    hiJ: '123',
  });

  node2.dataset.bcDEfg = 'hij';
  node2.dataset.kLmNOpQr = 'klm';

  expect(node2.dataset).toEqual({
    a: 'abc',
    bcDEfg: 'hij',
    hiJ: '123',
    kLmNOpQr: 'klm'
  });
  expect(node1.innerHTML).toEqual('<div data-a="abc" data-bc-d-efg="hij" data-hi-j="123" data-k-lm-n-op-qr="klm"></div>');
  expect(node2.outerHTML).toEqual('<div data-a="abc" data-bc-d-efg="hij" data-hi-j="123" data-k-lm-n-op-qr="klm"></div>');

  const node3 = node2.cloneNode();
  node3.dataset.hiJ = '321';
  expect(node3.dataset).toEqual({
    a: 'abc',
    bcDEfg: 'hij',
    hiJ: '321',
    kLmNOpQr: 'klm'
  });
  expect(node3.outerHTML).toEqual('<div data-a="abc" data-bc-d-efg="hij" data-hi-j="321" data-k-lm-n-op-qr="klm"></div>');

  const node4 = document.createElement('div');
  node4.setAttribute('data-a', 'abc');
  node4.setAttribute('data-bc-d-efg', 'hij');
  node4.setAttribute('data-hi-j', '321');
  node4.setAttribute('data-k-lm-n-op-qr', 'klm');
  expect(node4.dataset).toEqual({
    a: 'abc',
    bcDEfg: 'hij',
    hiJ: '321',
    kLmNOpQr: 'klm'
  });
  expect(node4.outerHTML).toEqual('<div data-a="abc" data-bc-d-efg="hij" data-hi-j="321" data-k-lm-n-op-qr="klm"></div>');
  node4.dataset.bcDEfg = 'haha';
  expect(node4.getAttribute('data-bc-d-efg')).toBe('haha');
  expect(node4.hasAttribute('data-bc-d-efg')).toBe(true);
  expect(node4.hasAttribute('data-bc-d-efgh')).toBe(false);
  node4.removeAttribute('data-bc-d-efg');
  expect(node4.getAttribute('data-bc-d-efg')).toBe(undefined);
  expect(node4.hasAttribute('data-bc-d-efg')).toBe(false);
});

test('element: attributes', () => {
  const node = document.createElement('div');
  expect(node.attributes).toBeInstanceOf(Array);
});

test('element: src', () => {
  const node = document.createElement('div');
  expect(node.src).toBe('');

  node.src = 'https://aa.bb.cc';
  expect(node.src).toBe('https://aa.bb.cc');

  // base64
  node.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=';
  expect(node.src).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=');
});

test('element: cloneNode', () => {
  const node1 = document.createElement('div');
  node1.id = 'a';
  node1.className = 'a b c';
  node1.style.display = 'block';
  node1.style.background = 'red';
  const node2 = document.createElement('article');
  const node3 = document.createElement('span');
  const node4 = document.createElement('nav');
  const node5 = document.createTextNode('123');
  const node6 = document.createTextNode('321');
  node1.appendChild(node2);
  node1.appendChild(node3);
  node1.appendChild(node5);
  node2.appendChild(node4);
  node4.appendChild(node6);

  const node7 = node1.cloneNode();
  expect(node7).not.toBe(node1);
  expect(node7.$$nodeId).not.toBe(node1.$$nodeId);
  expect(node7.$$pageId).toBe(node1.$$pageId);
  expect(node7.id).toBe(node1.id);
  expect(node7.className).toBe(node1.className);
  expect(node7.style.cssText).toBe(node1.style.cssText);
  expect(node7.childNodes.length).toBe(0);

  const node8 = node1.cloneNode(true);
  expect(node8).not.toBe(node1);
  expect(node7.$$nodeId).not.toBe(node1.$$nodeId);
  expect(node7.$$pageId).toBe(node1.$$pageId);
  expect(node8.id).toBe(node1.id);
  expect(node8.className).toBe(node1.className);
  expect(node8.style.cssText).toBe(node1.style.cssText);
  expect(node8.childNodes.length).toBe(node1.childNodes.length);
  expect(node8.childNodes[0]).not.toBe(node1.childNodes[0]);
  expect(node8.childNodes[0].tagName).toBe(node1.childNodes[0].tagName);
  expect(node8.childNodes[0].childNodes.length).toBe(node1.childNodes[0].childNodes.length);
  expect(node8.childNodes[0].childNodes[0]).not.toBe(node1.childNodes[0].childNodes[0]);
  expect(node8.childNodes[0].childNodes[0].tagName).toBe(node1.childNodes[0].childNodes[0].tagName);
  expect(node8.childNodes[0].childNodes[0].childNodes.length).toBe(node1.childNodes[0].childNodes[0].childNodes.length);
  expect(node8.childNodes[0].childNodes[0].childNodes[0]).not.toBe(node1.childNodes[0].childNodes[0].childNodes[0]);
  expect(node8.childNodes[0].childNodes[0].childNodes[0].textContent).toBe(node1.childNodes[0].childNodes[0].childNodes[0].textContent);
  expect(node8.childNodes[1]).not.toBe(node1.childNodes[1]);
  expect(node8.childNodes[1].tagName).toBe(node1.childNodes[1].tagName);
  expect(node8.childNodes[2]).not.toBe(node1.childNodes[2]);
  expect(node8.childNodes[2].textContent).toBe(node1.childNodes[2].textContent);
});

test('element: hasChildNodes', () => {
  const node1 = document.createElement('div');
  const node2 = document.createElement('div');
  const node3 = document.createTextNode('123');
  const node4 = document.createElement('div');
  const node5 = document.createComment('comment');

  expect(node1.hasChildNodes()).toBe(false);
  node1.appendChild(node3);
  expect(node1.hasChildNodes()).toBe(true);
  node1.removeChild(node3);
  node1.appendChild(node5);
  expect(node1.hasChildNodes()).toBe(true);
  node1.appendChild(node2);
  expect(node1.hasChildNodes()).toBe(true);
  node2.appendChild(node4);
  expect(node1.hasChildNodes()).toBe(true);
  node2.appendChild(node5);
  expect(node1.hasChildNodes()).toBe(true);
  node1.removeChild(node2);
  expect(node1.hasChildNodes()).toBe(false);
});

test('node: getElementsByTagName', () => {
  const node = document.querySelector('footer');
  const nodes = node.getElementsByTagName('span');
  expect(nodes.length).toBe(3);
  expect(nodes[0].tagName).toBe('SPAN');
  expect(nodes[1].tagName).toBe('SPAN');
  expect(nodes[2].tagName).toBe('SPAN');

  expect(document.getElementsByTagName('header').length).toBe(1);
  expect(node.getElementsByTagName('header').length).toBe(0);
});

test('node: getElementsByClassName', () => {
  const node = document.querySelector('footer');
  const nodes = node.getElementsByClassName('bb4');
  expect(nodes.length).toBe(3);
  expect(nodes[0].tagName).toBe('SPAN');
  expect(nodes[1].tagName).toBe('SPAN');
  expect(nodes[2].tagName).toBe('SPAN');

  expect(document.getElementsByClassName('bb1').length).toBe(1);
  expect(node.getElementsByClassName('bb1').length).toBe(0);
});

test('node: querySelector', () => {
  const node1 = document.querySelector('.aa');
  const node2 = node1.querySelector('#bb');
  expect(node2.tagName).toBe('DIV');
  expect(node2.id).toBe('bb');

  const node3 = node1.querySelector('#bb .bb4');
  expect(node3.tagName).toBe('SPAN');
  expect(node3.id).toBe('bb4');

  expect(node1.querySelector('#aa')).toBe(null);
});

test('node: querySelectorAll', () => {
  const node = document.querySelector('.aa');
  const nodes = node.querySelectorAll('#bb .bb4');
  expect(nodes.length).toBe(3);
  expect(nodes[0].tagName).toBe('SPAN');
  expect(nodes[0].id).toBe('bb4');
  expect(nodes[1].tagName).toBe('SPAN');
  expect(nodes[2].tagName).toBe('SPAN');

  expect(node.querySelectorAll('#aa').length).toBe(0);
});

test('element: setAttribute/getAttribute/hasAttribute/removeAttribute', () => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const attributes = node.attributes;

  let updateCount = 0;
  const onUpdate = function() {
    updateCount++;
  };
  node.parentNode.addEventListener('$$childNodesUpdate', onUpdate);

  expect(node.getAttribute('id')).toBe('');
  expect(node.getAttribute('class')).toBe('');
  expect(node.getAttribute('style')).toBe('');
  expect(node.getAttribute('src')).toBe(undefined);
  expect(node.hasAttribute('id')).toBe(false);
  expect(node.hasAttribute('class')).toBe(false);
  expect(node.hasAttribute('style')).toBe(false);
  expect(node.hasAttribute('src')).toBe(false);
  expect(attributes).toEqual([]);
  expect(attributes.id).toBe(undefined);
  expect(attributes.class).toBe(undefined);
  expect(attributes.style).toBe(undefined);
  expect(attributes.src).toBe(undefined);
  expect(updateCount).toBe(0);

  node.id = 'abc';
  node.className = 'a b';
  node.style.display = 'block';
  // eslint-disable-next-line no-script-url
  node.src = 'javascript: void(0);';
  expect(node.getAttribute('id')).toBe('abc');
  expect(node.getAttribute('class')).toBe('a b');
  expect(node.getAttribute('style')).toBe('display:block;');
  // eslint-disable-next-line no-script-url
  expect(node.getAttribute('src')).toBe('javascript: void(0);');
  expect(node.hasAttribute('id')).toBe(true);
  expect(node.hasAttribute('class')).toBe(true);
  expect(node.hasAttribute('style')).toBe(true);
  expect(node.hasAttribute('src')).toBe(true);
  expect(attributes.length).toBe(4);
  expect(attributes.id).toBe(attributes[1]);
  expect(attributes.id).toEqual({name: 'id', value: 'abc'});
  expect(attributes.class).toBe(attributes[2]);
  expect(attributes.class).toEqual({name: 'class', value: 'a b'});
  expect(attributes.style).toBe(attributes[3]);
  expect(attributes.style).toEqual({name: 'style', value: 'display:block;'});
  expect(attributes.src).toBe(attributes[0]);
  // eslint-disable-next-line no-script-url
  expect(attributes.src).toEqual({name: 'src', value: 'javascript: void(0);'});
  expect(updateCount).toBe(4);

  node.setAttribute('id', 'cba');
  node.setAttribute('class', 'c b a');
  node.setAttribute('style', 'display:inline;');
  node.setAttribute('src', 'moc.haha.www');
  expect(node.id).toBe('cba');
  expect(node.className).toBe('c b a');
  expect(node.style.cssText).toBe('display:inline;');
  expect(node.src).toBe('moc.haha.www');
  expect(node.hasAttribute('id')).toBe(true);
  expect(node.hasAttribute('class')).toBe(true);
  expect(node.hasAttribute('style')).toBe(true);
  expect(node.hasAttribute('src')).toBe(true);
  expect(attributes.length).toEqual(4);
  expect(attributes.id).toBe(attributes[1]);
  expect(attributes.id).toEqual({name: 'id', value: 'cba'});
  expect(attributes.class).toBe(attributes[2]);
  expect(attributes.class).toEqual({name: 'class', value: 'c b a'});
  expect(attributes.style).toBe(attributes[3]);
  expect(attributes.style).toEqual({name: 'style', value: 'display:inline;'});
  expect(attributes.src).toBe(attributes[0]);
  expect(attributes.src).toEqual({name: 'src', value: 'moc.haha.www'});
  expect(updateCount).toBe(8);

  node.removeAttribute('id');
  node.removeAttribute('class');
  node.removeAttribute('style');
  node.removeAttribute('src');
  expect(node.id).toBe('');
  expect(node.className).toBe('');
  expect(node.style.cssText).toBe('');
  expect(node.src).toBe(undefined);
  expect(node.getAttribute('id')).toBe('');
  expect(node.getAttribute('class')).toBe('');
  expect(node.getAttribute('style')).toBe('');
  expect(node.getAttribute('src')).toBe(undefined);
  expect(node.hasAttribute('id')).toBe(false);
  expect(node.hasAttribute('class')).toBe(false);
  expect(node.hasAttribute('style')).toBe(false);
  expect(node.hasAttribute('src')).toBe(false);
  expect(attributes).toEqual([]);
  expect(attributes.id).toBe(undefined);
  expect(attributes.class).toBe(undefined);
  expect(attributes.style).toBe(undefined);
  expect(attributes.src).toBe(undefined);
  expect(updateCount).toBe(12);

  // object/array
  const obj = {a: 123, b: {c: 321, d: [1, 2, 3]}};
  node.setAttribute('object-attr', obj);
  expect(node.getAttribute('object-attr')).toBe(obj);
  expect(attributes.length).toEqual(1);
  expect(updateCount).toBe(13);
  const arr = [{a: obj}, 123, null, 'haha'];
  node.setAttribute('array-attr', arr);
  expect(node.getAttribute('array-attr')).toBe(arr);
  expect(attributes.length).toEqual(2);
  expect(updateCount).toBe(14);

  node.parentNode.removeEventListener('$$childNodesUpdate', onUpdate);
  document.body.removeChild(node);
});

test('element: contains', () => {
  const node1 = document.createElement('div');
  const node2 = document.createElement('div');
  const node3 = document.createTextNode('123');
  const node4 = document.createElement('div');
  const node5 = document.createComment('comment');

  expect(node1.contains(node2)).toBe(false);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(false);
  expect(node1.contains(node5)).toBe(false);
  node1.appendChild(node3);
  expect(node1.contains(node2)).toBe(false);
  expect(node1.contains(node3)).toBe(true);
  expect(node1.contains(node4)).toBe(false);
  expect(node1.contains(node5)).toBe(false);
  node1.removeChild(node3);
  node1.appendChild(node5);
  expect(node1.contains(node2)).toBe(false);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(false);
  expect(node1.contains(node5)).toBe(true);
  node1.appendChild(node2);
  expect(node1.contains(node2)).toBe(true);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(false);
  expect(node1.contains(node5)).toBe(true);
  node2.appendChild(node4);
  expect(node1.contains(node2)).toBe(true);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(true);
  expect(node1.contains(node5)).toBe(true);
  node2.appendChild(node5);
  expect(node1.contains(node2)).toBe(true);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(true);
  expect(node1.contains(node5)).toBe(true);
  node1.removeChild(node2);
  expect(node1.contains(node2)).toBe(false);
  expect(node1.contains(node3)).toBe(false);
  expect(node1.contains(node4)).toBe(false);
  expect(node1.contains(node5)).toBe(false);
});
