global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import TextInput from '../';

describe('TextInput', () => {
  it('render tag TextInput', () => {
    const component = renderer.create(
      <TextInput />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('INPUT');
  });


  it('style in TextInput', () => {
    const component = renderer.create(
      <TextInput />
    );
    let tree = component.toJSON();
    expect(tree.style.appearance).toBe('none');
    expect(tree.style.backgroundColor).toBe('transparent');
    expect(tree.style.borderColor).toBe('#000000');
    expect(tree.style.borderWidth).toBe(0);
    expect(tree.style.boxSizing).toBe('border-box');
    expect(tree.style.color).toBe('#000000');
    expect(tree.style.padding).toBe(0);
    expect(tree.style.paddingLeft).toBe(24);
    expect(tree.style.fontSize).toBe(24);
    expect(tree.style.lineHeight).toBe(60);
    expect(tree.style.height).toBe(60);
  });

  it('onInput & onChange', () => {
    const mockFunc = jest.fn();
    const component = renderer.create(
      <TextInput
        onInput={mockFunc}
        onChange={mockFunc}
        onBlur={mockFunc}
        onFocus={mockFunc}
      />
    );
    let tree = component.toJSON();
    expect(typeof tree.eventListeners.input).toBe('function');
    expect(typeof tree.eventListeners.change).toBe('function');
    expect(typeof tree.eventListeners.blur).toBe('function');
    expect(typeof tree.eventListeners.focus).toBe('function');
  });
});
