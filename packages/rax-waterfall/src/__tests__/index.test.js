import Demo from '../index';
import renderer from 'rax-test-renderer';
import {createElement} from 'rax';

describe('Demo', () => {
  it('test demo', () => {
    const component = renderer.create(
      <Demo />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].tagName).toEqual('SPAN');
  });
});