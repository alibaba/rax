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
import Picture from 'rax-picture';

let image = '//camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067';

class PictureDemo extends Component {
  render() {
    return (
      <View>

        <View style={styles.container}>
          <Picture
            source={{uri: image}}
            style={{
              width: 600
            }}
            lazyload={true}
          />
          <Text>resizeMode="cover"</Text>
          <Picture
            source={{uri: image}}
            style={{
              width: 400,
              height: 200,
            }}
            resizeMode="cover"
            lazyload={true}
            autoWebp={false}
            autoCompress={false}
            autoRemoveScheme={false}
            autoReplaceDomain={false}
            autoScaling={false}
            highQuality={false}
          />
          <Text>text and image</Text>
          <Picture
            source={{uri: image}}
            style={{
              width: 300,
              height: 300
            }}
            lazyload={true}
          >
            <Text style={{color: 'blue', fontSize: 40}}>hello rax</Text>
          </Picture>
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

export default PictureDemo;
