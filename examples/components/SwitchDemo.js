
import {createElement, Component, setNativeProps, findDOMNode} from 'rax';
import {
  View,
  Text,
  Image,
  Link,
  TextInput,
  Button,
  Switch,
  Video,
  ScrollView,
  TouchableHighlight} from 'rax-components';

class SwitchDemo extends Component {
  state = {
    eventSwitchIsOn: false,
    eventSwitchRegressionIsOn: true,
  };
  render() {
    return (
      <View style={styles.container}>
        <Switch onValueChange={(value) => {
          this.setState({eventSwitchIsOn: value});
        }}
          style={{marginBottom: 10}}
          value={this.state.eventSwitchIsOn} />

        <Text>{this.state.eventSwitchIsOn ? 'On' : 'Off'}</Text>

        <Switch
          onValueChange={(value) => this.setState({eventSwitchRegressionIsOn: value})}
          style={{marginBottom: 10}}
          value={this.state.eventSwitchRegressionIsOn} />
        <Text>{this.state.eventSwitchRegressionIsOn ? 'On' : 'Off'}</Text>

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
};

export default SwitchDemo;
