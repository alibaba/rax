
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button
} from 'rax-components';
import {isWeb, isWeex, isNode, isReactNative} from 'universal-env';

class Base64Demo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>isWeb</Text>
        <Text>{isWeb}</Text>
        <Text style={styles.title}>isWeex</Text>
        <Text>{isWeex}</Text>
        <Text style={styles.title}>isNode</Text>
        <Text>{isNode}</Text>
        <Text style={styles.title}>isReactNative</Text>
        <Text>{isReactNative}</Text>
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
