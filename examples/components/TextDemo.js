import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import ScrollView from 'rax-scrollview';
import TouchableOpacity from 'rax-touchable';

class TextDemo extends Component {

  state = {
    timesPressed: 0,
  };

  textOnPress = () => {
    this.setState({
      timesPressed: this.state.timesPressed + 1,
    });
  };

  render() {
    var textLog = '';
    if (this.state.timesPressed > 1) {
      textLog = this.state.timesPressed + 'x text onPress';
    } else if (this.state.timesPressed > 0) {
      textLog = 'text onPress';
    }

    return (
      <View>
        <View style={{...styles.container, ...{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}}>
          <Text>文字</Text>
          <Text style={{
            color: '#ff4200'
          }}>混排</Text>
        </View>

        <View style={styles.container}>
          <Text numberOfLines={1} style={{
            width: 200,
            textOverflow: 'ellipsis',
          }}>超出被截断的文本</Text>

          <Text numberOfLines={2} style={{
            width: 200,
            textOverflow: 'ellipsis',
          }}>超出被截断的文本，超出被截断的文本，超出被截断的文本，超出被截断的文本</Text>
        </View>

        <View style={styles.container}>
          <Text
            style={styles.textBlock}
            onPress={this.textOnPress}>
            Text has built-in onPress handling
          </Text>
          <View style={styles.logBox}>
            <Text>
              {textLog}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={{textDecoration: 'underline'}}>
            Solid underline
          </Text>
          <Text style={{textDecorationLine: 'none'}}>
            None textDecoration
          </Text>
          <Text style={{textDecoration: 'line-through'}}>
            Solid line-through
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={{lineHeight: '120rem'}}>
            A lot of space between the lines of this long passage that should
            wrap once.
          </Text>
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
  textBlock: {
    fontWeight: '500',
    color: 'blue',
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
};

export default TextDemo;
