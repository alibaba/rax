import {createElement, cloneElement, Component, findDOMNode, PropTypes} from 'rax';
import View from 'rax-view';
import SwipeEvent from './SwipeEvent';
import styles from './style';

const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.height = null;
    this.width = null;
    this.loopIdx = 0;
    this.offsetX = null;
    this.isSwiping = false;
    this.total = 0;
  }

  componentWillMount() {
    const {children, height, width} = this.props;
    if (children.length < 2) return;
    this.index = 0;
    this.height = height;
    // TODO: Avoid convert unit in component
    this.width = parseFloat(width) * document.documentElement.clientWidth / 750;
    this.loopIdx = 0;
  }

  componentDidMount() {
    if (this.props.autoPlay && this.total > 1) {
      this.autoPlay();
    }
  }

  componentWillUnmount() {
    this.autoPlayTimer && clearInterval(this.autoPlayTimer);
  }

  autoPlay() {
    const autoplayInterval = this.props.autoplayInterval;
    if (this.isSwiping) return;
    this.autoPlayTimer && clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = setInterval(() => {
      if (this.isLoopEnd()) return;
      this.slideTo(this.index, SWIPE_LEFT);
    }, parseFloat(autoplayInterval));
  }

  slideTo(index, direction) {
    if (this.isSwiping) return;

    if (direction) {
      this.index = direction === SWIPE_LEFT ? index + 1 : index - 1;
    } else {
      this.index = index;
    }
    this.offsetX = this.index * this.width;

    const realIndex = this.loopedIndex();

    // translate3d for performance optimization
    let swipeView = findDOMNode(this.refs.swipeView);
    const styleText = `translate3d(${-1 * this.offsetX}px, 0px, 0px)`;
    swipeView.style.transform = styleText;
    swipeView.style.webkitTransform = styleText;

    this.loopIdx = this.index < 0 && realIndex !== 0 ? this.total - realIndex : realIndex;
    let childNum = 'child' + this.loopIdx;
    let childView = findDOMNode(this.refs[childNum]);
    childView.style.left = this.offsetX + 'px';

    this.props.onChange({index: this.loopIdx});
    this.setState({
      offsetX: this.offsetX
    });
  }

  onSwipeBegin = () => {
    this.isSwiping = true;
    clearInterval(this.autoPlayTimer);
  }

  isLoopEnd() {
    const realIndex = this.loopedIndex();
    const num = this.total;
    if (!this.props.loop && (realIndex === num - 1 || realIndex === 0) ) {
      return true;
    }
    return false;
  }

  onSwipe = ({ direction, distance, velocity }) => {
    if (this.isLoopEnd()) return;
    let changeX = distance - this.offsetX;
    let swipeView = findDOMNode(this.refs.swipeView);
    const styleText = `translate3d(${changeX}px, 0px, 0px)`;
    swipeView.style.transform = styleText;
    swipeView.style.webkitTransform = styleText;
  }

  onSwipeEnd = ({ direction, distance, velocity }) => {
    this.isSwiping = false;
    const num = this.total;
    const realIndex = this.loopedIndex();
    if (!(
      this.isLoopEnd() && (
        realIndex === num - 1 && direction === SWIPE_LEFT ||
        realIndex === 0 && direction === SWIPE_RIGHT
      )
    )) {
      this.slideTo(this.index, direction);
    }
    if (this.props.autoPlay) {
      this.autoPlay();
    }
  }

  // index from 0 to length
  loopedIndex(index, total) {
    index = index || this.index;
    total = total || this.total;
    return Math.abs(index) % total;
  }

  renderPagination() {
    let props = this.props;
    if (this.total <= 1) return;

    Object.assign(styles.defaultPaginationStyle, props.paginationStyle);
    let {itemSelectedColor, itemColor, itemSize} = styles.defaultPaginationStyle;

    const activeStyle = [
      styles.activeDot,
      {
        backgroundColor: itemSelectedColor,
        width: itemSize,
        height: itemSize
      }
    ];

    const normalStyle = [
      styles.normalDot,
      {
        backgroundColor: itemColor,
        width: itemSize,
        height: itemSize
      }
    ];

    let dots = [];
    const ActiveDot = this.props.activeDot || <View style={activeStyle} />;
    const NormalDot = this.props.normalDot || <View style={normalStyle} />;
    const realIndex = this.loopIdx;

    for (let i = 0; i < this.total; i++) {
      dots.push(i === realIndex
        ? cloneElement(ActiveDot, {key: i})
        : cloneElement(NormalDot, {key: i}));
    }

    return (
      <View style={[
        styles.defaultPaginationStyle,
        props.paginationStyle
      ]}>
        {dots}
      </View>
    );
  }

  getPages = () => {
    const children = this.props.children;
    if (!children.length || children.length <= 1) {
      return <View style={styles.childrenStyle}>{children}</View>;
    }

    return children.map((child, index) => {
      let refStr = 'child' + index;
      let translateStyle = {
        width: this.width + 'px',
        height: this.height,
        left: index * this.width + 'px'
      };
      return (
        <View ref={refStr} className={'childWrap' + index}
          style={[styles.childrenStyle, translateStyle]} key={index}>
          {child}
        </View>
      );
    });
  }

  renderSwipeView(pages) {
    const {
      initialVelocityThreshold,
      verticalThreshold,
      vertical,
      horizontalThreshold,
      children
    } = this.props;
    const style = {
      width: this.width + 'px',
      height: this.height
    };

    return children.length && children.length > 1 ?
      <SwipeEvent style={[styles.swipeWrapper, style]}
        onSwipeBegin={this.onSwipeBegin}
        onSwipeEnd={this.onSwipeEnd}
        onSwipe={this.onSwipe}
        initialVelocityThreshold={initialVelocityThreshold}
        verticalThreshold={verticalThreshold}
        vertical={vertical}
        horizontalThreshold={horizontalThreshold}>
        <View ref="swipeView" style={[styles.swipeStyle, style]}>
          {pages}
        </View>
      </SwipeEvent>
      :
      <View ref="swipeView" style={[styles.swipeStyle, style]}>
        {pages}
      </View>
    ;
  }

  render() {
    const that = this;
    const {style, showsPagination, children} = this.props;
    this.total = children.length;
    return (
      <View style={[styles.slideWrapper, style]}>
        {this.renderSwipeView(this.getPages())}
        {showsPagination ? this.renderPagination() : ''}
      </View>
    );
  }
};

Slider.defaultProps = {
  horizontal: true,
  showsPagination: true,
  loop: true,
  autoPlay: false,
  autoplayInterval: 3000,
  index: 0,
  paginationStyle: null,
  initialVelocityThreshold: 0.7,
  verticalThreshold: 10,
  horizontalThreshold: 10,
  vertical: false
};

Slider.propTypes = {
  onChange: PropTypes.func,
  paginationStyle: PropTypes.object
};

export default Slider;
