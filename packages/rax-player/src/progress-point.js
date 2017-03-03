import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';
import Dimensions from './dimensions';
import {isWeex} from 'universal-env';
let {height, width, scale} = Dimensions.get('window');
width = width / scale * 0.8;

/**
 * @description 进度条控制点
 */
class Point extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * 组件预处理
   */
  componentWillMount() {
    // 初始化pan操作控制器
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    // 初始化位置记录和totalWidth
    this.previousPositionX = 0;
    this.totalWidth = this.props.totalWidth || width;
  }

  /**
   * @description 组件渲染
   */
  render() {
    // 计算样式
    this.pointPosition = this.props.pointPosition;
    let styles = defaultStyles;
    styles.pointWrapper = {
      ...defaultStyles.pointWrapper,
      ...this.props.style,
      ...{
        marginLeft: (this.props.pointPosition || 0.04) * 100 + '%'
      }
    };
    // 组件结构
    return <View
      ref={(point) => {
        this.point = point;
      }}
      style={styles.pointWrapper}
      {...this._panResponder.panHandlers}
      >
      <View style={styles.point} />
    </View>;
  }

  /**
   * @description 组件实例化完成
   */
  componentDidMount() {
    // 更新总长度
    this._calculateTotalWidth();
  }

  /**
   * @description 计算总长度
   */
  _calculateTotalWidth() {
    if (!isWeex) {
      var progressBar = document.getElementById('progress-bar');
      // console.log(progressBar.clientWidth);
      this.totalWidth = progressBar.clientWidth || this.totalWidth;
    }
  }


  _handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  /**
   * @description pan start 事件处理
   * @param e {Event} 事件
   * @param gestureState {Object} 事件相关属性集
   * @returns {boolean} true 执行成功
   */
  _handlePanResponderGrant = (e, gestureState) => {
    this._calculateTotalWidth();
    return true;
  }

  /**
   * @description pan move 事件处理
   * @param e {Event} 事件
   * @param gestureState {Object} 事件相关属性集
   */
  _handlePanResponderMove = (e, gestureState) => {
    if (!this.updating) {
      this.updating = true;
      // 阻止事件传播
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      // 计算绝对变化长度
      this.previousPositionX = this.previousPositionX || 0;
      let absDelta = gestureState.dx - this.previousPositionX;
      if (absDelta == 0) {
        this.updating = false;
        return;
      }
      // 计算根据手势移动距离，控制点应该处于的位置（百分比，具体最左端的距离）
      this.pointPosition = Math.min(Math.max(0, (this.pointPosition - 0.04) / 0.92 + (gestureState.dx - this.previousPositionX) / this.totalWidth), 1) * 0.92 + 0.04;

      setTimeout(() => {
        this.previousPositionX = gestureState.dx;
        // 触发进度调整事件
        this.props.onJustify && this.props.onJustify((this.pointPosition - 0.04) / 0.92, 'move', absDelta > 0 ? 'toward' : 'backward');
        this.updating = false;
      }, 0);
    }
  };

  /**
   * @description pan end 事件处理
   * @param e {Event} 事件
   * @param gestureState {Object} 事件相关属性集
   */
  _handlePanResponderEnd = (e, gestureState) => {
    this.pointPosition = Math.min(Math.max(0, (this.pointPosition - 0.04) / 0.92 + (gestureState.dx - this.previousPositionX) / this.totalWidth), 1) * 0.92 + 0.04;
    this.props.onJustify && this.props.onJustify((this.pointPosition - 0.04) / 0.92, 'end');
    this.previousPositionX = 0;
  };
}

// 默认样式
const defaultStyles = {
  pointWrapper: {
    width: '50rem',
    height: '50rem',
    position: 'absolute',
    top: '0',
    transform: 'translate(-25rem,-25rem)',
    webkitTransform: 'translate(-25rem,-25rem)',
    mozTransform: 'translate(-25rem,-25rem)',
    mskitTransform: 'translate(-25rem,-25rem)',
    transform: 'translate(-25rem,-25rem)',
    zIndex: 2
  },
  point: {
    width: '26rem',
    height: '26rem',
    borderRadius: '13rem',
    backgroundColor: '#ffffff',
    marginTop: '12rem',
    marginLeft: '12rem'
  }
};

export default Point;