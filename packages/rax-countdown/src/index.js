import {createElement, Component, PropTypes} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import Image from 'rax-image';

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

function addZero(num, timeWrapStyle, timeBackground, timeBackgroundStyle, timeStyle, secondStyle) {
  const displayNum = num < 0 ? 0 : num;
  const displayFirstNum = displayNum < 10 ? 0 : displayNum.toString().slice(0, 1);
  const displaySecondNum = displayNum < 10 ? displayNum : displayNum.toString().slice(1);
  return <View style={[timeWrapStyle, styles.item]}>
      {
        timeBackground ?
          <Image source={timeBackground} style={timeBackgroundStyle} /> :
          null
        }
    <Text style={timeStyle}>
      {'' + displayFirstNum}
    </Text>
    <Text style={secondStyle}>
      {'' + displaySecondNum}
    </Text>
  </View>;
};

class Index extends Component {
  state = {
    timeRemaining: 0
  };

  timeoutId = 0;

  static propTypes = {
    formatFunc: PropTypes.func,
    onTick: PropTypes.func,
    onComplete: PropTypes.func,
    tpl: PropTypes.string, // template (example {h}:{m}:{s})
    timeRemaining: PropTypes.number,
    secondStyle: PropTypes.object,
    timeStyle: PropTypes.object, // style for num
    textStyle: PropTypes.object, // style for text
    timeWrapStyle: PropTypes.object,
    timeBackground: PropTypes.string,
    timeBackgroundStyle: PropTypes.object,
    interval: PropTypes.number
  };

  static defaultProps = {
    tpl: '{d}天{h}时{m}分{s}秒',
    timeRemaining: 0,
    interval: 1000
  };

  componentWillMount() {
    const {timeRemaining} = this.props;
    this.setState({
      timeRemaining: timeRemaining
    });
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate() {
    this.tick();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.timeRemaining !== this.props.timeRemaining) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.setState({
        timeRemaining: newProps.timeRemaining
      });
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.timeRemaining !== nextProps.timeRemaining ||
      this.state.timeRemaining !== nextState.timeRemaining;
  }

  tick = () => {
    const {onComplete, onTick, interval} = this.props;
    const {timeRemaining} = this.state;
    const countdownComplete = 1000 > timeRemaining;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (countdownComplete && isFunction(onComplete)) {
      onComplete();
    } else {
      this.timeoutId = !countdownComplete ? setTimeout(
        () => this.setState(
          {
            timeRemaining: timeRemaining - interval
          },
          () => isFunction(onTick) && onTick(timeRemaining)),
        interval
      ) : false;
    }
  };

  render() {
    const {timeRemaining} = this.state;
    const {
      formatFunc,
      timeStyle,
      timeBackgroundStyle,
      timeWrapStyle,
      timeBackground,
      secondStyle,
      textStyle,
      tpl
      } = this.props;
    if (formatFunc) {
      return formatFunc(timeRemaining);
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    let days = parseInt(totalSeconds / 3600 / 24);
    let hours = parseInt(totalSeconds / 3600) % 24;
    let minutes = parseInt(totalSeconds / 60) % 60;
    let seconds = parseInt(totalSeconds % 60);


    const _timeBackgroundStyle = [styles.background, timeBackgroundStyle];

    const isDay = new RegExp('{d}').test(tpl);
    const isHours = new RegExp('{h}').test(tpl);
    const isMinutes = new RegExp('{m}').test(tpl);
    const isSeconds = new RegExp('{s}').test(tpl);

    hours = !isDay && days ? hours + 24 * days : hours;
    minutes = !isHours && hours ? minutes + 60 * hours : minutes;
    seconds = !isMinutes && minutes ? seconds + 60 * minutes : seconds;

    const tplIndexOfDay = tpl.indexOf('d');
    const tplIndexOfHours = tpl.indexOf('h');
    const tplIndexOfMinutes = tpl.indexOf('m');
    const tplIndexOfSeconds = tpl.indexOf('s');

    return <View style={styles.main}>
      {
        isDay ?
          addZero(days, timeWrapStyle, timeBackground, _timeBackgroundStyle, timeStyle, timeStyle) :
          null
        }
      {
        isDay ? <Text style={textStyle}>
          {
            tpl.slice(tplIndexOfDay + 2, tplIndexOfDay + 3)
          }
        </Text> : null
        }
      {
        isHours ?
          addZero(hours, timeWrapStyle, timeBackground, _timeBackgroundStyle, timeStyle, timeStyle) :
          null
        }
      {
        isHours ? <Text style={textStyle}>
          {
            tpl.slice(tplIndexOfHours + 2, tplIndexOfHours + 3)
          }
        </Text> : null
        }
      {
        isMinutes ?
          addZero(minutes, timeWrapStyle, timeBackground, _timeBackgroundStyle, timeStyle, timeStyle) :
          null
        }
      {
        isMinutes ? <Text style={textStyle}>
          {
            tpl.slice(tplIndexOfMinutes + 2, tplIndexOfMinutes + 3)
          }
        </Text> : null
        }
      {
        isSeconds ?
          addZero(seconds, timeWrapStyle, timeBackground, _timeBackgroundStyle, timeStyle, secondStyle) :
          null
        }
      {
        isSeconds ? <Text style={textStyle}>
          {
            tpl.slice(tplIndexOfSeconds + 2, tplIndexOfSeconds + 3)
          }
        </Text> : null
        }
    </View>;
  }
}

const styles = {
  main: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  background: {
    position: 'absolute'
  }
};

export default Index;