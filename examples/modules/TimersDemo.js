
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Button,
} from 'rax-components';

class TimersDemo extends Component {
  state = {
    second: 0
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        second: this.state.second + 1
      });
    }, 1000);
  }

  clearInterval = () => {
    clearInterval(this.interval);
  }

  setTimeout = () => {
    this.timeout = setTimeout(() => {
      alert('3000 milliseconds');
    }, 3000);
  }

  clearTimeout = () => {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>setTimeout()</Text>
        <Button onPress={this.setTimeout}>click to alert after 3 seconds </Button>
        <Text style={styles.title}>clearTimeout()</Text>
        <Button onPress={this.clearTimeout}>click to clear timeout</Button>
        <Text style={styles.title}>setInterval()</Text>
        <Text>{this.state.second}</Text>
        <Text style={styles.title}>clearInterval()</Text>
        <Button onPress={this.clearInterval}>click to clear interval</Button>
      </View>
    );
  }
}

let styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  title: {
    color: '#217AC0',
    fontWeight: 700,
    paddingTop: 40,
    marginBottom: 20
  }
};

export default TimersDemo;
