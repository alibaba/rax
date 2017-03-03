import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Point from './progress-point';

// weex 环境判断
import {isWeex} from 'universal-env';
// 默认样式
const defaultStyles = {
  progress: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1',
    height: '70rem',
    userSelect: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none'
  },
  currentTime: {
    margin: '0 3rem',
    lineHeight: '70rem',
    color: '#ffffff',
    fontSize: '24rem',
    fontFamily: 'sans-serif'
  },
  totalTime: {
    margin: '0 3rem',
    lineHeight: '70rem',
    color: '#ffffff',
    fontSize: '24rem',
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
    height: '3rem',
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
    height: '3rem',
    top: '0',
    left: '0',
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
 * 格式化时间为(mm:ss)形式
 * @param second {Interger} 时间（单位s）
 * @returns {string} 时间
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
 * @description 控制器组件
 */
class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justifyTime: undefined
    };
  }

  /**
   * @description 播放进度调整事件处理
   * @param position {Percentage} 进度条位置（百分比）
   * @param status {String} 控制手势状态（move表示控制手势移动中, end表示控制手势结束）
   * @param direction {String} 控制手势方向 (toward表示前进， backward表示后退)
   */
  justify(position, status, direction) {
    let currentTime = this.props.totalTime * position;
    // 拦截并处理进度条拖动过程中的位置改变事件
    if (status == 'move') {
      this.state.justifyTime == undefined && this.props.onJustify(currentTime, status);
      this.setState({
        justifyTime: currentTime
      });
    } else if (status == 'end' && this.props.onJustify) {
      // 将进度条拖动结束的事件上传到视频组件层处理
      this.props.onJustify(currentTime, status);
      this.state.justifyTime = undefined;
    }
  }

  /**
   * @description 组件渲染
   */
  render() {
    // 存在调整时间时使用调整时间
    let time = this.state.justifyTime || this.props.currentTime;
    let styles = {
      ...this.props.style,
      ...defaultStyles
    };
    // 计算进度条的上下位置
    styles.progressUpdate.top = styles.progressBar.top = parseInt(styles.progress.height) / 2 - 2 + 'rem';
    // 计算进度条已播放部分长度
    styles.progressLine.width = this.props.totalTime ? Math.min(1, time / this.props.totalTime) * 100 + '%' : 0;
    // 格式化当前时间
    const currntTime = formatTime(time);
    // 格式化整体时间
    const totalTime = formatTime(this.props.totalTime);
    // 计算进度点位置
    const pointPosition = this.props.totalTime ? Math.min(1, time / this.props.totalTime) * 0.92 + 0.04 : 0.04;
    // 组件结构
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