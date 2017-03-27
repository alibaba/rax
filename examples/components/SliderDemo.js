import {Component, createElement, render} from 'rax';
import {
  Text,
  View,
  Button,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'rax-components';
import Slider from 'rax-slider';

let styles = {
  slider: {
    width: 750,
    position: 'relative',
    overflow: 'hidden',
    height: 500,
    backgroundColor: '#cccccc'
  },
  itemWrap: {
    width: 750,
    height: 500
  },
  image: {
    width: 750,
    height: 500
  },
  button: {
    marginTop: 20,
    width: 340,
    height: 80
  },
  paginationStyle: {
    position: 'absolute',
    width: 750,
    height: 40,
    bottom: 20,
    left: 0,
    itemColor: 'rgba(255, 255, 255, 0.5)',
    itemSelectedColor: 'rgb(255, 80, 0)',
    itemSize: 16
  }
};

class SlideDemo extends Component {
  constructor(props) {
    super(props);
  }

  onchange = (index) => {
    console.log('change', index);
  }

  render() {
    return (
      <Slider className="slider" width="750rem" height="500rem" style={styles.slider}
        autoPlay={false}
        loop={true}
        showsPagination={true}
        paginationStyle={styles.paginationStyle}
        autoplayTimeout={3000}
        onChange={this.onchange}>
        <View style={styles.itemWrap}>
          <Image style={styles.image} source={{uri: '//gw.alicdn.com/tfs/TB19NbqKFXXXXXLXVXXXXXXXXXX-750-500.png'}} />
        </View>
        <View style={styles.itemWrap}>
          <Image style={styles.image} source={{uri: '//gw.alicdn.com/tfs/TB1tWYBKFXXXXatXpXXXXXXXXXX-750-500.png'}} />
        </View>
        <View style={styles.itemWrap}>
          <Image style={styles.image} source={{uri: '//gw.alicdn.com/tfs/TB1SX_vKFXXXXbyXFXXXXXXXXXX-750-500.png'}} />
        </View>
      </Slider>
    );
  }
}

export default SlideDemo;
