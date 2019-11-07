import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import { createMemoryHistory } from 'history';
import TabBar from '../../lib/TabBar/index';

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isNode: false,
    isWeChatMiniprogram: false,
    isWeb: true,
    isWeex: false
  };
});

const defaultPathname = '/';
const testProps = {
  history: createMemoryHistory(),
  config: {
    textColor: 'green',
    selectedColor: 'red',
    items: [
      {
        'name': 'welcome',
        'pagePath': '/'
      },
      {
        'name': 'page1',
        'pagePath': '/page1'
      },
      {
        'name': 'page2',
        'pagePath': '/page2'
      }
    ]
  }
};

describe('PWA TabBar', () => {
  it('render TabBar', () => {
    const component = renderer.create(
      <TabBar {...testProps} />
    );

    testProps.history.push('/');
    component.update(<TabBar {...testProps} />);

    const tree = component.toJSON();
    const firstTab = tree.children[0];
    const firstTabTxt = firstTab.children[0];
    const secondTab = tree.children[1];
    const secondTabTxt = secondTab.children[0];

    // check render
    expect(tree.children.length).toEqual(3);
    expect(firstTabTxt.tagName).toEqual('SPAN');

    // check select tab
    expect(firstTabTxt.style.color).toEqual(testProps.config.selectedColor);
    expect(secondTabTxt.style.color).toEqual(testProps.config.textColor);
  });

  it('click TabBar', () => {
    const component = renderer.create(
      <TabBar {...testProps} />
    );

    testProps.history.push('/');
    component.update(<TabBar {...testProps} />);

    const tree = component.toJSON();
    tree.children[1].eventListeners.click();
    component.update(<TabBar {...testProps} />);
    expect(tree.children[1].children[0].style.color).toEqual(testProps.config.selectedColor);
  });
});
