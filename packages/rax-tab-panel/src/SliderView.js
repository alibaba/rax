/** @jsx createElement */

'use strict';

import {createElement} from 'rax';
import BaseView from './BaseView';
import {TabPanel} from './index';
import {noop} from './Utils';

class SliderView extends BaseView {
  static defaultProps = {
    isPanEnabled: true, // 是否可以pan来横向滑动
    isSlideEnabled: true, // 是否可以有滑动slide效果
    pageConfig: [],
    defaultFocusIndex: 0, // 默认聚焦的index
    // screenNumbersPerSide: null //每边保留的屏幕数量
  };

  params = {
    params: {},
    prevIndex: null,
    index: this.props.defaultFocusIndex
  }

  curIndex = this.props.defaultFocusIndex;
  isScrolling = false;
  itemCount = 0;


  state = {
    index: 0
  }

  onChange = (e) => {
    let {beforeSwitch = noop} = this.props;
    this.params = {
      params: {},
      index: e.index,
      prevIndex: this.prevIndex >= 0 ? this.prevIndex : null
    };
    beforeSwitch(this.params);
    this.curIndex = e.index;
    this.renderPanel(this.curIndex);
    this.prevIndex = e.index;
  }

  afterSwitch = () => {
    let {afterSwitch = noop} = this.props;
    afterSwitch(this.params);
    this.handleScreens();
  }


  switchTo = (index) => {
    if (this.refs.container) {
      this.setState({
        index
      });
    }
  }


  componentDidMount() {
    // TODO extraBindingProps 需要Slider实现ScrollableProtocol
    this.countItems();
    let {defaultFocusIndex = 0} = this.props;

    setTimeout(() => {
      if (defaultFocusIndex !== this.state.index) {
        this.switchTo(defaultFocusIndex);
      } else {
        // 需要手动触发一下
        this.onChange({
          index: defaultFocusIndex
        });
      }

      this.afterSwitch();
    }, 50);
  }

  onScroll = () => {
    this.isScrolling = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.isScrolling = false;
      this.afterSwitch();
    }, 500);
  }

  render() {
    let {isPanEnabled} = this.props;
    let curIndex = this.curIndex;

    if (this.props.children && !(this.props.children instanceof Array)) {
      this.props.children = [this.props.children];
    }

    let children = this.props.children.map((child, index) => {
      if (child.type === TabPanel) {
        return (
          <TabPanel index={index} curIndex={curIndex} isAppear={index == this.curIndex ? true : false} {...child.props}
            ref={`panel_${index}`} />);
      } else {
        return child;
      }
    });

    return (<slider {...this.props}
      index={this.state.index}
      scrollable={isPanEnabled}
      autoPlay={false}
      infinite={false}
      showIndicators={false}
      onScroll={this.onScroll}
      ref="container"
      onChange={this.onChange}>
      {children}
    </slider>);
  }
}

export default SliderView;