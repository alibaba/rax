const mock = require('../mock');
const Cookie = require('../../src/bom/cookie');

test('cookie', async() => {
  const cookie = new Cookie('testPageName');
  const url1 = 'http://sub.host.com/p/a/t/h?query=string#hash';
  const url2 = 'http://xxx.sub.host.com/p/a/t/h?query=string#hash';
  const url3 = 'http://sub2.host.com/p/a/t/h?query=string#hash';
  const url4 = 'https://sub.host.com/p/a/t/h?query=string#hash';

  // key-value
  cookie.setCookie('aaa=bbb', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb');
  cookie.setCookie('ccc=ddd\nasdf', url1);
  cookie.setCookie('eee=fff;asdf', url1);
  cookie.setCookie('ggg=;asdf', url1);
  cookie.setCookie('hhh\n=;asdf', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; ccc=ddd; eee=fff; ggg=');
  cookie.setCookie('aaa=abc', url1);
  cookie.setCookie('ccc=cba\nasdf', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=abc; ccc=cba; eee=fff; ggg=');

  // maxAge
  cookie.setCookie('aaa=bbb; max-age=1', url1);
  await mock.sleep(1001);
  expect(cookie.getCookie(url1)).toBe('ccc=cba; eee=fff; ggg=');
  cookie.setCookie('ccc=ddd; max-age=-10', url1);
  expect(cookie.getCookie(url1)).toBe('eee=fff; ggg=');
  cookie.setCookie('eee=fff; max-age=', url1);
  expect(cookie.getCookie(url1)).toBe('eee=fff; ggg=');
  cookie.setCookie('eee=fff; max-age=abc', url1);
  expect(cookie.getCookie(url1)).toBe('eee=fff; ggg=');

  // expires
  cookie.setCookie(`eee=fff; expires=${(new Date(Date.now())).toUTCString()}`, url1);
  expect(cookie.getCookie(url1)).toBe('ggg=');
  cookie.setCookie(`ggg=fff; expires=${(new Date(Date.now() + 1000)).toUTCString()}`, url1);
  expect(cookie.getCookie(url1)).toBe('ggg=fff');
  await mock.sleep(1001);
  expect(cookie.getCookie(url1)).toBe('');

  // max-age 优先于 expires
  cookie.setCookie(`aaa=bbb; max-age=1000; expires=${(new Date(Date.now())).toUTCString()}`, url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb');
  cookie.setCookie(`aaa=bbb; max-age=0; expires=${(new Date(Date.now() + 1000 * 1000)).toUTCString()}`, url1);
  expect(cookie.getCookie(url1)).toBe('');

  // domain
  cookie.setCookie('aaa=bbb; domain=host.com', url1);
  cookie.setCookie('abc=cba; domain=sub.host.com', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba');
  cookie.setCookie('ccc=ddd; domain=xxx.sub.host.com', url1); // 不符合 domain，不写入 cookie
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba');
  cookie.setCookie('eee=fff; domain=xxx.sub.host.com', url2);
  cookie.setCookie('ggg=; domain=sub2.host.com', url3);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba');
  expect(cookie.getCookie(url2)).toBe('aaa=bbb; abc=cba; eee=fff');
  expect(cookie.getCookie(url3)).toBe('aaa=bbb; ggg=');

  // path
  cookie.setCookie('eee=fff; path=/p/a/t/x', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba');
  cookie.setCookie('ggg=hhh; path=/p/a/t', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba; ggg=hhh');
  cookie.setCookie('iii=jjj; path=/p/a/x', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba; ggg=hhh');
  cookie.setCookie('kkk=lll; path=/p/a', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba; ggg=hhh; kkk=lll');

  // secure
  cookie.setCookie('mmm=nnn; secure', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba; ggg=hhh; kkk=lll');
  expect(cookie.getCookie(url4)).toBe('aaa=bbb; abc=cba; ggg=hhh; kkk=lll; mmm=nnn');

  // httpOnly
  cookie.setCookie('ooo=ppp; httpOnly', url1);
  expect(cookie.getCookie(url1)).toBe('aaa=bbb; abc=cba; ggg=hhh; kkk=lll; ooo=ppp');
  expect(cookie.getCookie(url4)).toBe('aaa=bbb; abc=cba; ggg=hhh; kkk=lll; mmm=nnn');
});
