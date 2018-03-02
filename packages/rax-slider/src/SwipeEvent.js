import {createElement, Component, PropTypes} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';
import isValidSwipe from './isValidSwipe';

const directions = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT'
};

class SwipeEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipe: {
        direction: null,
        distance: 0,
        velocity: 0
      }
    };
    // swipe is happen
    this.swipeDetected = false;
    // swipe speed
    this.velocityProp = null;
    // swipe distance
    this.distanceProp = null;
    // swipe direction
    this.swipeDirection = null;
  }

  componentWillMount() {
    let that = this;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt) => {
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        const {dx, dy, vx, vy} = gestureState;
        const { onSwipeBegin, onSwipe, onSwipeEnd} = this.props;
        // when no swipe
        if (!this.props.continuous && this.swipeDetected) {
          return;
        }
        let initialDetection = false;
        let validHorizontal = false;
        let validVertical = false;

        if (!this.swipeDetected) {
          initialDetection = true;
          // horizontal
          validHorizontal = that.props.horizontal ? isValidSwipe(
            vx, dy, that.props.initialVelocityThreshold, that.props.verticalThreshold
          ) : '';

          // vertical
          validVertical = that.props.vertical ? isValidSwipe(
            vy, dx, that.props.initialVelocityThreshold, that.props.horizontalThreshold
          ) : '';

          if (validHorizontal) {
            evt.preventDefault && evt.preventDefault();
            this.velocityProp = 'vx';
            this.distanceProp = 'dx';
            // left
            if ((this.props.horizontal || this.props.left) && dx < 0) {
              this.swipeDirection = directions.SWIPE_LEFT;
            // right
            } else if ((this.props.horizontal || this.props.right) && dx > 0) {
              this.swipeDirection = directions.SWIPE_RIGHT;
            }
          } else if (validVertical) {
            this.velocityProp = 'vy';
            this.distanceProp = 'dy';
            // up
            if ((this.props.vertical || this.props.up) && dy < 0) {
              this.swipeDirection = directions.SWIPE_UP;
            // down
            } else if ((this.props.vertical || this.props.down) && dy > 0) {
              this.swipeDirection = directions.SWIPE_DOWN;
            }
          }

          if (this.swipeDirection) {
            this.swipeDetected = true;
          }
        }

        if (this.swipeDetected) {
          // gestureState.dx || gestureState.dy
          const distance = gestureState[this.distanceProp];
          // gestureState.vx || gestureState.vx
          const velocity = gestureState[this.velocityProp];

          const swipeState = {
            direction: this.swipeDirection,
            distance,
            velocity
          };

          if (initialDetection) {
            onSwipeBegin && onSwipeBegin(swipeState);
          } else {
            onSwipe && onSwipe(swipeState);
          }

          if (this.props.setGestureState) {
            this.setState({
              swipe: swipeState
            });
          }
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: this.handleTerminationAndRelease.bind(this),
      onPanResponderRelease: this.handleTerminationAndRelease.bind(this)
    });
  }

  handleTerminationAndRelease() {
    let that = this;
    if (this.swipeDetected) {
      const { onSwipeEnd } = this.props;
      onSwipeEnd && onSwipeEnd({
        direction: this.swipeDirection,
        distance: that.state.swipe.distance,
        velocity: that.state.swipe.velocity
      });
    }
    this.swipeDetected = false;
    this.velocityProp = null;
    this.distanceProp = null;
    this.swipeDirection = null;
  }

  render() {
    const { onSwipeBegin, onSwipe, onSwipeEnd, ...props} = this.props;
    const style = {
      alignSelf: 'flex-start'
    };
    const state = this.props.setGestureState ? this.state : null;
    return (
      <View {...this.panResponder.panHandlers} style={{style, ...props.handlerStyle}}>
        <View {...props} {...state}>{this.props.children}</View>
      </View>
    );
  }
}

SwipeEvent.defaultProps = {
  horizontal: true,
  vertical: true,
  left: false,
  right: false,
  up: false,
  down: false,
  continuous: true,
  initialVelocityThreshold: 0.2,
  verticalThreshold: 1,
  horizontalThreshold: 5,
  setGestureState: true,
  handlerStyle: {}
};

SwipeEvent.propTypes = {
  onSwipeBegin: PropTypes.func,
  onSwipe: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  swipeDecoratorStyle: PropTypes.object
};

export default SwipeEvent;
