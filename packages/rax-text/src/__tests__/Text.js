global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Text from '../';

describe('Text', () => {
  it('render tag Text', () => {
    const component = renderer.create(
      <Text>Example</Text>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('SPAN');
    expect(tree.children[0]).toEqual('Example');
  });

  it('style in Text', () => {
    const component = renderer.create(
      <Text>Example</Text>
    );
    let tree = component.toJSON();
    expect(tree.style.border).toBe('0 solid black');
    expect(tree.style.position).toBe('relative');
    expect(tree.style.boxSizing).toBe('border-box');
    expect(tree.style.display).toBe('block');
    expect(tree.style.flexDirection).toBe('column');
    expect(tree.style.alignContent).toBe('flex-start');
    expect(tree.style.flexShrink).toBe(0);
    expect(tree.style.fontSize).toBe(32);
  });
});
