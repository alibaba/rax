import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import Text from 'rax-text';
import { createMemoryHistory } from 'history';
import Navigation from '../../lib/Navigation/index';

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isNode: false,
    isWeChatMiniprogram: false,
    isWeb: true,
    isWeex: false
  };
});

const mockDynamicImport = (pageName) => {
  return () => new Promise((resolve) => {
    resolve(() => <Text >Page: {pageName}</Text>);
  });
};

const testProps = {
  'history': createMemoryHistory(),
  'routes': [
    {
      'path': '/',
      'keepAlive': true,
      'source': 'pages/Home/index',
      component: mockDynamicImport('Home')
    },
    {
      'path': '/page1',
      'keepAlive': true,
      'source': 'pages/Page1/index',
      component: mockDynamicImport('Page1')
    },
    {
      'path': '/page2',
      'source': 'pages/Page2/index',
      component: mockDynamicImport('Page2')
    },
  ],
  appConfig: {
    'tabBar': {
      'textColor': 'green',
      'selectedColor': 'red',
      'items': [
        {
          'name': 'welcome',
          'path': '/'
        },
        {
          'name': 'page1',
          'path': '/page1'
        },
        {
          'name': 'page2',
          'path': '/page2'
        }
      ]
    }
  },
  component: () => {
    return <Text >Page: ROUTER</Text>;
  }
};


describe('PWA Navigation', () => {
  beforeEach(function() {
    jest.useFakeTimers();
  });
  it('render Navigation', async() => {
    const component = renderer.create(
      <Navigation {...testProps} />
    );

    testProps.history.push('/');
    // await dynamic import
    await component.update(<Navigation {...testProps} />);
    let tree = component.toJSON();

    // There 2 alive page placeholder and 3 tabs;
    expect(tree[0].children.length).toEqual(2);
    expect(tree[1].children.length).toEqual(3);

    // Fist page shown and first tab selected
    expect(tree[0].children[0].style.display).toEqual('block');
    expect(tree[1].children[0].children[0].style.color).toEqual('red');


    testProps.history.push('/page2');
    await component.update(<Navigation {...testProps} />);

    tree = component.toJSON();
    expect(tree[0].children[0]).toEqual('Page: ROUTER');
    expect(tree[1].children.length).toEqual(2);
    expect(tree[2].children.length).toEqual(3);

    // Fist page hide and third tab selected
    expect(tree[1].children[0].style.display).toEqual('none');
    expect(tree[2].children[2].children[0].style.color).toEqual('red');
  });
});
