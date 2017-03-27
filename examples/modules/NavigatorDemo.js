
import {createElement, Component} from 'rax';
import {
  View,
  Text,
} from 'rax-components';

class NavigatorDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>navigator.platform</Text>
        <Text>{navigator.platform}</Text>
        <Text style={styles.title}>navigator.product</Text>
        <Text>{navigator.product}</Text>
        <Text style={styles.title}>navigator.appName</Text>
        <Text>{navigator.appName}</Text>
        <Text style={styles.title}>navigator.appVersion</Text>
        <Text>{navigator.appVersion}</Text>
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

export default NavigatorDemo;
