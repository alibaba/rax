global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import View from '../';

describe('View', () => {
  it('render tag view', () => {
    const component = renderer.create(
      <View>Example</View>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0]).toEqual('Example');
  });

  it('turn onPress to onClick', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <View onClick={mockPress}>Example</View>
    );
    let tree = component.toJSON();
    expect(tree.eventListeners.click).toBe(mockPress);
  });

  it('style in View', () => {
    const component = renderer.create(
      <View>Example</View>
    );
    let tree = component.toJSON();
    expect(tree.style.border).toBe('0 solid black');
    expect(tree.style.position).toBe('relative');
    expect(tree.style.boxSizing).toBe('border-box');
    expect(tree.style.display).toBe('flex');
    expect(tree.style.flexDirection).toBe('column');
    expect(tree.style.alignContent).toBe('flex-start');
    expect(tree.style.flexShrink).toBe(0);
  });

  it('children in View', () => {
    const component = renderer.create(
      <View>
        <View>Example</View>
      </View>
    );
    let tree = component.toJSON();
    expect(tree.children[0].children[0]).toBe('Example');
  });
});
