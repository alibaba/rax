import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableOpacity from 'rax-touchable';
import RecyclerView from 'rax-recyclerview';
import RefreshControl from 'rax-refreshcontrol';

class Thumb extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <View style={styles.button}>
        <View style={styles.box} />
      </View>
    );
  }
}

let THUMBS = [];
for (let i = 0; i < 20; i++) THUMBS.push(i);
let createThumbRow = (val, i) => <Thumb key={i} />;

class ScrollViewDemo extends Component {
  state = {
    horizontalScrollViewEventLog: false,
    scrollViewEventLog: false,
  };

  render() {
    return (
      <View>
      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => {
            this.horizontalScrollView = scrollView;
          }}
          style={{
            height: 100,
          }}
          horizontal={true}
          onEndReached={() => this.setState({horizontalScrollViewEventLog: true})}
        >
          {THUMBS.map(createThumbRow)}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.horizontalScrollView.scrollTo({x: 0})}>
          <Text>Scroll to start</Text>
        </TouchableOpacity>

        <View style={styles.eventLogBox}>
          <Text>{this.state.horizontalScrollViewEventLog ? 'onEndReached' : ''}</Text>
        </View>

      </View>

      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => {
            this.scrollView = scrollView;
          }}
          style={{
            height: 500,
          }}
          onEndReached={() => this.setState({scrollViewEventLog: true})}>

          <View>
            <View style={styles.sticky}>
              <Text>Cannot sticky</Text>
            </View>
          </View>

          <View style={styles.sticky}>
            <Text>Sticky view must in ScrollView root</Text>
          </View>

          {THUMBS.map(createThumbRow)}

        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.scrollView.scrollTo({y: 0})}>
          <Text>Scroll to top</Text>
        </TouchableOpacity>

        <View style={styles.eventLogBox}>
          <Text>{this.state.scrollViewEventLog ? 'onEndReached' : ''}</Text>
        </View>

      </View>

      </View>
    );
  }
}

let styles = {
  sticky: {
    position: 'sticky',
    width: 750,
    backgroundColor: '#cccccc'
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  box: {
    width: 64,
    height: 64,
  },
  eventLogBox: {
    padding: 10,
    margin: 10,
    height: 80,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};


export default ScrollViewDemo;
