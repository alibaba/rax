import {createElement, cloneElement, Component, findDOMNode, PropTypes} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';
import SwipeEvent from './Swipe';
import styles from './sliderStyle';

/**
* @Slider Entrance
* rax-slider h5 version
**/
export default class Slide extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    paginationStyle: PropTypes.object
  }

  static defaultProps = {
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
  }

  index = 0;
  height = null;
  width = null;
  loopIdx = 0;
  DIRECTION = {
    LEFT: 'SWIPE_LEFT',
    RIGHT: 'SWIPE_RIGHT'
  };
  offsetX = null;
  isSwiping = false;
  total = 0;

  componentWillMount() {
    const {children, height, width} = this.props;
    if (children.length < 2) return;
    this.index = 0;
    this.height = height;
    this.width = parseFloat(width) * document.documentElement.clientWidth / 750;
    this.loopIdx = 0;
    this.total = children.length;
  }

  componentDidMount() {
    if (this.props.autoPlay && this.total > 1) {
      this.autoPlay();
    }
  }

  autoPlay() {
    const autoplayInterval = this.props.autoplayInterval;
    // 非自动播放的情况 return 掉
    if (this.isSwiping) return;
    this.autoPlayTimer && clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = setInterval(() => {
      if (this.isLoopEnd()) return;
      // 根据 index 和偏移改变位置
      this.slideTo(this.index, this.DIRECTION.LEFT);
    }, parseFloat(autoplayInterval));
  }

  // 改变 slider 的框子位置
  slideTo(index, direction) {
    if (this.isSwiping) return;

    // this.index = direction === this.DIRECTION.LEFT ? index + 1 : (index - 1 < 0 ? this.total + index - 1 : index - 1);
    this.index = direction === this.DIRECTION.LEFT ? index + 1 : index - 1;
    this.offsetX = this.index * this.width;

    const realIndex = this.loopedIndex();

    // 外框translate3d for translate3d 为了性能
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
    this.slideTo(this.index, direction);
    if (this.props.autoPlay) {
      this.autoPlay();
    }
  }

  // 使index维持在0-length之间循环
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
    const {style, showsPagination} = this.props;
    return (
      <View style={[styles.slideWrapper, style]}>
        {this.renderSwipeView(this.getPages())}
        {showsPagination ? this.renderPagination() : ''}
      </View>
    );
  }
};