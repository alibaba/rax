global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Touchable from '../';

describe('Touchable', () => {
  it('render tag Touchable', () => {
    const component = renderer.create(
      <Touchable>Example</Touchable>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0]).toEqual('Example');
  });

  it('turn onPress', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <Touchable onPress={mockPress}>Example</Touchable>
    );
    let tree = component.toJSON();
    expect(tree.eventListeners.click).toBe(mockPress);
  });

  it('style in Touchable', () => {
    const component = renderer.create(
      <Touchable>Example</Touchable>
    );
    let tree = component.toJSON();
    expect(tree.style.border).toBe('0 solid black');
    expect(tree.style.position).toBe('relative');
    expect(tree.style.boxSizing).toBe('border-box');
    expect(tree.style.display).toBe('flex');
    expect(tree.style.flexDirection).toBe('column');
    expect(tree.style.alignContent).toBe('flex-start');
    expect(tree.style.cursor).toBe('pointer');
  });

  it('children in Touchable', () => {
    const component = renderer.create(
      <Touchable>
        <Touchable>Example</Touchable>
      </Touchable>
    );
    let tree = component.toJSON();
    expect(tree.children[0].children[0]).toBe('Example');
  });
});
