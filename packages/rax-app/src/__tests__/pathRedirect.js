import { createMemoryHistory } from 'history';
import pathRedirect from '../pathRedirect';

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isNode: false,
    isWeChatMiniProgram: false,
    isWeb: true,
    isWeex: false
  };
});

const history = createMemoryHistory();
const routes = [
  {
    'path': '/',
    'source': 'pages/Home/index'
  },
  {
    'path': '/page1',
    'source': 'pages/Page1/index',
  },
  {
    'path': '/page2',
    'source': 'pages/Page2/index'
  }
];

describe('rax-app path redirect', () => {
  beforeEach(function() {
    delete global.window.location;
  });

  it('url `xxx.com/?_path=/page1#/?_path=/page2` should redirect to /page1', () => {
    global.window.location = { search: '?_path=/page1' };
    history.push('/?_path=/page2');

    pathRedirect(history, routes);
    expect(history.location.pathname).toEqual('/page1');
  });

  it('url `xxx.com/?xxx_path=/page1&a_path=/page1#/?_path=/page2` should redirect to /page2', () => {
    global.window.location = { search: '?xxx_path=/page1&a_path=/page1' };
    history.push('/?_path=/page2');

    pathRedirect(history, routes);
    expect(history.location.pathname).toEqual('/page2');
  });

  it('url `xxx.com/?xxx_path=/page1&a_path=/page1#/` should do nothing', () => {
    global.window.location = { search: '?xxx_path=/page1&a_path=/page1' };
    history.push('/');

    pathRedirect(history, routes);
    expect(history.location.pathname).toEqual('/');
  });
});
