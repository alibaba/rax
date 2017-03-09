import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Slider from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Slider in weex', () => {
  it('should render a slider', () => {
    const component = renderer.create(
      <Slider>Example</Slider>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('SLIDER');
  });
});
