import mock from '../../../renderMock';

let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});

test('image', async() => {
  global.expectSuccess = false;
  const Image = window.Image;

  // 带宽高
  const image1 = new Image(50, 60);
  let image1Count = 0;
  let expectImage1Count = 0;
  image1.onload = function() {
    expect(image1.width).toBe(50);
    expect(image1.height).toBe(60);
    expect(image1.naturalWidth).toBe(100);
    expect(image1.naturalHeight).toBe(88);
    expect(image1.src).toBe('https://c.b.a');
    expect(image1Count).toBe(expectImage1Count);
  };
  image1.onerror = function() {
    expect(image1.width).toBe(50);
    expect(image1.height).toBe(60);
    expect(image1.naturalWidth).toBe(0);
    expect(image1.naturalHeight).toBe(0);
    expect(image1.src).toBe('https://a.b.c');
    expect(image1Count).toBe(expectImage1Count);
  };
  expect(image1.width).toBe(50);
  expect(image1.height).toBe(60);
  expect(image1.naturalWidth).toBe(0);
  expect(image1.naturalHeight).toBe(0);
  expect(image1.src).toBe('');
  image1Count++;
  expectImage1Count = 1;
  image1.src = 'https://a.b.c';
  await mock.sleep(20);
  global.expectSuccess = true; // 下一次请求为成功
  image1Count++;
  expectImage1Count = 2;
  image1.src = 'https://c.b.a';
  await mock.sleep(20);
  image1Count++;
  expectImage1Count = 3;
  image1.src = 'https://c.b.a';
  await mock.sleep(20);

  // 不带宽高
  global.expectSuccess = false;
  const image2 = new Image();
  let image2Count = 0;
  let expectImage2Count = 0;
  image2.onload = function() {
    expect(image2.width).toBe(0);
    expect(image2.height).toBe(0);
    expect(image2.naturalWidth).toBe(100);
    expect(image2.naturalHeight).toBe(88);
    expect(image2.src).toBe('https://f.e.d');
    expect(image2Count).toBe(expectImage2Count);
  };
  image2.onerror = function() {
    expect(image2.width).toBe(0);
    expect(image2.height).toBe(0);
    expect(image2.naturalWidth).toBe(0);
    expect(image2.naturalHeight).toBe(0);
    expect(image2.src).toBe('https://d.e.f');
    expect(image2Count).toBe(expectImage2Count);
  };
  expect(image2.width).toBe(0);
  expect(image2.height).toBe(0);
  expect(image2.naturalWidth).toBe(0);
  expect(image2.naturalHeight).toBe(0);
  expect(image2.src).toBe('');
  image2Count++;
  expectImage2Count = 1;
  image2.src = 'https://d.e.f';
  await mock.sleep(20);
  global.expectSuccess = true; // 下一次请求为成功
  image2Count++;
  expectImage2Count = 2;
  image2.src = 'https://f.e.d';
  await mock.sleep(20);
  image2Count++;
  expectImage2Count = 3;
  image2.src = 'https://f.e.d';
  await mock.sleep(20);

  // 设置宽高
  image1.width = 123;
  image1.height = 321;
  expect(image1.style.cssText).toBe('width:123px;height:321px;');
  image1.setAttribute('width', 444);
  image1.setAttribute('height', 555);
  expect(image1.style.cssText).toBe('width:444px;height:555px;');

  // base64
  const image3 = new Image();
  image3.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=';
  expect(image3.src).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=');
});
