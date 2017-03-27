
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button
} from 'rax-components';
import {OS} from 'universal-platform';

class PlatformDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>OS</Text>
        <Text>{OS}</Text>
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

export default PlatformDemo;
