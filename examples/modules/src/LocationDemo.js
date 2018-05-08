
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';

class LocationDemo extends Component {
  assign() {
    location.assign('//m.taobao.com');
  }

  replace() {
    location.replace('//m.taobao.com');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>location.hash</Text>
        <Text>{location.hash}</Text>
        <Text style={styles.title}>location.search</Text>
        <Text>{location.search}</Text>
        <Text style={styles.title}>location.pathname</Text>
        <Text>{location.pathname}</Text>
        <Text style={styles.title}>location.port</Text>
        <Text>{location.port}</Text>
        <Text style={styles.title}>location.hostname</Text>
        <Text>{location.hostname}</Text>
        <Text style={styles.title}>location.protocol</Text>
        <Text>{location.protocol}</Text>
        <Text style={styles.title}>location.origin</Text>
        <Text>{location.origin}</Text>
        <Text style={styles.title}>location.href</Text>
        <Text>{location.href}</Text>
        <Text style={styles.title}>location.assign()</Text>
        <Button onPress={this.assign}>click to assign</Button>
        <Text style={styles.title}>location.replace()</Text>
        <Button onPress={this.replace}>click to replace</Button>
        <Text style={styles.title}>location.reload()</Text>
        <Button onPress={location.reload}>click to reload</Button>
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

export default LocationDemo;
