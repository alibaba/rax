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

class LinkDemo extends Component {
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
          <Link onPress={this.handlePress1} href="https://github.com/alibaba/rax">Goto Github</Link>
          <View style={styles.logBox}>
            <Text>
              {textLog1}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Link onPress={this.handlePress2} href="https://github.com/alibaba/rax">
            <Image style={{width: 400, height: 343}} source={{uri: 'https://camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067'}} />
          </Link>
          <View style={styles.logBox}>
            <Text>
              {textLog2}
            </Text>
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

export default LinkDemo;
