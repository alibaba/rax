import { createElement, Component } from 'rax';

export default class ErrorPage extends Component {
  handleBack = () => {
    this.props.history.goBack();
  };
  render() {
    const { message = '好像发生了一些问题' } = this.props;
    return (
      <view style={styles.container}>
        <image src={require('./not-found.png')} style={styles.image} />
        <text style={styles.text}>{message}</text>
        <button size="mini" onClick={this.handleBack}>
          返回
        </button>
      </view>
    );
  }
}

const styles = {
  container: {
    width: 750,
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  image: {
    width: 290,
    height: 210
  },
  text: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    color: '#999999',
  },
};
