import { createMemoryHistory } from 'history';
import setTitle from '../setTitle';

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isNode: false,
    isWeChatMiniprogram: false,
    isWeb: true,
    isWeex: false
  };
});

const history = createMemoryHistory();
const appConfig = {
  'routes': [
    {
      'path': '/',
      'source': 'pages/Home/index',
      'window': {
        'title': 'home'
      }
    },
    {
      'path': '/page1',
      'source': 'pages/Page1/index',
      'window': {
        'title': 'page1'
      }
    },
    {
      'path': '/page2',
      'source': 'pages/Page2/index'
    }
  ],
  'window': {
    'title': 'Rax App 1.0'
  },
};

describe('rax-app set title', () => {
  beforeEach(function() {
    global.document = {};
  });

  it('path `/` title should be "home"', () => {
    history.push('/');
    setTitle(history, appConfig);
    expect(document.title).toEqual('home');
  });

  it('path `/page2` title should be "Rax App 1.0"', () => {
    history.push('/page2');
    setTitle(history, appConfig);
    expect(document.title).toEqual('Rax App 1.0');
  });
});