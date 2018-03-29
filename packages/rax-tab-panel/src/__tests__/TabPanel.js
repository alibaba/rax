import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import View from 'rax-view';
import Text from 'rax-text';
import {TabController, TabPanel, TabPanelLink, TabPanelView} from '../index';


class TabPanelTest extends Component {
  render() {
    return (<TabController>
    		<TabPanel>
    			<TabPanelLink href={'//github.com'}>1</TabPanelLink>
    			<TabPanelView><Text>1</Text></TabPanelView>
    		</TabPanel>
    		<TabPanel>
    			<TabPanelLink href={'//github.com'}>2</TabPanelLink>
    			<TabPanelView><Text>1</Text></TabPanelView>
    		</TabPanel>
    	</TabController>);
  }
}

describe('TabPanel', () => {
  it('test demo', () => {
    const component = renderer.create(<TabPanelTest />);
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].tagName).toEqual('DIV');
  });
});