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

class TextAreaDemo extends Component {
  state = {
    text: 'Hello #World , Hello #Rax , Hello #天天好心情'
  };

  render() {
    let delimiter = /\s+/;

    // split string
    let _text = this.state.text;
    let token, index, parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);

    let hashtags = [];
    parts.forEach((text) => {
      if (/^#/.test(text)) {
        hashtags.push(<Text key={text} style={styles.hashtag}>{text}</Text>);
      }
    });

    return (
      <View style={styles.container}>
        <TextInput
          multiline={true}
          style={styles.multiline}
          value={this.state.text}
          onChangeText={(text) => {
            this.setState({text});
          }} />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {hashtags}
        </View>
      </View>
    );
  }
}

class TextInputDemo extends Component {

  state = {
    value: 'I am value',
    curText: '<No Event>',
    prevText: '<No Event>',
    prev2Text: '<No Event>',
    prev3Text: '<No Event>',
  };

  updateText = (text) => {
    this.setState((state) => {
      return {
        curText: text,
        prevText: state.curText,
        prev2Text: state.prevText,
        prev3Text: state.prev2Text,
      };
    });
  };

  render() {
    // define delimiter

    return (
      <View>
        <View style={styles.container}>

          <TextInput
            autoCapitalize="none"
            placeholder="Enter text to see events"
            autoCorrect={false}
            onFocus={() => this.updateText('onFocus')}
            onBlur={() => this.updateText('onBlur')}
            onChange={(event) => this.updateText(
              'onChange text: ' + event.nativeEvent.text
            )}
            onInput={(event) => this.updateText(
              'onInput text: ' + event.nativeEvent.text
            )}
            style={styles.default}
          />

          <Text style={styles.eventLabel}>
            {this.state.curText}{'\n'}
            (prev: {this.state.prevText}){'\n'}
            (prev2: {this.state.prev2Text}){'\n'}
            (prev3: {this.state.prev3Text})
          </Text>
        </View>

        <View style={styles.container}>
          <TextInput
            placeholder="Enter text to see events"
            value={this.state.value}
            ref="input"
            style={{
              width: 600,
              marginTop: 20,
              borderWidth: '1px',
              borderColor: '#dddddd',
              borderStyle: 'solid',
            }}
            />

          <Button
            style={{
              marginTop: 20,
            }}
            onPress={() => this.refs.input.clear()}
          >
            Reset
          </Button>

        </View>

        <TextAreaDemo />
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
  default: {
    borderWidth: 1,
    borderColor: '#0f0f0f',
    flex: 1,
  },
  eventLabel: {
    margin: 3,
    fontSize: 24,
  },
  multiline: {
    borderWidth: 1,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 26,
    height: 100,
    padding: 8,
    marginBottom: 8,
  },
  hashtag: {
    color: 'blue',
    margin: 10,
    fontWeight: 'bold',
  },
};

export default TextInputDemo;
