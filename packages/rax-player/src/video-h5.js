import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Controller from './controller';
import env from './env-h5';

const defaultStyles = {
  container: {
    position: 'relative',
    overflow: 'hidden'
  },
  video: {
    width: '750rem',
    height: '300rem',
    backgroundColor: '#000000',
    zIndex: 1
  },
  controller: {
    height: '70rem'
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

/**
 * @description 视频播放组件（H5）
 */
class H5Video extends Component {

  state = {
    pause: true,
    currentTime: 0,
    controllerTime: 0,
    duration: 0,
    fullScreen: false
  };

  componentWillMount() {
    this.props.hasController = this.props.controls || false;
    delete this.props.controls;
  }

  /**
   * @description 播放状态切换
   * @param status {Boolean} 当前状态（true为播放中，false为暂停中）
   */
  switch(status) {
    let video = this.refs.video;
    if (status) {
      video && video.pause();
    } else {
      video && video.play();
    }
    this.setState({
      pause: status
    });
  }

  /**
   * 获取播放器当前播放时间（video真实时间）
   * @returns {number} 播放器当前播放时间（单位：ms）
   */
  getCurrentTime() {
    return this.refs.video.currentTime;
  }

  /**
   * 设置播放器当前播放时间（video真实时间）
   * @returns {number} 播放器当前播放时间（单位：ms）
   */
  setCurrentTime(time) {
    this.refs.video.currentTime = time;
    return time;
  }

  /**
   * @description 获取视频时间长度
   * @returns {number} 视频时间长度（单位：ms）
   */
  getDuration() {
    return this.refs.video.duration;
  }

  /**
   * @description video时间更新时间处理
   * @param e video时间更新事件
   * @returns {number} 当前时间（单位ms）
   */
  timeUpdate = e => {
    if (this.state.pause || this.justifiing) {
      return e;
    }
    let currentTime = this.getCurrentTime();
    if (currentTime !== undefined && currentTime !== 0) {
      this.setState({
        currentTime: Math.floor(currentTime),
        duration: this.refs.video.duration
      });
    }
    return currentTime;
  };

  /**
   * @description 进度条时间调整事件处理
   * @param second {Number} 时间（单位ms）
   * @param status {String} 操作类型（move表示调整中，end表示调整结束）
   */
  justify(second, status) {
    if (status == 'move') {
      // 设置控制条时间
      /* this.setState({
       controllerTime: second
       });
       */
      this.justifiing = true;
    } else if (status == 'end') {
      // 设置播放时间
      this.justifiing = false;
      this.setCurrentTime(second);
      this.setState({
        controllerTime: 0,
        currentTime: second
      });
    }
  }

  /**
   * @description 视频暂停事件处理
   * @param {Object} e 视频暂停事件
   */
  onVideoPause = e => {
    typeof this.props.onVideoPause === 'function' && this.props.onVideoPause(e);
    if (this.state.pause === false) {
      this.setState({
        pause: true
      });
    }
  };

  /**
   * @description 视频播放事件处理
   * @param {Object} e 视频播放事件
   */
  onVideoPlay = e => {
    typeof this.props.onVideoPlay === 'function' && this.props.onVideoPlay(e);
    if (this.state.pause === true) {
      this.setState({
        pause: false
      });
    }
  };

  /**
   * @description 视频结束事件处理
   * @param {Object} e 视频结束事件
   */
  onVideoFinish = e => {
    typeof this.props.onVideoFinish === 'function' && this.props.onVideoFinish(e);
  };

  /**
   * @description 视频播放出错事件处理
   * @param {Object} e 视频播放出错事件
   */
  onVideoFail = e => {
    typeof this.props.onVideoFail === 'function' && this.props.onVideoFail(e);
  };

  /**
   * @description 视频源长度更新事件处理（视频信息获取后会更新）
   * @param {Object} e 视频源长度更新事件
   */
  onDurationChange = e => {
    let duration = this.getDuration();
    if (duration !== this.state.duration) {
      this.setState({
        duration: duration
      });
    }
  };

  /**
   * @description 全屏播放
   */
  fullScreen() {
    const fullScreen = !this.state.fullScreen;
    // 使用原生全屏播放
    this.requestOriginFullscreen();
    return;
  }

  /**
   * @description 退出原生全屏
   */
  exitOriginFullScreen() {
    var element = this.refs.video;
    this._toggleFullScreen(false);
    if (element.webkitExitFullscreen || element.exitFullscreen || element.exitFullScreen) {
      element.webkitExitFullscreen && element.webkitExitFullscreen();
      element.exitFullscreen && element.exitFullscreen();
      element.exitFullScreen && element.exitFullScreen();
    }
  }

  /**
   * @description 调用开启原生全屏播放
   */
  requestOriginFullscreen() {
    var element = this.refs.video;
    this._toggleFullScreen(true);

    if (element.webkitEnterFullscreen || element.enterFullScreen || element.webkitEnterFullScreen) {
      element.webkitEnterFullscreen && element.webkitEnterFullscreen();
      element.enterFullScreen && element.enterFullScreen();
      element.webkitEnterFullscreen && element.webkitEnterFullscreen();
    }
  }

  /**
   * @description 切换原生播放状态
   * @param fullscreen {Boolean} 是否全屏播放
   */
  _toggleFullScreen(fullscreen) {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.webkitCancelFullScreen || doc.msExitFullscreen;

    if (fullscreen !== undefined) {
      if (fullscreen) {
        requestFullScreen && requestFullScreen.call(docEl);
      } else {
        cancelFullScreen && cancelFullScreen.call(doc);
      }
      return;
    }

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }

  /**
   * @description 组件渲染
   */
  render() {
    // 设置参数
    const videoProps = this.calculateVideoProps();
    // 组合样式
    let styles = this.calculateStyle();
    // 组件结构
    return <View style={styles.container}>
      <video
        {...videoProps}
        style={styles.video}
        webkit-playsinline
      />
      { this.state.pause && this.props.startBtn ? <View
          onClick={this.switch.bind(this, false)}
          style={styles.startBtn}
          ref="starBtn"
          >
          <Image source={{ uri: '//gw.alicdn.com/tps/TB1FxjDKFXXXXcRXVXXXXXXXXXX-109-111.png'}} style={styles.startBtnImage} />
        </View> : null
      }
      { this.props.hasController && env.os.iphone && <Controller
        currentTime={this.state.controllerTime || this.state.currentTime}
        totalTime= {this.state.duration}
        pause= {this.state.pause}
        onPauseOrStart={this.switch.bind(this)}
        onJustify={(second, status) => {
          this.justify(second, status);
        }}
        onFullScreen={this.fullScreen.bind(this)}
        hasFullScreen={this.props.hasFullScreen}
        style={styles.controller} />
      }
    </View>;
  }

  calculateVideoProps() {
    let videoProps = {
      ...this.props,
      ...{
        poster: this.props.poster || this.props.coverImage,
        onTimeupdate: this.timeUpdate,
        onPause: this.onVideoPause,
        onPlay: this.onVideoPlay,
        onError: this.onVideoFail,
        onDurationChange: this.onDurationChange,
        onEnded: this.onVideoFinish,
        ref: 'video'
      }
    };
    // 安卓下强制使用默认进度条
    if (!env.os.iphone && this.props.hasController) {
      videoProps.controls = 'controls';
    }
    return videoProps;
  }

  /**
   * @description 样式计算
   */
  calculateStyle() {
    let styles = {
      ...defaultStyles
    };
    // 容器
    if (this.state.fullScreen === true && this.state.fullScreenType == 'mock') {
      styles.container = {
        ...defaultStyles.container,
        ...{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%'
        }
      };
    } else {
      styles.container = {
        ...defaultStyles.container,
        ...this.props.style
      };
    }
    // 视频

    if (this.state.fullScreen === true && this.state.fullScreenType == 'mock') {
      styles.video = {
        ...styles.video,
        ...{
          height: '100%',
          width: '100%'
        }
      };
    } else {
      styles.video = {
        ...defaultStyles.video,
        ...{
          height: this.props.style.height || defaultStyles.video.height,
          width: this.props.style.width || defaultStyles.video.width
        }
      };
    }
    // 开始按钮区域
    if (this.state.fullScreen === true && this.state.fullScreenType == 'mock') {
      styles.startBtn = {
        ...defaultStyles.startBtn,
        ...{
          width: '100%',
          height: '100%'
        }
      };
      // 开始按钮图片
      styles.startBtnImage = {
        ...defaultStyles.startBtnImage,
        ...{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-' + (parseInt(defaultStyles.startBtnImage.width) / 2) + 'rem, -' + (parseInt(defaultStyles.startBtnImage.height) / 2) + 'rem)'
        }
      };
    } else {
      styles.startBtn = {
        ...defaultStyles.startBtn,
        ...{
          width: styles.video.width,
          height: styles.video.height
        }
      };
      // 开始按钮图片
      styles.startBtnImage = {
        ...defaultStyles.startBtnImage,
        ...{
          marginLeft: (parseInt(styles.video.width) - parseInt(defaultStyles.startBtnImage.width)) / 2 + 'rem',
          marginTop: (parseInt(styles.video.height) - parseInt(defaultStyles.startBtnImage.height)) / 2 + 'rem'
        }
      };
    }
    // 控制条组件
    styles.controller = {
      ...defaultStyles.controller,
      ...{
        width: styles.video.width
      }
    };

    return styles;
  }
}

export default H5Video;