import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import Switch from '../Switch';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  }
});

class SwitchTest extends Component {
  state = {
    value: true
  };
  render() {
    return <Switch value={this.state.value} onValueChange={(value) => {
      this.setState({
        value: false
      });
    }} />;
  }
}

describe('Switch in weex', () => {
  it('should render a switch', () => {
    const component = renderer.create(
      <SwitchTest />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('SWITCH');
  });

  it('should change a value', () => {
    const component = renderer.create(
      <SwitchTest />
    );
    let tree = component.toJSON();

    tree.eventListeners.change(false);
    tree = component.toJSON();
  });
});

