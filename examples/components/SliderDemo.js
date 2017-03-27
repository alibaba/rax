import {Component, createElement, render } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Slider from 'rax-slider';

class SliderDemo extends Component {
  onChange(index) {
    console.log('change', index);
  }

  render() {
    return (
      <View style={styles.container}>
        <Slider className="slider" width="750rem" height="352rem" style={styles.slider}
          autoPlay={true}
          loop={true}
          showsPagination={true}
          paginationStyle={styles.paginationStyle}
          autoplayTimeout={3000}
          onChange={this.onChange}>
          <View style={styles.itemWrap}>
            <Image style={styles.image} source={{uri: '//img.alicdn.com/tps/TB1m2LyJFXXXXbHXpXXXXXXXXXX-1125-352.jpg_q50.jpg'}} />
          </View>
          <View style={styles.itemWrap}>
            <Image style={styles.image} source={{uri: '//img.alicdn.com/tps/TB1ogUvJFXXXXaAXXXXXXXXXXXX-1125-352.jpg_q50.jpg'}} />
          </View>
          <View style={styles.itemWrap}>
            <Image style={styles.image} source={{uri: '//gw.alicdn.com/tps/i4/TB1pgxYJXXXXXcAXpXXrVZt0FXX-640-200.jpg_q50.jpg'}} />
          </View>
          <View style={styles.itemWrap}>
            <Image style={styles.image} source={{uri: '//gw.alicdn.com/imgextra/i4/3/TB2STElaohnpuFjSZFPXXb_4XXa_!!3-0-yamato.jpg_q50.jpg'}} />
          </View>
        </Slider>
      </View>
    );
  }
}

const styles = {
  container: {
    width: 750
  },
  slider: {
    width: '750rem',
    position: 'relative',
    overflow: 'hidden',
    height: '252rem',
    backgroundColor: '#cccccc'
  },
  itemWrap: {
    width: '750rem',
    height: '252rem'
  },
  image: {
    width: '750rem',
    height: '252rem'
  },
  button: {
    marginTop: '20rem',
    width: '340rem',
    height: '80rem'
  },
  paginationStyle: {
    position: 'absolute',
    width: '750rem',
    height: '40rem',
    bottom: '20rem',
    left: 0,
    itemColor: 'rgba(255, 255, 255, 0.5)',
    itemSelectedColor: 'rgb(255, 80, 0)',
    itemSize: '8rem'
  },
  text: {
    fontSize: 50
  }
};

export default SliderDemo;
