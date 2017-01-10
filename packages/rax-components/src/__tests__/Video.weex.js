import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Video from '../Video';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  }
});

describe('Video in weex', () => {
  it('render tag Video', () => {
    const component = renderer.create(
      <Video />
    );
    let tree = component.toJSON();

    expect(tree.tagName).toEqual('VIDEO');
  });
});

