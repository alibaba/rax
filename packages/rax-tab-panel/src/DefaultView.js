/** @jsx createElement */


'use strict';

import {createElement, findDOMNode, PropTypes} from 'rax';
import View from 'rax-view';
import {isWeex} from 'universal-env';
import binding from 'weex-bindingx';
import transition from 'universal-transition';
import Detection from './Detection';
import TabPanel from './TabPanel';
import {clamp, noop, forbidSwipeBack, Event as Emitter} from './Utils';
import BaseView from './BaseView';
import PanView from './PanView';

function getEl(el) {
  return isWeex ? findDOMNode(el).ref : findDOMNode(el);
}

// solve for transition duration = 0 bug
const MIN_DURATION = 1;


const DURATION = 250;
const DEFAULT_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';


const styles = {
  container: {
    width: 750,
    position: 'absolute',
    top: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  wrap: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    bottom: 0
  }
};


class DefaultView extends BaseView {
  x = 0;
  itemWidth = 750;
  itemCount = 0;
  curIndex = null;
  startTime = null;
  token = null;
  isScrolling = false;
  shouldBind = false;
  isPropagationStopped = false;

  static defaultProps = {
    panDist: null,
    duration: DURATION,
    easing: DEFAULT_EASING,
    isPanEnabled: true,
    isSlideEnabled: true,
    beforeExpressionBind: noop,
    pageConfig: [],
    defaultFocusIndex: 0,
    forbidSwipeBackOnIOS: 'auto'
  };

  static contextTypes = {
    isInATabPanel: PropTypes.bool,
    uuid: PropTypes.number,
    isInATabPanelDefaultView: PropTypes.bool,
    parentDefaultView: PropTypes.Component
  };

  getChildContext() {
    return {
      isInATabPanelDefaultView: true,
      parentDefaultView: this
    };
  }

  componentWillMount() {
    let {style} = this.props;

    this.itemWidth = style.width || this.itemWidth;

    Emitter.on('scroll', () => {
      this.isScrolling = true;
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false;
      }, 200);
    });
    if (Detection.isEnableSliderAndroid) {
      Emitter.on('tabpanelcell:panstart', this.bindCellPanExp);
    }
  }

  bindCellPanExp = (e) => {
    // check uuid
    let {uuid} = this.props;
    if (e.uuid == uuid && e.element) {
      this.bindPanExp(e.element);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.countItems();
      let {defaultFocusIndex = 0} = this.props;
      this.switchTo(defaultFocusIndex, {duration: 0, params: {type: 'default'}});
    }, 0);
  }

  componentWillReceiveProps(props) {
    if (props) {
      this.countItems(props);
    }
  }

  handleSwipeBack = () => {
    if (isWeex && Detection.isEnableSlider) {
      let {forbidSwipeBackOnIOS} = this.props;
      if (forbidSwipeBackOnIOS === 'auto') {
        if (this.curIndex === 0) {
          forbidSwipeBack(false);
        } else {
          forbidSwipeBack(true);
        }
      } else {
        forbidSwipeBack(!!forbidSwipeBackOnIOS);
      }
    }
  }


  switchTo = (index, options = {params: {}}) => {
    let {beforeSwitch = noop, afterSwitch = noop} = this.props;
    let {duration = this.props.duration, params} = options;
    index = clamp(index, 0, this.itemCount - 1);
    let prevIndex = this.curIndex;
    beforeSwitch({index, params, prevIndex});
    this.curIndex = index;
    this.renderPanel(index);
    let itemWidth = this.itemWidth;
    let end = -index * itemWidth;
    const wrap = findDOMNode(this.refs.wrap);
    transition(wrap, {
      transform: `translateX(${end}rem)`,
      webkitTransform: `translateX(${end}rem)`
    }, {
      timingFunction: this.props.easing,
      delay: 0,
      duration: Math.max(this.props.isSlideEnabled ? duration : 0, MIN_DURATION)
    }, () => {
      this.curIndex = index;
      afterSwitch({index, params, prevIndex});
      this.handleScreens();
      this.handleSwipeBack();
    });
  }

  onTouchStart = () => {
    if (isWeex || this.isScrolling) return;
    this.bindPanExp(this.refs.wrap);
  }

  bindPanExp = (anchor) => {
    this.anchor = anchor;

    if (!Detection.isEnableSlider) return;

    let {extraBindingProps = []} = this.props;

    if (typeof extraBindingProps === 'function') {
      extraBindingProps = extraBindingProps();
    }

    if (!this.props.isPanEnabled) {
      return;
    }

    this.x = -this.curIndex * this.itemWidth;

    let expression = {
      origin: `x+${this.x}`,
      transformed: `{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":${this.x}}]}`
    };
    if (this.curIndex === 0) {
      // left edge bounce
      expression.origin = `x > 0 ? (x/3+${this.x}) : (x + ${this.x})`;
      expression.transformed = ` {\"type\":\"?\",\"children\":[{\"type\":\">\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":0}]},{\"type\":\"+\",\"children\":[{\"type\":\"/\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":3}]},{\"type\":\"NumericLiteral\",\"value\":${this.x}}]},{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":${this.x}}]}]}`;
    }

    if (this.curIndex === this.itemCount - 1) {
      // right edge bounce
      expression.origin = `x < 0 ? (x/3+${this.x}) : (x + ${this.x})`;
      expression.transformed = `{\"type\":\"?\",\"children\":[{\"type\":\"<\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":0}]},{\"type\":\"+\",\"children\":[{\"type\":\"/\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":3}]},{\"type\":\"NumericLiteral\",\"value\":${this.x}}]},{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":${this.x}}]}]}`;
    }

    this.startTime = Date.now();

    let props = [
      {
        element: this.refs.wrap,
        property: 'transform.translateX',
        expression: expression
      },
      ...extraBindingProps
    ];

    props.forEach((prop) => {
      if (prop && prop.element) {
        prop.element = getEl(prop.element);
      }
    });

    let res = binding.bind({
      anchor: getEl(anchor),
      eventType: 'pan',
      options: {
        touchAction: 'pan-x'
      },
      props
    }, (e) => {
      if (e.state == 'end') {
        // unbind bindingx
        if (this.token) {
          binding.unbind({
            token: this.token,
            eventType: 'pan',
            anchor: getEl(anchor)
          });
        }
      }
      this.onPanCallback(e);
    });

    this.token = res && res.token;
  }

  onPanCallback = (e) => {
    if (e.state === 'end') {
      let duration = Date.now() - this.startTime;
      const dist = e.deltaX;
      const panDist = this.props.panDist ? this.props.panDist : this.itemWidth / 2;
      let newIndex = this.curIndex;
      if (Math.abs(dist) > panDist || Math.abs(dist) / duration > 0.5 && duration < 200) {
        if (dist > 0) {
          newIndex--;
        } else {
          newIndex++;
        }
      }
      if (isWeex && Detection.iOS && !binding.isSupportNewBinding) {
        setTimeout(() => {
          this.switchTo(newIndex);
        }, 30);
      } else {
        this.switchTo(newIndex);
      }
    }
  }

  onHorizontalPan = (e) => {
    if (e.state === 'end') {
      this.isPropagationStopped = false;
    }

    if (e.state === 'start' && !this.isScrolling) {
      this.bindPanExp(this.refs.wrap);
    }
  }

  disablePan = () => {
    if (this.token) {
      binding.unbind({
        token: this.token,
        eventType: 'pan',
        anchor: this.anchor
      });
    }
  }

  shouldBindPanExp(e) {
    // left
    if (this.curIndex === 0 && e.changedTouches[0].deltaX > 0) {
      return false;
      // right
    } else if (this.curIndex === this.itemCount - 1 && e.changedTouches[0].deltaX < 0) {
      return false;
    }
    return true;
  }

  render() {
    let {isPanEnabled} = this.props;

    let curIndex = this.curIndex;

    if (this.props.children && !(this.props.children instanceof Array)) {
      this.props.children = [this.props.children];
    }

    let children = this.props.children.map((child, index) => {
      if (child && child.type === TabPanel) {
        return (
          <TabPanel index={index} curIndex={curIndex} {...child.props}
            style={[{width: this.itemWidth}, {...child.props.style}]}
            ref={`panel_${index}`} />);
      } else {
        return child;
      }
    });

    let wrapProps = !Detection.isEnableSliderAndroid && isPanEnabled ? {onHorizontalPan: this.onHorizontalPan} : {};

    return (<View {...this.props} style={[styles.container, this.props.style]}>
      <PanView ref="wrap" {...wrapProps} style={styles.wrap}>
        {children}
      </PanView>
    </View>);
  }
}


export default DefaultView;
