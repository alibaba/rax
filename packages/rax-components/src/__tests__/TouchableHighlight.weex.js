import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import TouchableHighlight from '../TouchableHighlight';

jest.mock('universal-env');
describe('TouchableHighlight in weex', () => {
  it('render tag TouchableHighlight', () => {
    const component = renderer.create(
      <TouchableHighlight>Example</TouchableHighlight>
    );
    let tree = component.toJSON();

    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0]).toEqual('Example');
  });
});

