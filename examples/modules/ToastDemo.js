
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button,
} from 'rax-components';
import Toast from 'universal-toast';

class ToastDemo extends Component {
  showToast = () => {
    Toast.show('Hi');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>show()</Text>
        <Button onPress={this.showToast}>click to show toast</Button>
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

export default ToastDemo;
