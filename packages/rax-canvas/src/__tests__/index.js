import Canvas from '../index';
import renderer from 'rax-test-renderer';
import {createElement} from 'rax';

describe('canvas', () => {
  it('render canvas', () => {
    const component = renderer.create(
      <Canvas />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('CANVAS');
  });
});
