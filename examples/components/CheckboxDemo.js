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
import TouchableWithoutFeedback from 'rax-touchable';
import CheckBox from 'rax-checkbox';

class CheckboxDemo extends Component {
  state = {
    checked: false
  }
  render() {
    return (
      <View>
        <View style={styles.container}>
          <CheckBox
            checked={this.state.checked}
            containerStyle={{
              marginTop: 10,
            }}
            onChange={(checked) => {
              this.setState({
                checked
              });
            }} />
          <Text>checked: {this.state.checked}</Text>
          <Button onPress={() => this.setState({checked: true})}>set checked</Button>
        </View>
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

export default CheckboxDemo;
