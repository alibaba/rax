global.callNative = null;
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Video from '../';

describe('Video', () => {
  it('render tag Video', () => {
    const component = renderer.create(
      <Video />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('VIDEO');
    expect(tree.children[0].tagName).toEqual('SOURCE');
  });

  it('props on Video', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <Video />
    );
    let tree = component.toJSON();
    expect(tree.attributes.controls).toBe(true);
    expect(tree.attributes['webkit-playsinline']).toBe(true);
  });
});
