
import {createElement, Component} from 'rax';
import {
  View,
  Text
} from 'rax-components';

const url = new URL('https://example.com?foo=1&bar=2');

class URLDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>href</Text>
        <Text>{url.href}</Text>
        <Text style={styles.title}>origin</Text>
        <Text>{url.origin}</Text>
        <Text style={styles.title}>searchParams</Text>
        <Text>{url.searchParams}</Text>
        <Text style={styles.title}>toString()</Text>
        <Text>{url.toString()}</Text>
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

export default URLDemo;
