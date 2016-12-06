import {createElement, Component, render} from 'rax';
import {View, Text} from 'rax-components';

class App extends Component {
  render() {
    return <View style={styles.container}>
      <Text>Hello world</Text>
    </View>;
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

render(<App />);
