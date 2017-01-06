import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Slider from '../Slider';

jest.mock('universal-env');
describe('Slider in weex', () => {
  it('should render a slider', () => {
    const component = renderer.create(
      <Slider>Example</Slider>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('SLIDER');
  });
});

