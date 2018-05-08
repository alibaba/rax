import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import ScrollView from 'rax-scrollview';
import Parallax from 'rax-parallax';
import {isWeex} from 'universal-env';

let data = [];

for (let i = 0; i < 20; i++) {
  data.push(i);
}

class ParallaxDemo extends Component {
  state = {}

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        bindingScroller: this.refs.scrollView
      });
    }, 100);
  }

  render() {
    return (
      <View style={styles.container}>
        <Parallax
          bindingScroller={this.state.bindingScroller}
          transform={[
            {
              type: 'translate',
              in: [0, 660],
              out: [0, 0, 0, -660] // [x1,y1,x2,y2]
            },
            {
              type: 'scale',
              in: [-150, 0],
              out: [1.3, 1.3, 1, 1] // [x1,y1,x2,y2]
            }

          ]}>
          <Image style={{width: 750, height: 576}}
            source={{uri: '//gw.alicdn.com/tfs/TB12DNfXMmTBuNjy1XbXXaMrVXa-750-576.png'}} />
        </Parallax>
        <ScrollView style={styles.scrollView} ref={'scrollView'}>
          <View>
            {data.map((item, i) => {
              return <View style={styles.row}>
                <Text>{i}</Text>
              </View>;
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = {
  container: {
    width: 750,
    height: 750,
    overflow: 'hidden'
  },
  row: {
    height: 300
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    width: 750,
    height: 750
  }
};

export default ParallaxDemo;
