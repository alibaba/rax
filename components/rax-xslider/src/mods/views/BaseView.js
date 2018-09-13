/** @jsx createElement */

'use strict';

import {Component, setNativeProps, findDOMNode} from 'rax';
import Util, {isLoop, transformExpression, clamp, uuid, getLast} from '../Util';
import Indicator from '../Indicator';
import Panel from '../Panel';
import {FULL_WIDTH} from '../Constant';

const DEFAULT_DURATION = 300;
const DEFAULT_EASING = 'cubicBezier(.25,.1,.25,1)';

let defaultProps = {
  vertical: false,
  panDist: null,
  cardSize: FULL_WIDTH,
  isSlideEnabled: true,
  duration: DEFAULT_DURATION,
  defaultIndex: 0,
  isPanEnabled: true,
  loop: false,
  easing: DEFAULT_EASING,
  autoPlay: false,
  interval: 3000,
  resumeInterval: 2000, // duration after touchEnd
  startGap: 0, // left gap (horizontal) or top gap(vertical)
  endGap: 0, // right gap (horizontal) or bottom gap(vertical)
  viewportSize: undefined,
  extraTransitionSpec: {},
  cardTransitionSpec: {},
  indicatorComponent: Indicator,
  indicatorStyle: {},
  indicatorItemStyle: {},
  indicatorActiveItemStyle: {}
};

class BaseView extends Component {
  offset = 0;

  curIndex = 0;

  loopIndex = 0;

  dist = 0;

  indexes = [];

  indexesQueue = [];

  slideAnimate = null;

  static defaultProps = defaultProps;

  getChildContext() {
    return {
      uuid: this.uuid,
      slider: this
    };
  }

  constructor(props) {
    super(props);
    this.props = {
      ...defaultProps,
      ...{
        loop: isLoop(props.loop)
      }
    };
    this.uuid = '__xslider__' + uuid();
    this.isPanning = false;
  }

  componentDidMount() {
    let {defaultIndex} = this.props;

    let {indexes, startIndexes} = this.computeSize();

    if (indexes.length != this.indexesQueue.length) {
      this.indexesQueue = indexes.map((index, loopIndex) => {
        return {
          index,
          loopIndex,
          posIndex: loopIndex
        };
      });
    }
    let loopIndex = defaultIndex + startIndexes.length;
    this.loopIndex = loopIndex;
    this.itemCount = this.filterElements(this.props, Panel).length;

    // delay 50ms to solve didmount problem on ios
    setTimeout(() => {
      this.switchTo(loopIndex, {duration: 0, isInitial: true});
      this.loopIndex = defaultIndex + startIndexes.length;
      this.autoPlay();
    });
  }

  componentWillReceiveProps(props) {
    let {indexes} = this.computeSize({props});

    if (indexes.length != this.indexesQueue.length) {
      this.indexesQueue = indexes.map((index, loopIndex) => {
        return {
          index,
          loopIndex,
          posIndex: loopIndex
        };
      });
    }

    this.itemCount = this.filterElements(props, Panel).length;

    setTimeout(() => {
      this.switchTo(this.loopIndex, {ignoreEvent: true, isInitial: true, duration: 1});
    }, 0);
  }


  filterElements(props, elementType = Panel) {
    let panels = [];
    let {children} = props || this.props;
    if (!children) return panels;
    if (!(children instanceof Array)) {
      children = [children];
    }
    children.forEach((child) => {
      if (child && child.type === elementType) {
        panels.push(child);
      }
    });
    return panels;
  }

  move = (loopIndex) => {
    let {loop} = this.props;
    loop = isLoop(loop);
    if (!loop) return;
    // next
    if (loopIndex > this.loopIndex) {
      let first = this.indexesQueue.shift();
      let last = getLast(this.indexesQueue);
      if (last) {
        let posIndex = last.posIndex;
        this.movePanel(first.loopIndex, posIndex + 1);
        this.indexesQueue = [...this.indexesQueue, {...first, ...{posIndex: posIndex + 1}}];
      }
    } else if (loopIndex < this.loopIndex) {
      let last = this.indexesQueue.pop();
      let first = this.indexesQueue[0];
      if (first) {
        let posIndex = first.posIndex;
        this.movePanel(last.loopIndex, posIndex - 1);
        this.indexesQueue = [{...last, ...{posIndex: posIndex - 1}}, ...this.indexesQueue];
      }
    }
  }


  resolveTransitionSpec(spec, params) {
    if (spec && typeof spec === 'function') {
      return spec(params);
    }
    return spec;
  }

  computeSize(options = {}) {
    let props = options && options.props || this.props;

    let {loop, startGap, endGap, cardSize, viewportSize, maxOffset, minOffset} = props;

    loop = isLoop(loop);

    viewportSize = viewportSize || startGap + cardSize + endGap;
    let panels = this.filterElements(props, Panel);
    let loopIndex = undefined !== options.loopIndex ? options.loopIndex : this.loopIndex;

    if (!loop) {
      loopIndex = clamp(loopIndex, 0, this.itemCount - 1);
    }

    let itemCount = panels.length || 0;

    let indexes = [];
    for (let i = 0; i < itemCount; i++) {
      indexes.push(i);
    }
    let startIndexes = [];

    let endIndexes = [];

    if (loop) {
      let startFillNum = itemCount;
      let endFillNum = itemCount;
      startIndexes = indexes.slice(indexes.length - startFillNum);
      endIndexes = indexes.slice(0, endFillNum);
      indexes = startIndexes.concat(indexes).concat(endIndexes);
    }

    this.indexes = indexes;

    let offset = startGap - loopIndex * cardSize;

    if (!loop) {
      minOffset = minOffset !== undefined ? minOffset : startGap;
      maxOffset = maxOffset !== undefined ? - Math.abs(maxOffset) : startGap - (itemCount - 1) * cardSize;

      offset = clamp(startGap - loopIndex * cardSize, maxOffset, minOffset);
    }

    return {
      cardSize,
      startGap,
      endGap,
      contentSize: loop ? indexes.length * cardSize : startGap + itemCount * cardSize + endGap,
      viewportSize,
      offset,
      indexes,
      startIndexes,
      endIndexes,
      itemCount,
      panels
    };
  }

  getCardBindingProps() {
    let {vertical} = this.props;

    let cardTransitionSpec = this.resolveTransitionSpec(this.props.cardTransitionSpec, {
      index: this.curIndex
    });

    let {cardSize} = this.computeSize();
    let bindingProps = [];
    let x = vertical ? 'y' : 'x';


    this.indexesQueue.forEach((queue) => {
      if (cardTransitionSpec.props && cardTransitionSpec.props.length) {
        cardTransitionSpec.props.forEach((config) => {
          let expression;
          if (queue.posIndex === this.loopIndex - 1) {
            expression = transformExpression(config.inputRange[0], config.inputRange[1], config.outputRange[0], config.outputRange[1], `(${x}/${cardSize})`);
          }

          if (queue.posIndex === this.loopIndex + 1) {
            expression = transformExpression(config.inputRange[0], -config.inputRange[1], config.outputRange[0], config.outputRange[1], `(${x}/${cardSize})`);
          }

          if (queue.posIndex === this.loopIndex) {
            expression = transformExpression(config.inputRange[1], config.inputRange[0], config.outputRange[0], config.outputRange[1], `(abs(${x})/${cardSize})`);
          }

          expression && bindingProps.push({
            element: this.refs[`card_${queue.loopIndex}`],
            property: config.property,
            expression
          });
        });
      }
    });

    return bindingProps;
  }

  movePanel = (loopIndex, destIndex) => {
    let {cardSize, vertical} = this.props;
    if (this.refs[`card_${loopIndex}`]) {
      setNativeProps(findDOMNode(this.refs[`card_${loopIndex}`]), {
        style: {
          transition: 'none', // prevent transition on web
          ...vertical ? {top: `${destIndex * cardSize}rem`} : {left: `${destIndex * cardSize}rem`}
        }
      });
    }
  }

  stopAutoPlay = () => {
    if (this.itv) {
      clearInterval(this.itv);
    }
  }

  autoPlay = () => {
    let {interval, loop, autoPlay} = this.props;

    loop = isLoop(loop);
    // stop autoplay
    this.stopAutoPlay();
    if (!autoPlay) return;
    let index = this.curIndex;
    this.itv = setInterval(() => {
      if (loop) {
        this.switchTo(this.loopIndex + 1);
      } else {
        if (this.curIndex >= this.itemCount - 1) {
          index = 0;
        } else {
          index = this.curIndex + 1;
        }
        this.switchTo(index);
      }
    }, interval);
  }

  onAppear() {
    let {onAppear} = this.props;
    if (this.isDisappear) {
      this.switchTo(this.loopIndex, {duration: 0}, () => {
        // to solve shark problem
        this.autoPlay();
      });
    }
    onAppear && onAppear();
  }

  // initialStyle
  getCardInitialStyle(isCurrent) {
    let {defaultIndex, cardTransitionSpec} = this.props;
    let transitionSpec = this.resolveTransitionSpec(cardTransitionSpec, {
      index: defaultIndex
    });
    let style = {};
    let transform = [];
    if (transitionSpec && transitionSpec.props) {
      transitionSpec.props.forEach((spec = {}) => {
        let {property, outputRange} = spec;
        if (property && outputRange && outputRange.length === 2) {
          let val = outputRange[isCurrent ? 1 : 0];
          if (/transform\./.test(property)) {
            let transformKey = property.split('.')[1];
            switch (transformKey) {
              case 'scale':
              case 'scaleX':
              case 'scaleY':
                transform.push(`${transformKey}(${val})`);
                break;
              case 'rotate':
              case 'rotateX':
              case 'rotateY':
              case 'rotateZ':
                transform.push(`${transformKey}(${val}deg)`);
                break;
              case 'translate':
              case 'translateX':
              case 'translateY':
                transform.push(`${transformKey}(${val}rem)`);
                break;
            }
          } else {
            style[property] = val;
          }
        }
      });
    }

    if (transform.length > 0) {
      style.transform = transform.join(' ');
    }
    return style;
  }

  handleLoadMore(e) {
    if (!this.refs.loadmore) return;
    if (e.index === e.prevIndex && e.index === this.itemCount - 1 && !e.isInitial && this.dist < 0) {
      this.refs.loadmore.handleLoading();
    }
  }

  // compute panel inside viewport
  resolveObserver() {
    let {cardSize, offset, viewportSize} = this.computeSize();
    this.indexesQueue.forEach((o) => {
      let {loopIndex, posIndex} = o;
      if (posIndex * cardSize + offset > 0 && posIndex * cardSize + offset < viewportSize
        || (posIndex + 1) * cardSize + offset > 0 && (posIndex + 1) * cardSize + offset < viewportSize
        || posIndex * cardSize + offset === 0 && (posIndex + 1) * cardSize + offset === viewportSize) {
        this.refs['card_' + loopIndex] && this.refs['card_' + loopIndex].triggerAppear();
      } else {
        this.refs['card_' + loopIndex] && this.refs['card_' + loopIndex].triggerDisappear();
      }
    });
  }

  onDisappear = () => {
    this.isDisappear = true;
    let {onDisappear} = this.props;
    this.stopAutoPlay();
    onDisappear && onDisappear();
  }


  handleScreensRender = () => {
    let {screenNumbersPerSide} = this.props;
    let {loopIndex} = this;
    if (screenNumbersPerSide >= 0 && loopIndex >= 0) {
      console.error(loopIndex);
      for (let i = loopIndex - screenNumbersPerSide; i <= loopIndex + screenNumbersPerSide; i++) {
        this.renderPanel(i);
      }
    }
  }

  handleScreensDetroy = () => {
    let {screenNumbersPerSide} = this.props;
    let {itemCount, curIndex} = this;
    let visibleIndexes = [];
    if (screenNumbersPerSide >= 0) {
      let max = curIndex + screenNumbersPerSide > itemCount - 1 ? itemCount - 1 : curIndex + screenNumbersPerSide;
      let min = curIndex - screenNumbersPerSide < 0 ? 0 : curIndex - screenNumbersPerSide;
      for (let i = min; i < curIndex; i++) {
        visibleIndexes.push(i);
      }
      for (let i = curIndex; i <= max; i++) {
        visibleIndexes.push(i);
      }
      for (let i = 0; i < itemCount; i++) {
        if (Util.findIndex(visibleIndexes, (o) => {
          return o === i;
        }) === -1) {
          this.destroyPanel(i);
        }
      }
    }
  }

  destroyPanel = (index) => {
    this.refs[`card_${index}`] && this.refs[`card_${index}`].hide();
  }

  renderPanel = (index) => {
    this.refs[`card_${index}`] && this.refs[`card_${index}`].show();
  }
}

export default BaseView;