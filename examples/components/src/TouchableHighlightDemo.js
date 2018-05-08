import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import ScrollView from 'rax-scrollview';
import TouchableHighlight from 'rax-touchable';

class TouchableHighlightDemo extends Component {
  state = {
    eventLog: [],
  };

  _appendEvent = (eventName) => {
    var limit = 6;
    var eventLog = this.state.eventLog.slice(0, limit - 1);
    eventLog.unshift(eventName);
    this.setState({eventLog});
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => this._appendEvent('press')}
          delayPressIn={400}
          onPressIn={() => this._appendEvent('pressIn - 400ms delay')}
          delayPressOut={1000}
          onPressOut={() => this._appendEvent('pressOut - 1000ms delay')}
          delayLongPress={800}
          onLongPress={() => this._appendEvent('longPress - 800ms delay')}
          style={{
            width: '230rem',
            height: '60rem',
            paddingTop: '12rem',
            paddingBottom: '12rem',
            paddingLeft: '25rem',
            paddingRight: '25rem',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#efefef',
          }}>
          <Text>Touch Me</Text>
        </TouchableHighlight>

        <View style={styles.eventLogBox}>
          {this.state.eventLog.map((e, ii) => <Text key={ii}>{e}</Text>)}
        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  eventLogBox: {
    padding: 10,
    margin: 10,
    height: 260,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};

export default TouchableHighlightDemo;
