import {createElement, Component, render} from 'universal-rx';

class Example extends Component {
  state = {
    title: 'Hello World',
    image: 'https://alibaba.github.io/weex/img/weex_logo_blue@3x.png'
  };

  handleClick = () => {
    this.setState({
      title: 'Hello Weex',
      image: 'https://alibaba.github.io/weex/img/weex_logo_blue@3x.png'
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
    width: 360,
    height: 82,
    marginBottom: 40
  },
  title: {
    fontSize: 48
  }
};

render(<Example />);
