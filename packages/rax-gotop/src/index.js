import {createElement, Component, findDOMNode, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import {isWeb, isWeex} from 'universal-env';
import Animated from 'rax-animated';

let scroll;
if (isWeb) {
  scroll = require('./scroll.web');
}

export default class GoTop extends Component {
  constructor(props) {
    super(props);
    let isShow = props.resident ? true : false,
      bottom = props.bottom || 125;

    if (!isWeex && !props.resident) {
      isShow = true;
      bottom = new Animated.Value(-100);
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
    return <View
      style={styles.root}
      onAppear={() => {}}
      onDisAppear={() => {}}
    >
      {topNode}
      <View>
        <View style={styles.hideNode} onAppear={() => {
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
          }]} onClick={this.click}>
            <Image style={{width: '30rem', height: '32.5rem', marginBottom: '4.5rem'}} source={{uri: props.icon}} />
            <View>
              <Text style={styles.text}>{props.name}</Text>
            </View>
          </Container>;
        }
      })()}
    </View>;
  }

  click = (event) => {
    const {onTop, onPress} = this.props;

    onPress && onPress();
    if (isWeex) {
      let dom = __weex_require__('@weex-module/dom');
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
  root: {
    height: 1,
    marginBottom: -1
  },
  container: {
    position: 'fixed',
    right: 25,
    zIndex: 1001,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderWidth: 2,
    borderStyle: 'solid',
    color: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },

  text: {
    color: '#5f646e',
    fontSize: 20
  },
  icon: {
    width: 30,
    height: 32.5,
    marginBottom: 4.5
  },

  hideNode: {
    width: 1,
    height: 1,
    position: 'absolute',
    top: 0
  }
};

GoTop.defaultProps = {
  name: 'Top',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABCCAYAAAAL1LXDAAAClElEQVR42u3YS4vTUBQH8PgWdK8rty5dCy79For3Jt5761R7z52xI7rLB3AhLoTRcXwMKlYUH/gAd25duXYp6AeYjYJOzR+EQO1JaKNtmpw/hLYntzS/np40beQcHVHWv1eGfijjh03cYIMR1gh3UGzDBivAWy0Cb7Wuw+2bYYlEIpEwGQ6HO5Tzl5T1X7Tx37QN13Sa7m8u1vi10a8Mbekd0G3A5mjj3/Z61/c1Bqst3Sy/CqI3QDcSy3eaXqdpureZWL7Tr4BexJm9VYrjZ/ol0M3E8p1+4dzankX4GK/zEPo8pvYxu/05ttPWPwd6IbHa0Kp2If2rjpoNp7SlX0ynnwG9cFis48DYF3foNNDM859mM727Rlh/uwxbBkYSQ2f4TvsnQNcaG9vQx7pycJ7YecWhs/pgbujshXcqQxtl2EnBSNzxcUGnHw8Gg121wipHF7FuWjCibUiy/dtMpx8BPTOstnSnDFsVjChDZzm0svQQ6LlitQ0rWFcNPNppsmynDT0AukbY6mAkW+fYThvaxLH9e6wJdzls7GgZ66qCizvtz/Ez7e/n6Fpgq4OR2IUl7jhwjDm6AlZZuleGnRUYUSacZ9HZyFVCa0eXC97RgDWzBOedpgsFP1A2cEE0FVgZ+lSEnRcYUY58QafXp0LjH8UxJwjCvnmDERwLO26GrkaTJumsHMP/x3+g33GmRL0uYATnEQa9rburh6NJ0+2mB5NOOG6IDuFx3cAIru7GoZMlOhpVSV3BCH6sjIzeB8xxY8FIYpdPKkM38O3S7/cPoNZAMB8BC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWcLvBsQ1XRsGoNRacODoxCkYtanK0DT1l6Ss23I8k/ze/AcSDH16N8PnHAAAAAElFTkSuQmCC',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  iconWidth: 90,
  iconHeight: 90,
  onShow: () => {},
  onHide: () => {}
};
