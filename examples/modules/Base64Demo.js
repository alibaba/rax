
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button
} from 'rax-components';

var encodedData = window.btoa('Hello, world'); // encode a string
var decodedData = window.atob(encodedData); // decode the string

class Base64Demo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>btoa()</Text>
        <Text>{encodedData}</Text>
        <Text style={styles.title}>atob()</Text>
        <Text>{decodedData}</Text>
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

export default Base64Demo;
