
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button
} from 'rax-components';

class FontFaceDemo extends Component {
  componentDidMount() {
    var testFontFace = new FontFace('Test', "url('//at.alicdn.com/t/font_lf2urtr9li110pb9.ttf')");
    document.fonts.add(testFontFace);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>{'\uE9f2'}</Text>
        <Text style={styles.icon}>{'\uE65B'}</Text>
        <Text style={styles.icon}>{'\uE782'}</Text>
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
  icon: {
    fontFamily: 'Test',
    fontSize: 48
  }
};

export default FontFaceDemo;
