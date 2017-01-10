import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import Switch from '../Switch';

class SwitchTest extends Component {
  state = {
    value: true
  };
  render() {
    return <Switch value={this.state.value} onValueChange={(value) => { }} />;
  }
}

describe('Switch', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <SwitchTest />
    );
  });
  it('should render a switch', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('SPAN');
    expect(tree.children[0].tagName).toEqual('SMALL');
  });

  it('should handle click', () => {
    let tree = component.toJSON();
    expect(tree.style.backgroundColor).toEqual('#00e158');

    tree.eventListeners.click();
    tree = component.toJSON();
    expect(tree.style.backgroundColor).toEqual('#fff');
  });

  it('should change value with disabled', () => {
    let component = renderer.create(
      <Switch disabled={true} />
    );
    let tree = component.toJSON();
    expect(tree.style.backgroundColor).toEqual('#fff');
    tree.eventListeners.click();
    tree = component.toJSON();
    expect(tree.style.backgroundColor).toEqual('#fff');
  });
});

