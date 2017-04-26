import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Point from './progresspoint';
import {isWeex} from 'universal-env';

const defaultStyles = {
  progress: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: 70,
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  },
  currentTime: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 3,
    marginRight: 3,
    lineHeight: 70,
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'sans-serif'
  },
  totalTime: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 3,
    marginRight: 3,
    lineHeight: 70,
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'sans-serif'
  },
  progressBarWrap: {
    flex: 1,
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  },
  progressBar: {
    width: '92%',
    height: 3,
    backgroundColor: '#cfeaff',
    position: 'absolute',
    left: 0,
    marginLeft: '4%',
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  },
  progressLine: {
    position: 'absolute',
    height: 3,
    top: 0,
    left: 0,
    zIndex: '1',
    backgroundColor: '#25c1b7',
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  },
  progressUpdate: {
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  }
};

/**
 * format time (mm:ss)
 * @param second {Interger}（s）
 * @returns {string} time
 */
const formatTime = (second) => {
  second = second || 0;
  let minute = Math.floor(second / 60);
  let ss = parseInt(second % 60);
  minute = minute < 10 ? '0' + minute : minute;
  ss = ss < 10 ? '0' + ss : ss;
  return minute + ':' + ss;
};

/**
 * @description Progress
 */
class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justifyTime: undefined
    };
  }

  /**
   * @description Playback progress adjustment event handling
   * @param position {Percentage} Progress bar position (%)
   * @param status {String} Control gesture state（move, end）
   * @param direction {String}  (toward: advance forward,， backward: back off)
   */
  justify(position, status, direction) {
    let currentTime = this.props.totalTime * position;
    if (status == 'move') {
      this.state.justifyTime == undefined && this.props.onJustify(currentTime, status);
      this.setState({
        justifyTime: currentTime
      });
    } else if (status == 'end' && this.props.onJustify) {
      this.props.onJustify(currentTime, status);
      this.state.justifyTime = undefined;
    }
  }

  /**
   * @description render
   */
  render() {
    let time = this.state.justifyTime || this.props.currentTime;
    let styles = {
      ...this.props.style,
      ...defaultStyles
    };
    styles.progressUpdate.top = styles.progressBar.top = parseInt(styles.progress.height) / 2 - 2 + 'rem';
    styles.progressLine.width = this.props.totalTime ? Math.min(1, time / this.props.totalTime) * 100 + '%' : 0;
    const currntTime = formatTime(time);
    const totalTime = formatTime(this.props.totalTime);
    const pointPosition = this.props.totalTime ? Math.min(1, time / this.props.totalTime) * 0.92 + 0.04 : 0.04;
    return <View style={styles.progress}>
      <Text style={styles.currentTime}>{ currntTime }</Text>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressBar} id="progress-bar">
          <View style={styles.progressLine} />
        </View>
        <Point pointPosition={pointPosition} style={styles.progressUpdate} onJustify={(position, status, direction) => {
          this.justify(position, status, direction);
        }} />
      </View>
      <Text style={styles.totalTime} class="total-time J_TotalTime">{totalTime}</Text>
    </View>;
  }
}

export default Progress;
