
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

let params = new URLSearchParams('key1=value1&key2=value2');

class URLSearchParamsDemo extends Component {
  appendParams = () => {
    params.append('key1', 'a');
    return 'params.append(\'key1\', \'a\'): ' + params.toString();
  }

  deleteParams = () => {
    params.delete('key2');
    return 'params.delete(\'key2\'): ' + params.toString();
  }

  setParams = () => {
    params.set('key2', 'b');
    return 'params.set(\'key2\', \'b\'): ' + params.toString();
  }

  entriesOfParams = () => {
    var str = '';
    for (var pair of params.entries()) {
      str += pair[0] + ': ' + pair[1] + '; ';
    }
    return str;
  }

  keysOfParams = () => {
    var str = '';
    for (var key of params.keys()) {
      str += key + ' ';
    }
    return str;
  }

  valuesOfParams = () => {
    var str = '';
    for (var value of params.values()) {
      str += value + ' ';
    }
    return str;
  }

  render() {
    let symbolDemos = [];
    if (typeof Symbol !== 'undefined' && params[Symbol.iterator]) {
      symbolDemos = [
        <Text style={styles.title}>keys()</Text>,
        <Text>{this.keysOfParams()}</Text>,
        <Text style={styles.title}>values()</Text>,
        <Text>{this.valuesOfParams()}</Text>,
        <Text style={styles.title}>entries()</Text>,
        <Text>{this.entriesOfParams()}</Text>,
      ];
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>toString()</Text>
        <Text>{params.toString()}</Text>
        <Text style={styles.title}>append()</Text>
        <Text>{this.appendParams()}</Text>
        <Text style={styles.title}>delete()</Text>
        <Text>{this.deleteParams()}</Text>
        <Text style={styles.title}>get()</Text>
        <Text>{'params.get(\'key1\'): ' + params.get('key1')}</Text>
        <Text style={styles.title}>getAll()</Text>
        <Text>{'params.get(\'key1\'): ' + params.getAll('key1')}</Text>
        <Text style={styles.title}>has()</Text>
        <Text>{'params.has(\'key1\'): ' + params.has('key1')}</Text>
        <Text style={styles.title}>set()</Text>
        <Text>{this.setParams()}</Text>
        {symbolDemos}
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

export default URLSearchParamsDemo;
