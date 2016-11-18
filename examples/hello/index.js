import {createElement, Component, render} from 'universal-rx';
import {View, Text} from 'rx-components';

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
