import {createElement, Component, findDOMNode, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import {isWeex} from 'universal-env';
import Animated from 'rax-animated';

let scroll;

if (!isWeex) {
  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(c) {
    setTimeout(c, 1 / 60 * 1e3);
  };
  scroll = require('./scroll');
}

export default class GoTop extends Component {
  constructor(props) {
    super(props);
    let isShow = props.resident ? true : false,
      bottom = props.bottom || 125;

    if (isWeex) {
      bottom += 'rem';
    } else {
      if (!props.resident) {
        isShow = true;
        bottom = new Animated.Value(-100);
      }
    }
    this.state = {
      isShow: isShow,
      bottom: bottom
    };
  }

  render() {
    let topNode = '',
      props = this.props,
      Container;

    if (isWeex) {
      topNode = <View id="rx-top" style={styles.topNode} />;
      Container = View;
    } else {
      Container = Animated.View;
    }
    return <View>
      {topNode}
      <View>
        <View style={styles.hideNode} onAppear={() => {
          console.log('appear');
          if (props.resident) {
            return;
          }
          if (isWeex) {
            this.state.isShow && this.props.onHide();
            this.setState({
              isShow: false
            });
          } else {
            this.hide();
          }
        }} onDisAppear={() => {
          console.log('disappear');
          if (props.resident) {
            return;
          }
          if (isWeex) {
            !this.state.isShow && this.props.onShow();
            this.setState({
              isShow: true
            });
          } else {
            this.show();
          }
        }} />
      </View>
      {(() => {
        if (this.state.isShow) {
          return <Container style={[styles.container, {
            bottom: this.state.bottom,
            width: props.iconWidth,
            height: props.iconHeight,
            borderColor: props.borderColor
          }]} onClick={this.click.bind(this)}>
            <Image style={{width: '30rem', height: '32.5rem', marginBottom: '4.5rem'}} source={{uri: props.icon}} />
            <View>
              <Text style={styles.text}>{props.name}</Text>
            </View>
          </Container>;
        }
      })()}
    </View>;
  }

  click(event) {
    const {onTop, onPress} = this.props;

    onPress && onPress();
    if (isWeex) {
      let dom = require('@weex-module/dom');     
      let top = findDOMNode('rx-top');

      dom.scrollToElement(top.ref, {
        offset: 0
      });
    } else {
      event.preventDefault();
      scroll.scrollToTop({
        duration: 300
      });
    }
    onTop && onTop();
  }

  show() {
    this.startAnimation('show');
    !this.state.isShowFlag && this.props.onShow();
    this.setState({
      isShowFlag: true
    });
  }

  hide() {
    this.startAnimation('hide');
    this.state.isShowFlag && this.props.onHide();
    this.setState({
      isShowFlag: false
    });
  }

  startAnimation(type) {
    let bottom = this.props.bottom || 60;
    if (!isWeex) {
      let initValue, toValue;
      if (type === 'show') {
        initValue = -100;
        toValue = bottom;

        if (this.state.isShowFlag) {
          return;
        }
      } else {
        initValue = bottom;
        toValue = -100;
        if (!this.state.isShowFlag) {
          return;
        }
      }
      this.state.bottom.setValue(initValue);
      Animated.timing(this.state.bottom, {
        toValue: toValue,
        during: 300
      }).start(() => {
        if (type === 'hide') {
        }
      });
    }
  }
}

let styles = {
  container: {
    position: 'fixed',
    right: '25rem',
    zIndex: 1001,
    borderRadius: '45rem',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderWidth: '2rem',
    borderStyle: 'solid',
    color: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },

  text: {
    color: '#5f646e',
    fontSize: '20rem'
  },
  icon: {
    width: '30',
    height: '32.5rem',
    marginBottom: '4.5rem'
  },

  hideNode: {
    width: '1rem',
    height: '1rem',
    position: 'absolute',
    top: 0
  }
};

GoTop.defaultProps = {
  name: '顶部',
  icon: 'https://gw.alicdn.com/tps/TB1UhIvLXXXXXaRXpXXXXXXXXXX-60-66.png',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  iconWidth: '90rem',
  iconHeight: '90rem',
  onShow: () => {},
  onHide: () => {}
};
