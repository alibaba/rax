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
    width: 750,
    height: 300,
    backgroundColor: '#000000',
    zIndex: 1
  },
  controller: {
    height: 70
  },
  startBtn: {
    overflow: 'hidden',
    position: 'absolute',
    color: '#ffffff',
    top: 0,
    left: 0,
    zIndex: 1
  },
  startBtnImage: {
    width: 109,
    height: 111
  }
};

/**
 * @description for web
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
   * @description 
   * @param status {Boolean} （true: play，false: pause）
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
   * @returns {number}（ms）
   */
  getCurrentTime() {
    return this.refs.video.currentTime;
  }

  /**
   * @returns {number}（ms）
   */
  setCurrentTime(time) {
    this.refs.video.currentTime = time;
    return time;
  }

  /**
   * @returns {number}（ms）
   */
  getDuration() {
    return this.refs.video.duration;
  }

  /**
   * @description video time update
   * @returns {number}（ms）
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
   * @description Progress bar
   * @param second {Number}（ms）
   * @param status {String}（move: running，end: finish）
   */
  justify(second, status) {
    if (status == 'move') {
      this.justifiing = true;
    } else if (status == 'end') {
      this.justifiing = false;
      this.setCurrentTime(second);
      this.setState({
        controllerTime: 0,
        currentTime: second
      });
    }
  }

  /**
   * @description pause
   * @param {Object} e 
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
   * @description play
   * @param {Object} e
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
   * @description end
   * @param {Object} e
   */
  onVideoFinish = e => {
    typeof this.props.onVideoFinish === 'function' && this.props.onVideoFinish(e);
  };

  /**
   * @description fail
   * @param {Object} e 
   */
  onVideoFail = e => {
    typeof this.props.onVideoFail === 'function' && this.props.onVideoFail(e);
  };

  /**
   * @description 
   * @param {Object} e
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
   * @description fullScreen
   */
  fullScreen() {
    this.requestOriginFullscreen();
    return;
  }

  /**
   * @description exit fullScreen
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
   * @description fullScreen
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
   * @description toggle fullScreen
   * @param fullscreen {Boolean}
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
   * @description render
   */
  render() {
    const videoProps = this.calculateVideoProps();
    let styles = this.calculateStyle();
    return <View style={styles.container}>
      <video
        {...videoProps}
        style={styles.video}
        webkit-playsinline />
      { this.state.pause && this.props.startBtn ? <View
        onClick={this.switch}
        style={styles.startBtn}
        ref="starBtn"
          >
          <Image source={{ uri: '//gw.alicdn.com/tps/TB1FxjDKFXXXXcRXVXXXXXXXXXX-109-111.png'}} style={styles.startBtnImage} />
        </View> : null
      }
      { this.props.hasController && env.os.iphone && <Controller
        currentTime={this.state.controllerTime || this.state.currentTime}
        totalTime={this.state.duration}
        pause={this.state.pause}
        onPauseOrStart={this.switch}
        onJustify={(second, status) => {
          this.justify(second, status);
        }}
        onFullScreen={this.fullScreen}
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
    // Android forced to use default progress bar
    if (!env.os.iphone && this.props.hasController) {
      videoProps.controls = 'controls';
    }
    return videoProps;
  }

  /**
   * @description style
   */
  calculateStyle() {
    let styles = {
      ...defaultStyles
    };
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
    if (this.state.fullScreen === true && this.state.fullScreenType == 'mock') {
      styles.startBtn = {
        ...defaultStyles.startBtn,
        ...{
          width: '100%',
          height: '100%'
        }
      };
      styles.startBtnImage = {
        ...defaultStyles.startBtnImage,
        ...{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-' + parseInt(defaultStyles.startBtnImage.width) / 2 + 'rem, -' + parseInt(defaultStyles.startBtnImage.height) / 2 + 'rem)'
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
      styles.startBtnImage = {
        ...defaultStyles.startBtnImage,
        ...{
          marginLeft: (parseInt(styles.video.width) - parseInt(defaultStyles.startBtnImage.width)) / 2 + 'rem',
          marginTop: (parseInt(styles.video.height) - parseInt(defaultStyles.startBtnImage.height)) / 2 + 'rem'
        }
      };
    }
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