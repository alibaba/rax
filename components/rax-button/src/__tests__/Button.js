import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import Button from '../';

class ButtonTest extends Component {
  state = {
    buttonText: 'normal'
  };
  render() {
    return <Button onPress={() => {
      this.setState({
        buttonText: 'click'
      });
    }}>{this.state.buttonText}</Button>;
  }
}
describe('Button', () => {
  it('should render a button', () => {
    const component = renderer.create(
      <ButtonTest />
    );
    let tree = component.toJSON();

    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children[0]).toEqual('normal');
    expect(tree).toMatchSnapshot();

    tree.eventListeners.click();

    tree = component.toJSON();
    expect(tree.children[0].children[0]).toEqual('click');
  });
});
