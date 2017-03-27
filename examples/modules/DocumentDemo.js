
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button,
} from 'rax-components';

const eventHandler = (e) => {
  alert('pressed');
};

class DocumentDemo extends Component {
  addListener = () => {
    document.addEventListener('press', eventHandler);
  }

  removeEventListener = () => {
    document.removeEventListener('press', this.eventHandler);
  }

  dispatchEvent = () => {
    // const event = new Event('press');
    // document.dispatchEvent(event);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>addEventListener()</Text>
        <Button onPress={this.addListener}>click to add 'press' listener</Button>
        <Text style={styles.title}>removeEventListener()</Text>
        <Button onPress={this.removeEventListener}>click to clear 'press' listener</Button>
        <Text style={styles.title}>dispatchEvent()</Text>
        <Button onPress={this.dispatchEvent}>click to dispatch 'press' event</Button>
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
  }
};

export default DocumentDemo;
