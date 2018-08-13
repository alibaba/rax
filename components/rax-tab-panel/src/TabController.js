/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import DefaultView from './DefaultView';
import SliderView from './SliderView';
import {isWeex} from 'universal-env';
import {noop, uuid} from './Utils';


const DURATION = 250;
const FULL_WIDTH = 750;
const DEFAULT_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';


const styles = {
  container: {
    width: FULL_WIDTH,
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


class TabController extends Component {
  itemCount = 0;
  token = null;


  static defaultProps = {
    duration: DURATION, // duration for slide animation
    easing: DEFAULT_EASING, // easing for slide animation
    isPanEnabled: true,
    isSlideEnabled: true, // slide animation
    beforeExpressionBind: noop,
    pageConfig: [],
    onViewAppear: noop,
    onViewDisAppear: noop,
    defaultFocusIndex: 0,
    useSlider: false,
    screenNumbersPerSide: null // save screens per-side
  };

  constructor(props) {
    super(props);
    this.uuid = '__tab_panel__' + uuid();
  }

  getChildContext() {
    return {
      isInATabPanel: true,
      uuid: this.uuid
    };
  }

  switchTo = (index, options = {params: {}}) => {
    this.refs.container.switchTo(index, options);
  }

  render() {
    // use weex slider component
    let {useSlider} = this.props;

    let props = {
      ...this.props,
      ref: 'container',
      style: [styles.container, this.props.style],
      uuid: this.uuid
    };
    return useSlider && isWeex ? <SliderView {...props} /> : <DefaultView {...props} />;
  }
}


export default TabController;
