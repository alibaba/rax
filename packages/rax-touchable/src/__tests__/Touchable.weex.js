import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Touchable from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Touchable in weex', () => {
  it('render tag Touchable', () => {
    const component = renderer.create(
      <Touchable>Example</Touchable>
    );
    let tree = component.toJSON();

    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0]).toEqual('Example');
  });
});
