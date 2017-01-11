global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import TouchableHighlight from '../TouchableHighlight';

describe('TouchableHighlight', () => {
  it('render tag TouchableHighlight', () => {
    const component = renderer.create(
      <TouchableHighlight>Example</TouchableHighlight>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0]).toEqual('Example');
  });

  it('turn onPress', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <TouchableHighlight onPress={mockPress}>Example</TouchableHighlight>
    );
    let tree = component.toJSON();
    expect(tree.eventListeners.click).toBe(mockPress);
  });

  it('style in TouchableHighlight', () => {
    const component = renderer.create(
      <TouchableHighlight>Example</TouchableHighlight>
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

  it('children in TouchableHighlight', () => {
    const component = renderer.create(
      <TouchableHighlight>
        <TouchableHighlight>Example</TouchableHighlight>
      </TouchableHighlight>
    );
    let tree = component.toJSON();
    expect(tree.children[0].children[0]).toBe('Example');
  });
});

