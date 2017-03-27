
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import jsonp from 'universal-jsonp';

class JsonpDemo extends Component {
  state={
    data: {}
  }

  componentDidMount() {
    var self = this;

    jsonp('https://api.github.com/user/emails', {
      jsonpCallbackFunctionName: 'jsonpCb'
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      self.setState({
        data: data
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <pre>
          {JSON.stringify(this.state.data, null, '  ')}
        </pre>
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
    maringTop: 10,
    marginBottom: 5
  }
};

export default JsonpDemo;
