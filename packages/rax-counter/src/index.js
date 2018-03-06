import {Component, createElement, PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Touchable from 'rax-touchable';

const BOTTOM_COLOR = '#666666';
const DISABLE_BOTTOM_COLOR = '#a1a1a1';

class Counter extends Component {

  static propTypes = {

    /**
     * 默认数值
     */
    value: PropTypes.number,

    /**
     * 起始值
     */
    start: PropTypes.number,

    /**
     * 终止值
     */
    end: PropTypes.number,

    /**
     * 改变值时触发
     */
    onChange: PropTypes.func,

    /**
     * 渲染完成触发
     */
    onComplete: PropTypes.func

  };

  constructor(props) {
    super(props);
    this.state = {
      count: props.value,
      incrementColor: BOTTOM_COLOR,
      decrementColor: BOTTOM_COLOR,
    };
  }

  increment = () => {
    let {onComplete, onChange, end} = this.props;
    if (this.state.count < end) {
      this.state.count++;
      onChange && onChange(this.state.count);
      this.state.count == end
        ? this.state.decrementColor = DISABLE_BOTTOM_COLOR
        : this.state.incrementColor = BOTTOM_COLOR;
      this.setState(this.state);
      onComplete && onComplete(this.state.count);
    }
  }

  decrement = () => {
    let {onComplete, start} = this.props;
    if (this.state.count > start) {
      this.state.count--;
      this.state.count == start
        ? this.state.incrementColor = DISABLE_BOTTOM_COLOR
        : this.state.decrementColor = BOTTOM_COLOR;
      onComplete && onComplete(this.state.count);
      this.setState(this.state);
    }
  }

  render() {
    return (
      <View {...this.props} style={styles.container}>
        <Touchable
          style={styles.button}
          onPress={
            this.decrement
          }
        >
          <Text style={{...styles.buttonText, color: this.state.incrementColor}}>
            -
          </Text>
        </Touchable>
        <View>
          <Text style={styles.countText}>
            {this.state.count}
          </Text>
        </View>
        <Touchable
          style={styles.button}
          onPress={
            this.increment
          }
        >
          <Text style={{...styles.buttonText, color: this.state.decrementColor}}>
            +
          </Text>
        </Touchable>
      </View>
    );
  }
}

let styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: 200,
    height: 50,
  },
  countText: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    fontSize: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: 57,
  },
  buttonText: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    fontSize: 32,
    textAlign: 'center',
  }
};

export default Counter;
