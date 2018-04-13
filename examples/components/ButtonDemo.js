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

class ButtonDemo extends Component {
  state = {
    timesPressed1: 0,
    timesPressed2: 0,
  };

  handlePress1 = () => {
    this.setState({
      timesPressed1: this.state.timesPressed1 + 1,
    });
  };

  handlePress2 = () => {
    this.setState({
      timesPressed2: this.state.timesPressed2 + 1,
    });
  };

  render() {
    var textLog1 = '';
    if (this.state.timesPressed1 > 1) {
      textLog1 = this.state.timesPressed1 + 'x onPress';
    } else if (this.state.timesPressed1 > 0) {
      textLog1 = 'onPress';
    }

    var textLog2 = '';
    if (this.state.timesPressed2 > 1) {
      textLog2 = this.state.timesPressed2 + 'x onPress';
    } else if (this.state.timesPressed2 > 0) {
      textLog2 = 'onPress';
    }

    return (
      <View>
        <View style={styles.container}>
          <Button onPress={this.handlePress1}>Button</Button>
          <View style={styles.logBox}>
            <Text>
              {textLog1}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Button onPress={this.handlePress2}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#666666',
              padding: 16,
            }}>
              <Image style={{width: 36, height: 36, marginRight: 6}} source={{uri: 'http://img2.tbcdn.cn/L1/461/1/126ba1d7397f0024a6fa785d72402ff112ee179e'}} />
              <Text>Pokeball</Text>
            </View>
          </Button>

          <View style={styles.logBox}>
            <Text>
              {textLog2}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              title="This looks great!"
            />
            <Button
              title="Ok!"
              color="#841584"
            />
          </View>
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
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};

export default ButtonDemo;
