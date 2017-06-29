import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableOpacity from 'rax-touchable';
import RecyclerView from 'rax-recyclerview';
import RefreshControl from 'rax-refreshcontrol';

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
