
import {createElement, Component} from 'rax';
import {
  View,
  Text,
} from 'rax-components';

class ScreenDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>width</Text>
        <Text>{screen.width}</Text>
        <Text style={styles.title}>height</Text>
        <Text>{screen.height}</Text>
        <Text style={styles.title}>availWidth</Text>
        <Text>{screen.availWidth}</Text>
        <Text style={styles.title}>availHeight</Text>
        <Text>{screen.availHeight}</Text>
        <Text style={styles.title}>colorDepth</Text>
        <Text>{screen.colorDepth}</Text>
        <Text style={styles.title}>pixelDepth</Text>
        <Text>{screen.pixelDepth}</Text>
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

export default ScreenDemo;
