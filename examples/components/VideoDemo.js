
import {createElement, Component} from 'rax';
import Video from 'rax-video';
import {
  View,
  Text,
  Image,
  Link,
  TextInput,
  Button,
  Switch,
  ScrollView,
  TouchableWithoutFeedback} from 'rax-components';

class VideoDemo extends Component {
  state = {
    playControl: null
  };
  render() {
    return (
      <View style={styles.container}>
       <Text>controls=false playControl=play|pause</Text>
       <Video
         style={{
           flex: 1,
           height: 350
         }}
         autoPlay={false}
         controls={false}
         playControl={this.state.playControl}
         src="http://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4"
        />

        <Button onPress={() => {
          let playControl = this.state.playControl !== 'play' ? 'play' : 'pause';
          this.setState({
            playControl
          });
        }}>
          Play or Pause
        </Button>

        <Text>muted=true</Text>
        <Video
          style={{
            flex: 1,
            height: 350
          }}
          autoPlay={false}
          muted={true}
          src="http://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4"
         />
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
  box: {
    backgroundColor: '#527FE4',
    borderColor: '#000033',
    borderWidth: 1,
  },
};

export default VideoDemo;
