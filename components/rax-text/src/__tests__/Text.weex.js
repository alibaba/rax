import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Text from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Text in weex', () => {
  it('render tag Text', () => {
    const component = renderer.create(
      <Text>Example</Text>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('TEXT');
    expect(tree.attributes.value).toEqual('Example');
  });
});
