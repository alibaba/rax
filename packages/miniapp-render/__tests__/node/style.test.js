import mock from '../../renderMock';

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('style', () => {
  let updateCount = 0;
  const element = document.createElement('div');
  element.addEventListener('$$domNodeUpdate', () => {
    updateCount++;
  });
  const style = element.style;
  style.cssText = 'position: absolute; top: 0; left: 0;';

  expect(style.position).toBe('absolute');
  expect(style.top).toBe('0');
  expect(style.top).toBe('0');
  expect(style.width).toBe('');

  style.width = '100%';
  expect(style.width).toBe('100%');
  style.height = '13px';
  expect(style.height).toBe('13px');
  expect(updateCount).toBe(3);

  expect(style.cssText).toBe('position:absolute;top:0;left:0;width:100%;height:13px;');

  style.cssText = 'position: relative; display: block;';
  expect(style.position).toBe('relative');
  expect(style.top).toBe('');
  expect(style.left).toBe('');
  expect(style.display).toBe('block');
  expect(updateCount).toBe(4);

  expect(style.cssText).toBe('position:relative;display:block;');

  // base64
  style.cssText = 'width: 100px; height: 100px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=")';
  expect(style.cssText).toBe('width:100px;height:100px;background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=\');');
});
