/** @jsx createElement */

import {createElement, findDOMNode} from 'rax';
import View from 'rax-view';
import Detection from '../Detection';
import {isWeex} from 'universal-env';
import {isLoop, transformRangeSpec, getEl, noop, clamp, Emitter} from '../Util';
import {EVENT_PAN_VIEW_PAN_START, FULL_WIDTH} from '../Constant';
import animate from 'universal-animation';
import Binding from 'weex-bindingx';
import BaseView from './BaseView';
import Panel from '../Panel';
import LoadMore from '../LoadMore';
import GestureView from 'rax-gesture-view';

// solve for transition duration = 0 bug
const MIN_DURATION = isWeex ? 0 : 1;

class DefaultView extends BaseView {
  onPan = (e) => {
    // for start state  may not trigger on IOS
    if (e.state === 'start' || !this.isPanning && e.state === 'move') {
      this.bindPanExp(this.refs.content);
    }
  }

  switchTo = (loopIndex, options = {params: {}, ignoreEvent: false}, cb) => {
    let {beforeSwitch = noop, afterSwitch = noop, vertical, easing, loop} = this.props;
    loop = isLoop(loop);

    let cardTransitionSpec = this.resolveTransitionSpec(this.props.cardTransitionSpec, {
      index: this.curIndex
    });

    if (!loop) {
      loopIndex = clamp(loopIndex, 0, this.itemCount - 1);
    }

    let {offset, startIndexes} = this.computeSize({loopIndex});
    let index = ((loopIndex - startIndexes.length) % this.itemCount + this.itemCount) % this.itemCount;
    let {duration = this.props.duration, params} = options;
    let prevIndex = this.curIndex;
    let prevLoopIndex = this.loopIndex;

    this.move(loopIndex);

    if (!options.ignoreEvent) {
      beforeSwitch({index, loopIndex, prevLoopIndex, params, prevIndex, duration, easing});
    }

    // indicator
    if (this.refs.indicator && this.refs.indicator.switchTo) {
      this.refs.indicator.switchTo(index);
    }

    this.curIndex = index;
    this.loopIndex = loopIndex;
    this.handleScreensRender();
    const wrap = findDOMNode(this.refs.content); // 获取元素
    let transitionProps = [];

    this.indexesQueue.forEach((queue) => {
      if (cardTransitionSpec.props && cardTransitionSpec.props.length) {
        cardTransitionSpec.props.forEach((config) => {
          if (options.isInitial || (queue.posIndex === loopIndex || queue.posIndex === loopIndex - 1 || queue.posIndex === loopIndex + 1)) {
            let result = transformRangeSpec(findDOMNode(this.refs[`card_${queue.loopIndex}`]), {
              ...config
            }, loopIndex === queue.posIndex);

            if (result && result.element) {
              transitionProps.push({
                easing,
                ...result,
                duration
              });
            }
          }
        });
      }
    });


    this.slideAnimate = animate({
      forceTransition: true,
      props: [{
        element: wrap,
        property: vertical ? 'transform.translateY' : 'transform.translateX',
        easing,
        duration: Math.max(this.props.isSlideEnabled ? duration : 0, MIN_DURATION),
        end: offset,
      }, ...transitionProps]
    }, (e) => {
      this.curIndex = index;
      if (!options.ignoreEvent) {
        this.handleLoadMore({index, params, prevIndex, duration, easing, isInitial: options.isInitial});
        afterSwitch({index, loopIndex, prevLoopIndex, params, prevIndex, duration, easing});
      }
      this.handleScreensDetroy();
      this.resolveObserver();
      cb && cb(e);
    });
  }

  componentWillMount() {
    if (Detection.isEnableSliderAndroid) {
      Emitter.on(EVENT_PAN_VIEW_PAN_START, this.bindCellPanExp);
    }
  }

  bindCellPanExp = (e) => {
    // check uuid
    if (e.uuid == this.uuid && e.element) {
      this.bindPanExp(e.element);
    }
  }

  stopAnimate = () => {
    if (this.slideAnimate) {
      // stop animation
      this.slideAnimate.stop();
    }
  }

  onDisappear() {
    super.onDisappear();
    this.unbindPanExp(this.refs.content);
  }

  unbindPanExp = (anchor) => {
    if (this.token) {
      Binding.unbind({
        token: this.token,
        eventType: 'pan',
        anchor
      });
    }
  }

  getComputedOffset() {
    let {vertical} = this.props;
    let style = Binding.getComputedStyle(getEl(this.refs.content));
    let offset = style && style[vertical ? 'translateY' : 'translateX'];
    return offset;
  }

  bindPanExp = (anchor) => {
    this.isPanning = true;
    this.stopAnimate();
    let {vertical, loop, debug} = this.props;

    loop = isLoop(loop);

    let {offset} = this.computeSize();
    let x = vertical ? 'y' : 'x';

    if (!Detection.isEnableSlider) return;

    let {extraBindingProps = []} = this.props;

    if (typeof extraBindingProps === 'function') {
      extraBindingProps = extraBindingProps({
        index: this.curIndex
      });
    }

    if (!this.props.isPanEnabled) return;


    this.offset = isWeex ? offset : this.getComputedOffset();

    let expression = `${x}+${this.offset}`;

    if (!loop) {
      if (this.curIndex === 0) {
        // left edge
        expression = `${x} > 0 ? (${x}/3+${this.offset}) : (${x} + ${this.offset})`;
      }

      if (this.curIndex === this.itemCount - 1) {
        // right edge
        expression = `${x} < 0 ? (${x}/3+${this.offset}) : (${x} + ${this.offset})`;
      }
    }

    this.startTime = Date.now();

    let cardBindingProps = this.getCardBindingProps();

    let props = [
      {
        element: this.refs.content,
        property: vertical ? 'transform.translateY' : 'transform.translateX',
        expression
      },
      ...cardBindingProps,
      ...extraBindingProps
    ];


    props.forEach((prop) => {
      prop.element = getEl(prop.element);
    });

    let res = Binding.bind({
      debug,
      anchor: getEl(anchor),
      eventType: 'pan',
      props
    }, this.onPanCallback);

    if (res && res.token) {
      this.token = res.token;
    }
  }


  onPanCallback = (e) => {
    let {vertical} = this.props;
    let {cardSize} = this.computeSize();
    // fix: fix pan cancel on 7.5.0
    if (isWeex && Detection.Android && Detection.appVersion === '7.5.0' && e.state === 'cancel') {
      this.switchTo(this.loopIndex);
    }
    if (e.state === 'end') {
      this.isPanning = false;
      let duration = Date.now() - this.startTime;
      const dist = this.dist = vertical ? e.deltaY : e.deltaX;
      const panDist = this.props.panDist ? this.props.panDist : cardSize / 2;
      let newIndex = this.loopIndex;

      if (Math.abs(dist) > panDist || Math.abs(dist) / duration > 0.5 && duration < 200) {
        if (dist > 0) {
          newIndex--;
        } else {
          newIndex++;
        }
      }

      this.switchTo(newIndex);
      if (!isWeex) {
        this.unbindPanExp(this.refs.content);
      }
    }
  }

  onTouchStart = () => {
    this.stopAutoPlay();
  }

  onTouchEnd = () => {
    let {resumeInterval, duration} = this.props;
    setTimeout(() => {
      this.autoPlay();
    }, Math.max(duration, resumeInterval));
  }


  render() {
    let {vertical, indicatorStyle, indicatorItemStyle, children, indicatorActiveItemStyle, defaultIndex} = this.props;

    if (!(children instanceof Array)) {
      children = [children];
    }

    let {cardSize, contentSize, viewportSize, indexes, panels, startIndexes} = this.computeSize();

    let defaultLoopIndex = defaultIndex + startIndexes.length;

    let offset = this.computeSize({loopIndex: defaultLoopIndex}).offset;

    let containerStyle = vertical ? {height: viewportSize} : {width: viewportSize};

    let wrapProps = Detection.isEnableSliderAndroid ? {} : vertical ? {onVerticalPan: this.onPan} : {onHorizontalPan: this.onPan};

    return (<View {...this.props} ref="container"
      style={[containerStyle, this.props.style, {opacity: 1}]}
      onDisappear={(e) => this.onDisappear(e)}
      onAppear={(e) => this.onAppear(e)}
    >
      <GestureView
        {...this.props}
        {...wrapProps}
        style={[vertical ?
          {
            flexDirection: 'column',
            height: contentSize,
            width: panels[0] && panels[0].props.style && panels[0].props.style.width,
            ...offset !== undefined ? {
              transform: `translateY(${offset}rem) translateZ(0)` // translateZ to resolve transitionEnd can't trigger on web
            } : {}
          } :
          {
            flexDirection: 'row',
            width: contentSize,
            height: panels[0] && panels[0].props.style && panels[0].props.style.height,
            ...offset !== undefined ? {
              transform: `translateX(${offset}rem) translateZ(0)`
            } : {}
          }]}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}

        ref="content">
        {indexes.map((index, loopIndex) => {
          let child = children[index];
          if (child && child.type === Panel) {
            let cardStyle = this.getCardInitialStyle(loopIndex === defaultLoopIndex);
            return (<Panel ref={`card_${loopIndex}`} {...child.props}
              cardSize={cardSize}
              viewportSize={viewportSize}
              loopIndex={loopIndex}
              index={index}
              data-ref={`card_${loopIndex}`}
              style={[
                {position: 'absolute'},
                {...child.props.style},
                vertical ?
                  {
                    width: FULL_WIDTH,
                    height: cardSize,
                    top: loopIndex * cardSize
                  } :
                  {
                    width: cardSize,
                    left: loopIndex * cardSize
                  },
                {...cardStyle}]} />);
          }
        })}

        {children.map((child, i) => {
          if (child && child.type !== Panel && child.type !== LoadMore) {
            return <child.type key={i} {...child.props} />;
          }
        })}

        {children.map((child, i) => {
          if (child && child.type === LoadMore) {
            return (<LoadMore ref={'loadmore'}
              key={i}
              vertical={vertical}
              itemCount={indexes.length}
              cardSize={cardSize} {...child.props} />);
          }
        })}

      </GestureView>
      {this.props.indicatorComponent ?
        <this.props.indicatorComponent
          ref={'indicator'}
          panels={panels}
          style={indicatorStyle}
          itemStyle={indicatorItemStyle}
          activeItemStyle={indicatorActiveItemStyle}
        /> : null}
    </View>);
  }
}

export default DefaultView;