import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';
import Dimensions from './dimensions';
import {isWeex} from 'universal-env';

let {height, width, scale} = Dimensions.get('window');
width = width / scale * 0.8;

/**
 * @description Point for progress bar
 */
class Point extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this.previousPositionX = 0;
    this.totalWidth = this.props.totalWidth || width;
  }

  /**
   * @description render
   */
  render() {
    this.pointPosition = this.props.pointPosition;
    let styles = defaultStyles;
    styles.pointWrapper = {
      ...defaultStyles.pointWrapper,
      ...this.props.style,
      ...{
        marginLeft: (this.props.pointPosition || 0.04) * 100 + '%'
      }
    };
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

  componentDidMount() {
    this._calculateTotalWidth();
  }

  /**
   * @description Calculated total length
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
   * @description pan start
   * @param e {Event}
   * @param gestureState {Object}
   * @returns {boolean} true
   */
  _handlePanResponderGrant = (e, gestureState) => {
    this._calculateTotalWidth();
    return true;
  }

  /**
   * @description pan move
   * @param e {Event}
   * @param gestureState {Object}
   */
  _handlePanResponderMove = (e, gestureState) => {
    if (!this.updating) {
      this.updating = true;
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      this.previousPositionX = this.previousPositionX || 0;
      let absDelta = gestureState.dx - this.previousPositionX;
      if (absDelta == 0) {
        this.updating = false;
        return;
      }
      this.pointPosition = Math.min(Math.max(0, (this.pointPosition - 0.04) / 0.92 + (gestureState.dx - this.previousPositionX) / this.totalWidth), 1) * 0.92 + 0.04;

      setTimeout(() => {
        this.previousPositionX = gestureState.dx;
        this.props.onJustify && this.props.onJustify((this.pointPosition - 0.04) / 0.92, 'move', absDelta > 0 ? 'toward' : 'backward');
        this.updating = false;
      }, 0);
    }
  };

  /**
   * @description pan end
   * @param e {Event}
   * @param gestureState {Object}
   */
  _handlePanResponderEnd = (e, gestureState) => {
    this.pointPosition = Math.min(Math.max(0, (this.pointPosition - 0.04) / 0.92 + (gestureState.dx - this.previousPositionX) / this.totalWidth), 1) * 0.92 + 0.04;
    this.props.onJustify && this.props.onJustify((this.pointPosition - 0.04) / 0.92, 'end');
    this.previousPositionX = 0;
  };
}

const defaultStyles = {
  pointWrapper: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 0,
    transform: 'translate(-25rem,-25rem)',
    webkitTransform: 'translate(-25rem,-25rem)',
    mozTransform: 'translate(-25rem,-25rem)',
    mskitTransform: 'translate(-25rem,-25rem)',
    transform: 'translate(-25rem,-25rem)',
    zIndex: 2
  },
  point: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    marginTop: 12,
    marginLeft: 12
  }
};

export default Point;
