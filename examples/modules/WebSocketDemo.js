import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';

const WS_URI = 'ws://echo.websocket.org/';

class WebSocketDemo extends Component {
  state = {
    logText: ''
  }

  log = (text) => {
    this.setState({
      logText: this.state.logText + '\n' + text
    });
  }

  connect = () => {
    let websocket = this.websocket = new WebSocket(WS_URI);
    websocket.onopen = (evt) => {
      this.log('CONNECTED');

      let message = 'WebSocket rocks';
      this.log('SENT: ' + message);
      websocket.send(message);
    };

    websocket.onclose = (evt) => {
      this.log('DISCONNECTED');
    };

    websocket.onmessage = (evt) => {
      this.log('RESPONSE: ' + evt.data);

      websocket.close();
    };

    websocket.onerror = (evt) => {
      this.log('ERROR: ' + evt.data);
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>WebSocket</Text>
        <Button onPress={this.connect}>click to connect</Button>
        <View style={styles.logBox}>
          <Text>{this.state.logText}</Text>
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
  title: {
    color: '#217AC0',
    fontWeight: 700,
    paddingTop: 40,
    marginBottom: 20
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};

export default WebSocketDemo;
