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
import Player from 'rax-player';
import {isWeex} from 'universal-env';

const logger = {
  log: content => {
    console && console.log(content);
  }
};

class PlayerDemo extends Component {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Player
            ref="video"
            style={{
              height: 400,
              width: 650,
            }}
            poster="//gw.alicdn.com/tps/TB1m0.aKFXXXXbJXXXXXXXXXXXX-750-300.png"  // 封面图片
            src="http://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4"  // 视频源地址
            controls
            startBtn
            // autoPlay
            hasFullScreen={true}
            onVideoFail={logger.log}
            onVideoFinish={logger.log}
            onVideoPlay={logger.log}
            onVideoPause={logger.log}
          />
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

export default PlayerDemo;
