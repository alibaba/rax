
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

class PerformanceDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>timing.domLoading</Text>
        <Text>{performance.timing.domLoading}</Text>
        <Text style={styles.title}>now()</Text>
        <Text>{performance.now()}</Text>
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

export default PerformanceDemo;
