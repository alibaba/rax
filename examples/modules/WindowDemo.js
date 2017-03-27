
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button
} from 'rax-components';

class WindowDemo extends Component {
  alert = () => {
    alert('this is an alert box');
  }

  openPage = () => {
    window.open('//www.taobao.com');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>devicePixelRatio</Text>
        <Text>{window.devicePixelRatio}</Text>
        <Text style={styles.title}>alert()</Text>
        <Button onPress={this.alert}>click to  display an alert box</Button>
        <Text style={styles.title}>open()</Text>
        <Button onPress={this.openPage}>click to open page </Button>
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

export default WindowDemo;
