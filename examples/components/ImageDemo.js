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

let image = {
  uri: 'https://camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067'
};

let base64Image = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
};

let gifImage = {
  uri: 'http://storage.slide.news.sina.com.cn/slidenews/77_ori/2016_34/74766_703038_567223.gif'
};

class ImageDemo extends Component {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text>HTTP(S) Network Image</Text>
          <Image source={image} style={styles.base} />
        </View>

        <View style={styles.container}>
          <Text>Base64 Image</Text>

          <Image source={base64Image} style={{
            width: '5rem',
            height: '5rem',
          }} />

        </View>

        <View style={styles.container}>
          <Text>GIF Image</Text>

          <Image
            style={styles.gif}
            source={gifImage}
          />

        </View>

        <View style={styles.container}>
          <Text>Image Border Radius</Text>

          <Image source={image} style={[styles.base, {
            borderRadius: 200
          }]}
          />

        </View>

        <View style={styles.container}>
          <Text>Image Nesting Content</Text>

          <Image source={image} style={[styles.base]}>
            <Text style={styles.nestedText}>Rax</Text>
          </Image>

        </View>

        <View style={styles.container}>
          <Text>Image Resize Mode</Text>

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.contain}
            source={image}
          />

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.cover}
            source={image}
          />

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.stretch}
            source={image}
          />

        </View>

        <View style={styles.container}>
          <Text>Image Composite</Text>

          <View>
            <Image
              style={[styles.base, {borderRadius: 10}]}
              resizeMode={Image.resizeMode.contain}
              source={image}
            />
            <View style={[styles.base, styles.mask]}>
              <Text style={styles.maskTitle}>Rax</Text>
            </View>
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
  base: {
    width: 100,
    height: 100,
  },
  resizeMode: {
    width: 100,
    height: 60,
    borderWidth: 1,
    margin: 10,
    borderColor: 'black'
  },
  gif: {
    height: 200,
    width: 350
  },
  nestedText: {
    marginLeft: 36,
    marginTop: 36,
    color: 'black'
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 40,
    backgroundColor: 'rgba(33,33,33,0.5)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  maskTitle: {
    color: 'white',
    paddingTop: 6,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center'
  }
};

export default ImageDemo;
