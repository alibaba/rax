import { createElement, Component, render } from 'rax';
import { View, Text } from 'rax-components';
import { isWeex, isWeb } from 'universal-env';
import name from './name';

class App extends Component {
  render() {
    if (isWeex) {
      return <View style={styles.container}>
        <Text>Hello {name}</Text>
      </View>;
    } else {
      return <div>
        hello {name}
      </div>;
    }
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
