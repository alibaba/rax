
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Image,
  Link,
  TextInput,
  Button,
  Switch,
  Video,
  ScrollView,
  TouchableWithoutFeedback} from 'rax-components';
import Player from 'rax-player';
import {isWeex} from 'universal-env';

const logger = {
  log: content => {
    try {
      if (isWeex) {
        content = typeof content == 'object' ? JSON.stringify(content) : content;
        typeof nativeLog !== 'undefined' && nativeLog('log:' + content);
      } else {
        console && console.log(content);
      }
    } catch (e) {
    }
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
            }} // 样式
            poster="//gw.alicdn.com/tps/TB1m0.aKFXXXXbJXXXXXXXXXXXX-750-300.png"  // 封面图片
            src="http://cloud.video.taobao.com/play/u/2780279213/p/1/e/6/t/1/d/ld/36255062.mp4"  // 视频源地址
            controls  // 控制条
            startBtn  // 开始暂停button
            // autoPlay // 自动播放
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
