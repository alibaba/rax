import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

let supportVideoPlus = false;
const weexEnv = typeof WXEnvironment !== 'undefined' ? WXEnvironment : {};
if (weexEnv.appVersion) {
  let appVersion = weexEnv.appVersion.split('.');
  // 版本判断，当android和ios大于等于6.2.0时使用WeexVideoPlus标签
  if (appVersion[0] > 6 || appVersion[0] == 6 && appVersion[1] >= 2) {
    supportVideoPlus = true;
  }
}

const defaultStyles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '750rem',
    height: '300rem'
  },
  video: {
    width: '750rem',
    height: '300rem',
    zIndex: 1
  },
  poster: {
    overflow: 'hidden',
    position: 'absolute',
    top: '0rem',
    left: '0rem',
    zIndex: 1,
  },
  startBtn: {
    overflow: 'hidden',
    position: 'absolute',
    color: '#ffffff',
    top: '0rem',
    left: '0rem',
    zIndex: 1
  },
  startBtnImage: {
    width: '109rem',
    height: '111rem'
  }
};

class Video extends Component {

  new = true;

  state = {
    pause: this.props.autoPlay ? false : true,
    poster: true,
    update: true
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.autoPlay) {
      return false;
    }
    if ( this.new || nextState.update) {
      this.new = false;
      return true;
    }
    return false;
  }

  switch(status) {
    this.setState({
      pause: status === 'stop' ? true : false,
      update: true
    });
  }

  onVideoPause = (e) => {
    typeof this.props.onVideoPause === 'function' && this.props.onVideoPause(e);
    if (this.state.pause === false) {
      this.setState({
        pause: true,
        update: false
      });
    }
  };

  onVideoPlay = (e) => {
    typeof this.props.onVideoPlay === 'function' && this.props.onVideoPlay(e);
    this.state.poster = false;
    if (this.state.pause === true) {
      this.setState({
        pause: false,
        update: false
      });
    }
  };

  onVideoFail = (e) => {
    typeof this.props.onVideoFail === 'function' && this.props.onVideoFail(e);
  };

  onVideoFinish = (e) => {
    typeof this.props.onVideoFinish === 'function' && this.props.onVideoFinish(e);
  };

  onLandscape = (e) => {
    typeof this.props.onLandscape === 'function' && this.props.onLandscape(e);
  };

  render() {
    let NativeVideo = 'video';
    // styles
    let styles = this.calculateStyle();
    // config
    let poster = this.props.poster || this.props.coverImage;
    let playStatus = this.state.pause ? 'stop' : 'play';
    let videoSrc = this.props.src;
    videoSrc = videoSrc.replace(/\/\/|http:\/\/|https:\/\//, location.protocol + '//'); // 解决android下播放器不能播放//前缀视频文件的bug
    let props = {
      ...this.props,
      ...{
        onPause: this.onVideoPause,
        onStart: this.onVideoPlay,
        onFail: this.onVideoFail,
        onFinish: this.onVideoFinish,
        ref: 'video',
        src: videoSrc,
        style: styles.video,
        playStatus: playStatus,
        autoPlay: this.props.autoPlay ? true : false
      }
    };
    // 添加videoplus相关属性适配
    if (supportVideoPlus) {
      NativeVideo = 'videoplus';
      let utParams = this.props.utParams || {};
      if (!utParams.page) {
        utParams.page = 'RX';
      }
      props = {
        ...this.props,
        ...{
          src: videoSrc,
          utParams: utParams,
          autoPlay: true, // 因为videoplus现在有个bug，当autoPlay不为true的时候埋点会有问题，所有，当视频开始播放之后就设置autoPlay为true
          onPaused: this.onVideoPause,
          onPlaying: this.onVideoPlay,
          onError: this.onVideoFail,
          onFinish: this.onVideoFinish,
          onLandscape: this.onLandscape,
          style: styles.video,
          playControl: this.state.pause ? 'pause' : 'play',
        }
      };
    }
    // comp
    return <View style={styles.container}>
      {
        poster && playStatus == 'stop' ?
          null :
          <NativeVideo
            {...props}
          />
      }
      { playStatus == 'stop' && poster && this.state.poster && <View
        style={styles.poster}
        ref="poster"
        >
          <Image
            source={{
              uri: poster
            }}
            style={styles.posterImage}
          />
        </View>
      }
      { playStatus == 'stop' && this.props.startBtn && <View
        style={styles.startBtn}
        ref="starBtn"
          >
          <Image
            source={{
              uri: 'https://gw.alicdn.com/tps/TB1FxjDKFXXXXcRXVXXXXXXXXXX-109-111.png'
            }}
            style={styles.startBtnImage}
            onClick={this.switch}
            />
        </View>
      }
    </View>;
  }

  calculateStyle() {
    let styles = defaultStyles;
    styles.container = {
      ...defaultStyles.container,
      ...this.props.style
    };
    styles.video = {
      ...defaultStyles.video,
      ...{
        width: this.props.style.width || defaultStyles.video.width,
        height: this.props.style.height || defaultStyles.video.height
      }
    };
    styles.startBtn = {
      ...defaultStyles.startBtn,
      ...{
        width: styles.video.width,
        height: parseInt(styles.video.height) - 75 + 'rem'
      }
    };
    styles.startBtnImage = {
      ...defaultStyles.startBtnImage,
      ...{
        marginLeft: (parseInt(styles.video.width) - parseInt(defaultStyles.startBtnImage.width)) / 2 + 'rem',
        marginTop: (parseInt(styles.video.height) - parseInt(defaultStyles.startBtnImage.height)) / 2 + 'rem'
      }
    };
    styles.poster = {
      ...defaultStyles.poster,
      ...{
        width: styles.video.width,
        height: styles.video.height
      }
    };
    styles.posterImage = {
      width: styles.video.width,
      height: styles.video.height
    };
    return styles;
  }

}

export default Video;