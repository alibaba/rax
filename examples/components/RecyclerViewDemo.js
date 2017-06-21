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
import TouchableWithoutFeedback from 'rax-touchable';
import RecyclerView from 'rax-recyclerview';
import RefreshControl from 'rax-refreshcontrol';

let TouchableOpacity = TouchableWithoutFeedback;

class Thumb extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <RecyclerView.Cell>
        <View style={styles.button}>
          <View style={styles.box} />
        </View>
      </RecyclerView.Cell>
    );
  }
}

class Row extends Component {
  handleClick = (e) => {
    this.props.onClick(this.props.data);
  };

  render() {
    return (
     <TouchableWithoutFeedback onPress={this.handleClick} >
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.props.data.text + ' (' + this.props.data.clicks + ' clicks)'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

let THUMBS = [];
for (let i = 0; i < 20; i++) THUMBS.push(i);
let createThumbRow = (val, i) => <Thumb key={i} />;

class RecyclerViewDemo extends Component {
  state = {
    horizontalScrollViewEventLog: false,
    scrollViewEventLog: false,
  };

  render() {
    return (
      <View>

      <View style={styles.container}>
        <RecyclerView
          ref={(scrollView) => {
            this.scrollView = scrollView;
          }}
          style={{
            height: 500
          }}
          onEndReached={() => this.setState({scrollViewEventLog: true})}>

          <RecyclerView.Header style={styles.sticky}>
            <Text>Sticky view is not header</Text>
          </RecyclerView.Header>

          <RecyclerView.Header>
            <View style={styles.sticky}>
              <Text>Sticky view must in header root</Text>
            </View>
          </RecyclerView.Header>

          {THUMBS.map(createThumbRow)}

        </RecyclerView>

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
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    margin: 5,
  },
  text: {
    alignSelf: 'center',
    color: 'black',
  },
  refreshView: {
    height: 80,
    width: 750,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshArrow: {
    fontSize: 30,
    color: '#45b5f0'
  },
};


export default RecyclerViewDemo;
