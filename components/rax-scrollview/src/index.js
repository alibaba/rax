import {Component, createElement, findDOMNode} from 'rax';
import {isWeex, isWeb} from 'universal-env';
import View from 'rax-view';
import RefreshControl from 'rax-refreshcontrol';
import Timer from './timer';

const DEFAULT_END_REACHED_THRESHOLD = 500;
const DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;
const FULL_WIDTH = 750;
const STYLE_NODE_ID = 'rax-scrollview-style';

class ScrollView extends Component {
  static propTypes = {};

  static defaultProps = {
    scrollEventThrottle: DEFAULT_SCROLL_CALLBACK_THROTTLE,
    onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    className: 'rax-scrollview',
  };

  lastScrollDistance = 0;
  lastScrollContentSize = 0;
  loadmoreretry = 1;

  constructor(props) {
    super(props);
    this.state = {
      loadmoreretry: 0,
    };
  }

  handleScroll = (e) => {
    if (isWeb) {
      if (this.props.onScroll) {
        e.nativeEvent = {
          get contentOffset() {
            return {
              x: e.target.scrollLeft,
              y: e.target.scrollTop
            };
          },
          get contentSize() {
            return {
              width: e.target.scrollWidth,
              height: e.target.scrollHeight
            };
          }
        };
        this.props.onScroll(e);
      }

      if (this.props.onEndReached) {
        if (!this.scrollerNode) {
          this.scrollerNode = findDOMNode(this.refs.scroller);
          this.scrollerContentNode = findDOMNode(this.refs.contentContainer);

          this.scrollerNodeSize = this.props.horizontal ? this.scrollerNode.offsetWidth : this.scrollerNode.offsetHeight;
        }

        // NOTE：in iOS7/8 offsetHeight/Width is is inaccurate （ use scrollHeight/Width ）
        let scrollContentSize = this.props.horizontal ? this.scrollerNode.scrollWidth : this.scrollerNode.scrollHeight;
        let scrollDistance = this.props.horizontal ? this.scrollerNode.scrollLeft : this.scrollerNode.scrollTop;
        let isEndReached = scrollContentSize - scrollDistance - this.scrollerNodeSize < this.props.onEndReachedThreshold;

        let isScrollToEnd = scrollDistance > this.lastScrollDistance;
        let isLoadedMoreContent = scrollContentSize != this.lastScrollContentSize;

        if (isEndReached && isScrollToEnd && isLoadedMoreContent) {
          this.lastScrollContentSize = scrollContentSize;
          this.props.onEndReached(e);
        }

        this.lastScrollDistance = scrollDistance;
      }
    }
    if (isWeex) {
      e.nativeEvent = {
        contentOffset: {
          // HACK: weex scroll event value is opposite of web
          x: -e.contentOffset.x,
          y: -e.contentOffset.y
        },
        contentSize: e.contentSize ? {
          width: e.contentSize.width,
          height: e.contentSize.height
        } : null
      };
      this.props.onScroll(e);
    }
  }

  resetScroll = () => {
    if (isWeb) {
      this.lastScrollContentSize = 0;
      this.lastScrollDistance = 0;
    } else {
      this.setState({
        loadmoreretry: this.loadmoreretry++,
      });
    }
  }

  scrollTo = (options) => {
    let x = parseInt(options.x);
    let y = parseInt(options.y);
    let animated = options && typeof options.animated !== 'undefined' ? options.animated : true;

    if (isWeex) {
      let dom = __weex_require__('@weex-module/dom');
      let contentContainer = findDOMNode(this.refs.contentContainer);
      dom.scrollToElement(contentContainer.ref, {
        offset: x || y || 0,
        animated
      });
    } else {
      let pixelRatio = document.documentElement.clientWidth / FULL_WIDTH;
      let scrollView = findDOMNode(this.refs.scroller);
      let scrollLeft = scrollView.scrollLeft;
      let scrollTop = scrollView.scrollTop;

      if (animated) {
        let timer = new Timer({
          duration: 400,
          easing: 'easeOutSine',
          onRun: (e) => {
            if (x >= 0) {
              scrollView.scrollLeft = scrollLeft + e.percent * (x * pixelRatio - scrollLeft);
            }
            if (y >= 0) {
              scrollView.scrollTop = scrollTop + e.percent * (y * pixelRatio - scrollTop);
            }
          }
        });
        timer.run();
      } else {
        if (x >= 0) {
          findDOMNode(this.refs.scroller).scrollLeft = pixelRatio * x;
        }

        if (y >= 0) {
          findDOMNode(this.refs.scroller).scrollTop = pixelRatio * y;
        }
      }
    }
  }

  render() {
    let {
      id,
      style,
      scrollEventThrottle,
      showsHorizontalScrollIndicator,
      showsVerticalScrollIndicator,
      onEndReached,
      onEndReachedThreshold,
      onScroll,
      children,
    } = this.props;

    // In weex must be int value
    onEndReachedThreshold = parseInt(onEndReachedThreshold, 10);

    const contentContainerStyle = [
      this.props.horizontal && styles.contentContainerHorizontal,
      this.props.contentContainerStyle,
    ];

    // bugfix: fix scrollview flex in ios 78
    if (!isWeex && !this.props.horizontal) {
      contentContainerStyle.push(styles.containerWebStyle);
    }

    if (this.props.style) {
      let childLayoutProps = ['alignItems', 'justifyContent']
        .filter((prop) => this.props.style[prop] !== undefined);

      if (childLayoutProps.length !== 0) {
        console.warn(
          'ScrollView child layout (' + JSON.stringify(childLayoutProps) +
          ') must be applied through the contentContainerStyle prop.'
        );
      }
    }

    let refreshContainer = <View />, contentChild;
    if (Array.isArray(children)) {
      contentChild = children.map((child, index) => {
        if (child && child.type == RefreshControl) {
          refreshContainer = child;
        } else {
          return child;
        }
      });
    } else {
      contentChild = children;
    }

    const contentContainer =
      <View
        ref="contentContainer"
        style={contentContainerStyle}>
        {contentChild}
      </View>;

    const baseStyle = this.props.horizontal ? styles.baseHorizontal : styles.baseVertical;

    const scrollerStyle = {
      ...baseStyle,
      ...this.props.style
    };

    let showsScrollIndicator = this.props.horizontal ? showsHorizontalScrollIndicator : showsVerticalScrollIndicator;

    if (isWeex) {
      return (
        <scroller
          {...this.props}
          style={scrollerStyle}
          showScrollbar={showsScrollIndicator}
          onLoadmore={onEndReached}
          onScroll={onScroll ? this.handleScroll : null}
          loadmoreoffset={onEndReachedThreshold}
          loadmoreretry={this.state.loadmoreretry}
          scrollDirection={this.props.horizontal ? 'horizontal' : 'vertical'}
        >
          {refreshContainer}
          {contentContainer}
        </scroller>
      );
    } else {
      let handleScroll = this.handleScroll;
      if (scrollEventThrottle) {
        handleScroll = throttle(handleScroll, scrollEventThrottle);
      }
      if (!showsScrollIndicator && typeof document !== 'undefined' && !document.getElementById(STYLE_NODE_ID)) {
        let styleNode = document.createElement('style');
        styleNode.id = STYLE_NODE_ID;
        document.head.appendChild(styleNode);
        styleNode.innerHTML = `.${this.props.className}::-webkit-scrollbar{display: none;}`;
      }

      scrollerStyle.webkitOverflowScrolling = 'touch';
      scrollerStyle.overflow = 'scroll';

      let webProps = {
        ...this.props,
        ...{
          ref: 'scroller',
          style: scrollerStyle,
          onScroll: handleScroll
        }
      };
      delete webProps.onEndReachedThreshold;

      return (
        <View {...webProps}>
          {contentContainer}
        </View>
      );
    }
  }
}

function throttle(func, wait) {
  var ctx, args, rtn, timeoutID;
  var last = 0;

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }

  return function throttled() {
    ctx = this;
    args = arguments;
    var delta = new Date() - last;
    if (!timeoutID)
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };
}

const styles = {
  baseVertical: {
    flex: 1,
    flexDirection: 'column',
  },
  baseHorizontal: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainerHorizontal: {
    flexDirection: 'row',
  },
  containerWebStyle: {
    display: 'block',
  }
};

export default ScrollView;
