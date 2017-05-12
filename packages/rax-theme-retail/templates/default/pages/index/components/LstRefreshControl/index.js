import { createElement, PureComponent, setNativeProps, PropTypes as T, findDOMNode } from 'rax';
import { isWeex } from 'universal-env';
import styles from './style';

const REFRESH_GIF_URL = 'https://cbu01.alicdn.com/cms/upload/2017/355/313/3313553_38443169.gif';
const noop = () => {};

class LstRefreshControl extends PureComponent {
  static propTypes = {
    onRefresh: T.func
  }

  static defaultProps = {
    onRefresh: noop
  }

  state = {
    refreshDisplay: 'hide'
  }

  handleRefresh = () => {
    setNativeProps(findDOMNode(this._refresh), {
      display: 'show'
    });
    this.props.onRefresh(() => {
      setNativeProps(findDOMNode(this._refresh), {
        display: 'hide'
      });
    });
  }

  render() {
    if (isWeex) {
      return (
        <refresh style={styles.refresh} ref={c => {
          this._refresh = c;
        }} onRefresh={this.handleRefresh} display="hide">
          <image style={styles.image} src={REFRESH_GIF_URL} />
        </refresh>
      );
    } else {
      return (
        <div style={{width: 258, height: 120, position: 'absolute', left: 246, top: -130}}>
          <img src={REFRESH_GIF_URL} style={{width: 258, height: 120}} />
        </div>
      );
    }
  }
}

export default LstRefreshControl;
