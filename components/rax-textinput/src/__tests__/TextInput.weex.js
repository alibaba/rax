import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import TextInput from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('TextInput in weex', () => {
  it('render tag TextInput', () => {
    const component = renderer.create(
      <TextInput />
    );
    let tree = component.toJSON();

    expect(tree.tagName).toEqual('INPUT');
    expect(tree.attributes.disabled).toEqual(false);
  });
});
