import {createElement, Component, render} from 'rax';

class Example extends Component {
  state = {
    title: 'Hello World',
    image: '//gw.alicdn.com/tps/i2/TB1DpsmMpXXXXabaXXX20ySQVXX-512-512.png_400x400.jpg'
  };

  handleClick = () => {
    this.setState({
      title: 'Hello Weex',
      image: '//gw.alicdn.com/tps/i2/TB1DpsmMpXXXXabaXXX20ySQVXX-512-512.png_400x400.jpg'
    });
  };

  render() {
    return (
      <div style={styles.container} onClick={this.handleClick}>
        <image style={styles.logo} src={this.state.image} />
        <text style={styles.title}>{this.state.title}</text>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40
  },
  title: {
    fontSize: 48
  }
};

render(<Example />);
