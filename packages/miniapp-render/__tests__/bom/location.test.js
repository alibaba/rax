import mock from './mock';
let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});

test('location: get', () => {
  const location = window.location;

  window.$$miniprogram.init('http://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(location.href).toBe('http://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(location.protocol).toBe('http:');
  expect(location.host).toBe('sub.host.com:8080');
  expect(location.hostname).toBe('sub.host.com');
  expect(location.port).toBe('8080');
  expect(location.origin).toBe('http://sub.host.com:8080');
  expect(location.pathname).toBe('/p/a/t/h');
  expect(location.search).toBe('?query=string');
  expect(location.hash).toBe('#hash');
  expect(location.toString()).toBe(location.href);

  window.$$miniprogram.init('//sub.host.com#hash?query=string');
  expect(location.href).toBe('https://sub.host.com/#hash?query=string');
  expect(location.protocol).toBe('https:');
  expect(location.host).toBe('sub.host.com');
  expect(location.hostname).toBe('sub.host.com');
  expect(location.port).toBe('');
  expect(location.origin).toBe('https://sub.host.com');
  expect(location.pathname).toBe('/');
  expect(location.search).toBe('');
  expect(location.hash).toBe('#hash?query=string');
  expect(location.toString()).toBe(location.href);

  window.$$miniprogram.init('a.c:0/?#');
  expect(location.href).toBe('https://a.c:0/');
  expect(location.protocol).toBe('https:');
  expect(location.host).toBe('a.c:0');
  expect(location.hostname).toBe('a.c');
  expect(location.port).toBe('0');
  expect(location.origin).toBe('https://a.c:0');
  expect(location.pathname).toBe('/');
  expect(location.search).toBe('');
  expect(location.hash).toBe('');
  expect(location.toString()).toBe(location.href);
});

test('location: set', () => {
  const location = window.location;

  global.expectPagePath = '';
  global.expectCallMethod = 'redirectTo';

  let hashChangeCount = 0;
  let pageAccessDeniedCount = 0;
  let pageNotFoundCount = 0;
  let oldURL = '';
  let newURL = '';
  let tempURL = '';
  let tempType = '';
  const onHashChange = evt => {
    oldURL = evt.oldURL;
    newURL = evt.newURL;
    hashChangeCount++;
  };
  const onPageAccessDenied = evt => {
    tempURL = evt.url;
    tempType = evt.type;
    pageAccessDeniedCount++;
  };
  const onPageNotFound = evt => {
    tempURL = evt.url;
    tempType = evt.type;
    pageNotFoundCount++;
  };
  location.addEventListener('hashchange', onHashChange);
  window.addEventListener('pageaccessdenied', onPageAccessDenied);
  window.addEventListener('pagenotfound', onPageNotFound);

  window.$$miniprogram.init('https://sub.host.com:8080/p/a/t/h?query=string#hash');

  // protocol
  expect(location.protocol).toBe('https:');
  location.protocol = 'http';
  expect(location.protocol).toBe('https:'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(1);
  expect(tempURL).toBe('http://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.protocol = 'https:';
  expect(location.protocol).toBe('https:');
  location.protocol = 'https';
  expect(location.protocol).toBe('https:');
  window.$$miniprogram.init('ftp://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(location.protocol).toBe('ftp:');
  location.protocol = 'ftp:';
  expect(location.protocol).toBe('ftp:');
  location.protocol = 'https:';
  expect(location.protocol).toBe('ftp:'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(2);
  expect(tempURL).toBe('https://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');

  // port
  expect(location.port).toBe('8080');
  location.port = '';
  expect(location.port).toBe('8080');
  location.port = 0;
  expect(location.port).toBe('8080');
  location.port = -80;
  expect(location.port).toBe('8080');
  location.port = 80;
  expect(location.port).toBe('8080'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(3);
  expect(tempURL).toBe('ftp://sub.host.com/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  window.$$miniprogram.init('ftp://sub.host.com/p/a/t/h?query=string#hash');
  expect(location.port).toBe('');
  location.port = 80;
  expect(location.port).toBe('');
  location.port = 8080;
  expect(location.port).toBe(''); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(4);
  expect(tempURL).toBe('ftp://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');

  // hostname
  expect(location.hostname).toBe('sub.host.com');
  location.hostname = 'a.b.c';
  expect(location.hostname).toBe('sub.host.com'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(5);
  expect(tempURL).toBe('ftp://a.b.c/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.hostname = 'sub.host.com';
  expect(location.hostname).toBe('sub.host.com');
  window.$$miniprogram.init('https://a.b.c/p/a/t/h?query=string#hash');
  expect(location.hostname).toBe('a.b.c');
  location.hostname = '';
  expect(location.hostname).toBe('a.b.c');
  location.hostname = 'sub.host.com';
  expect(location.hostname).toBe('a.b.c'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(6);
  expect(tempURL).toBe('https://sub.host.com/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.hostname = 'a.b.c:8088';
  expect(location.hostname).toBe('a.b.c');
  expect(location.port).toBe(''); // 设置 hostname 无需处理端口号

  // host
  expect(location.host).toBe('a.b.c');
  location.host = 'sub.host.com:8080';
  expect(location.host).toBe('a.b.c'); // 不同源，恢复成原状
  expect(location.hostname).toBe('a.b.c'); // 不同源，恢复成原状
  expect(location.port).toBe(''); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(7);
  expect(tempURL).toBe('https://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.host = 'a.b.c';
  expect(location.host).toBe('a.b.c');
  expect(location.hostname).toBe('a.b.c');
  expect(location.port).toBe('');
  window.$$miniprogram.init('https://sub.host.com:8080/p/a/t/h?query=string#hash');
  expect(location.host).toBe('sub.host.com:8080');
  location.host = '';
  expect(location.host).toBe('sub.host.com:8080');
  location.host = 'a.b.c';
  expect(location.host).toBe('sub.host.com:8080'); // 不同源，恢复成原状
  expect(location.hostname).toBe('sub.host.com'); // 不同源，恢复成原状
  expect(location.port).toBe('8080'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(8);
  expect(tempURL).toBe('https://a.b.c/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');

  // origin
  window.$$miniprogram.init('https://a.b.c/p/a/t/h?query=string#hash');
  expect(location.origin).toBe('https://a.b.c');
  location.origin = 'http://a.c.d:3033';
  expect(location.origin).toBe('https://a.b.c');
  expect(pageAccessDeniedCount).toBe(9);
  expect(tempURL).toBe('http://a.c.d:3033/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.origin = 'https://a.b.c';
  expect(location.origin).toBe('https://a.b.c');
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('a.b.c');
  expect(location.port).toBe('');
  window.$$miniprogram.init('https://a.c.d:3033/p/a/t/h?query=string#hash');
  expect(location.origin).toBe('https://a.c.d:3033');
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('a.c.d');
  expect(location.port).toBe('3033');
  location.origin = '';
  expect(location.origin).toBe('https://a.c.d:3033');
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('a.c.d');
  expect(location.port).toBe('3033');
  location.origin = 'https://a.b.c';
  expect(location.origin).toBe('https://a.c.d:3033'); // 不同源，恢复成原状
  expect(location.protocol).toBe('https:'); // 不同源，恢复成原状
  expect(location.hostname).toBe('a.c.d'); // 不同源，恢复成原状
  expect(location.port).toBe('3033'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(10);
  expect(tempURL).toBe('https://a.b.c/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.origin = 'http://a.c.d:3033';
  expect(location.origin).toBe('https://a.c.d:3033'); // 不同源，恢复成原状
  expect(location.protocol).toBe('https:'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(11);
  expect(tempURL).toBe('http://a.c.d:3033/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');
  location.origin = 'https://a.c.d:3034';
  expect(location.origin).toBe('https://a.c.d:3033'); // 不同源，恢复成原状
  expect(location.port).toBe('3033'); // 不同源，恢复成原状
  expect(pageAccessDeniedCount).toBe(12);
  expect(tempURL).toBe('https://a.c.d:3034/p/a/t/h?query=string#hash');
  expect(tempType).toBe('jump');

  // pathname
  window.$$miniprogram.init('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  expect(location.pathname).toBe('/p/a/t/h');
  global.expectPagePath = `/pages/home/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`;
  location.pathname = '';
  expect(location.pathname).toBe('/');
  location.pathname = 'p/a/t';
  expect(location.pathname).toBe('/');
  expect(pageNotFoundCount).toBe(1);
  expect(tempURL).toBe('https://test.miniprogram.com/p/a/t?query=string#hash');
  expect(tempType).toBe('jump');
  location.pathname = '/';
  expect(location.pathname).toBe('/');
  location.pathname = '/cc/aa';
  expect(location.pathname).toBe('/');
  expect(pageNotFoundCount).toBe(2);
  expect(tempURL).toBe('https://test.miniprogram.com/cc/aa?query=string#hash');
  expect(tempType).toBe('jump');
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`;
  location.pathname = '/index/aaa/list/123';
  expect(location.pathname).toBe('/index/aaa/list/123');

  // search
  expect(location.search).toBe('?query=string');
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123#hash')}&search=&hash=${encodeURIComponent('#hash')}`;
  location.search = '';
  expect(location.search).toBe('');
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?a=123#hash')}&search=${encodeURIComponent('?a=123')}&hash=${encodeURIComponent('#hash')}`;
  location.search = 'a=123';
  expect(location.search).toBe('?a=123');
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123#hash')}&search=&hash=${encodeURIComponent('#hash')}`;
  location.search = '?';
  expect(location.search).toBe('');
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?c=321#hash')}&search=${encodeURIComponent('?c=321')}&hash=${encodeURIComponent('#hash')}`;
  location.search = '?c=321';
  expect(location.search).toBe('?c=321');

  // hash
  expect(location.hash).toBe('#hash');
  expect(hashChangeCount).toBe(0);
  expect(oldURL).toBe('');
  expect(newURL).toBe('');
  tempURL = location.href;
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?c=321')}&search=${encodeURIComponent('?c=321')}`;
  location.hash = '';
  expect(location.hash).toBe('');
  expect(hashChangeCount).toBe(1);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);
  tempURL = location.href;
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?c=321#abc')}&search=${encodeURIComponent('?c=321')}&hash=${encodeURIComponent('#abc')}`;
  location.hash = 'abc';
  expect(location.hash).toBe('#abc');
  expect(hashChangeCount).toBe(2);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);
  tempURL = location.href;
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?c=321')}&search=${encodeURIComponent('?c=321')}`;
  location.hash = '#';
  expect(location.hash).toBe('');
  expect(hashChangeCount).toBe(3);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);
  tempURL = location.href;
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/123?c=321#cba')}&search=${encodeURIComponent('?c=321')}&hash=${encodeURIComponent('#cba')}`;
  location.hash = '#cba';
  expect(location.hash).toBe('#cba');
  expect(hashChangeCount).toBe(4);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);
  location.hash = 'cba';
  expect(location.hash).toBe('#cba');
  expect(hashChangeCount).toBe(4);

  // href
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/list/123?c=321#cba');
  location.href = '//a.b.c/aa/bb?v=321#abc';
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/list/123?c=321#cba');
  expect(location.protocol).toBe('https:');
  expect(location.host).toBe('test.miniprogram.com');
  expect(location.hostname).toBe('test.miniprogram.com');
  expect(location.port).toBe('');
  expect(location.origin).toBe('https://test.miniprogram.com');
  expect(location.pathname).toBe('/index/aaa/list/123');
  expect(location.search).toBe('?c=321');
  expect(location.hash).toBe('#cba');
  expect(pageAccessDeniedCount).toBe(13);
  expect(tempURL).toBe('https://a.b.c/aa/bb?v=321#abc');
  expect(tempType).toBe('jump');
  expect(hashChangeCount).toBe(4);
  tempURL = location.href;
  global.expectPagePath = `/pages/list/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/list/c.b.a?p=456#000')}&search=${encodeURIComponent('?p=456')}&hash=${encodeURIComponent('#000')}`;
  location.href = 'c.b.a?p=456#000'; // 不带协议，不以 / 开头
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/list/c.b.a?p=456#000');
  expect(hashChangeCount).toBe(5);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);
  location.href = 'c.a.b/aa/bb?p=456#000'; // 不带协议，不以 / 开头
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/list/c.b.a?p=456#000');
  expect(pageNotFoundCount).toBe(3);
  expect(tempURL).toBe('https://test.miniprogram.com/index/aaa/list/c.a.b/aa/bb?p=456#000');
  expect(tempType).toBe('jump');
  tempURL = location.href;
  global.expectPagePath = `/pages/detail/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/detail/haha?n=098#000')}&search=${encodeURIComponent('?n=098')}&hash=${encodeURIComponent('#000')}`;
  location.href = '/index/aaa/detail/haha?n=098#000'; // 不带协议，以 / 开头
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/haha?n=098#000');
  expect(hashChangeCount).toBe(5);
  location.href = '/haha/rr/ee?n=098#111'; // 不带协议，以 / 开头
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/haha?n=098#000');
  expect(pageNotFoundCount).toBe(4);
  expect(tempURL).toBe('https://test.miniprogram.com/haha/rr/ee?n=098#111');
  expect(tempType).toBe('jump');
  tempURL = location.href;
  location.href = '#222'; // 不带协议，以 # 开头
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/haha?n=098#222');
  expect(hashChangeCount).toBe(6);
  expect(oldURL).toBe(tempURL);
  expect(newURL).toBe(location.href);

  // reload
  window.$$miniprogram.init('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  global.expectPagePath = `/pages/home/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/p/a/t/h?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`;
  global.expectCallMethod = 'redirectTo';
  location.reload();
  expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash');

  // replace
  global.expectPagePath = `/pages/detail/index?type=jump&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`;
  global.expectCallMethod = 'redirectTo';
  location.replace('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  location.replace('https://test.miniprogram.com/index/hahaha?query=string#321');
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(pageNotFoundCount).toBe(5);
  expect(tempURL).toBe('https://test.miniprogram.com/index/hahaha?query=string#321');
  expect(tempType).toBe('jump');
  location.replace('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(location.href).toBe('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(pageAccessDeniedCount).toBe(14);
  expect(tempURL).toBe('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(tempType).toBe('jump');

  expect(pageAccessDeniedCount).toBe(14);
  expect(pageNotFoundCount).toBe(5);

  location.removeEventListener('hashchange', onHashChange);
  window.removeEventListener('pageaccessdenied', onPageAccessDenied);
  window.removeEventListener('pagenotfound', onPageNotFound);
});
