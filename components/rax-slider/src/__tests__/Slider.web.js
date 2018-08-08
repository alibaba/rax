import {createElement} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import renderer from 'rax-test-renderer';
import Slider from '../';

describe('Slider in web', () => {
  it('render correctly', () => {
    const mockChange = jest.fn();
    const component = renderer.create(
      <Slider width="750rem" height="352rem" autoPlay={true} loop={true}
        showsPagination={true}
        autoplayTimeout={3000}
        onChange={mockChange}>
        <View>
          <Image source={{uri: '//img.alicdn.com/tps/TB1m2LyJFXXXXbHXpXXXXXXXXXX-1125-352.jpg_q50.jpg'}} />
        </View>
        <View>
          <Image source={{uri: '//img.alicdn.com/tps/TB1ogUvJFXXXXaAXXXXXXXXXXXX-1125-352.jpg_q50.jpg'}} />
        </View>
        <View>
          <Image source={{uri: '//gw.alicdn.com/tps/i4/TB1pgxYJXXXXXcAXpXXrVZt0FXX-640-200.jpg_q50.jpg'}} />
        </View>
        <View>
          <Image source={{uri: '//img.alicdn.com/imgextra/i4/144/TB2o_begY0kpuFjy0FjXXcBbVXa_!!144-0-yamato.jpg_q50.jpg'}} />
        </View>
      </Slider>
    );
    let tree = component.toJSON();
    setTimeout(() => {
      expect(tree.children[0].attributes.transform).toEqual(' translate3d(-375px, 0px, 0px)');
      expect(mockChange).toHaveBeenCalled();
    }, 4000);
  });
});