import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import View from 'rax-view';
import Text from 'rax-text';
import {TabController, TabPanel} from '../index';


class TabPanelTest extends Component {
  render() {
    return (<TabController>
    		<TabPanel>
    			<Text>1</Text>
    		</TabPanel>
    	</TabController>);
  }
}

describe('TabPanel', () => {
  it('test demo', () => {
    const component = renderer.create(<TabPanelTest />);
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    // expect(tree.children[0].tagName).toEqual('SPAN');
  });
});