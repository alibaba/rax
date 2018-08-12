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

    const timeType = {
      'd': days,
      'h': hours,
      'm': minutes,
      's': seconds
    };

    let rule = new RegExp('\{[d,h,m,s]\}', 'g'); // used to matched all template item, which includes 'd', 'h', 'm' and 's'.
    const matchlist = [];
    let tmp = null;
    while ( (tmp = rule.exec(tpl)) !== null ) {
      matchlist.push(tmp.index, tmp.index);
    }
    if (matchlist.length !== 0) {// used to detect the last element
      matchlist.push(-1);
    }
    let lastPlaintextIndex = 0;

    return <View style={styles.main}>
      {
        matchlist.map((val, index) => {
          if (val === -1) {// don't forget the potential plain text after last matched item
            const lastPlaintext = tpl.slice(lastPlaintextIndex);
            return lastPlaintext ? (
              <Text style={textStyle}>{lastPlaintext}</Text>
            ) : null;
          }

          const matchedCharacter = tpl[val + 1];
          switch (matchedCharacter) {
            case 'd':
            case 'h':
            case 'm':
            case 's':
              if (index % 2 === 0) {// insert plain text before current matched item
                return (
                  <Text style={textStyle}>
                    {
                      tpl.slice(lastPlaintextIndex, val)
                    }
                  </Text>
                );
              } else {// replace current matched item to realtime string
                lastPlaintextIndex = val + 3;
                return addZero(timeType[matchedCharacter], timeWrapStyle, timeBackground, _timeBackgroundStyle, timeStyle, secondStyle);
              }
            default:
              return null;
          }
        })
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