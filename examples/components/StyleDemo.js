
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Image,
  Link,
  TextInput,
  Button,
  Switch,
  Video,
  ScrollView,
  TouchableHighlight} from 'rax-components';

class StyleDemo extends Component {
  state = {
    showFixedBar: false
  };

  toggleFixedBar = () => {
    this.setState({
      showFixedBar: !this.state.showFixedBar,
    });
  };

  render() {
    return [
      <View style={styles.card}>
        <View style={styles.header}>
          <Image style={styles.profilePicture} source={{uri: 'https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_normal.png'}} />
          <View style={{flex: 1}}>
            <Text style={styles.name}>React</Text>
            <Text style={styles.subtitle}>@reactjs</Text>
          </View>
        </View>
        <View>
          <Text>React is a declarative, efficient, and flexible JavaScript library for building user interfaces.</Text>
          <Text style={styles.bling}>Reply &middot; Retweet &middot; Like</Text>
        </View>
      </View>,
      <View style={styles.card}>
        <Button title="Toggle Fixed Bar" onPress={this.toggleFixedBar} />
        {this.state.showFixedBar ? <View style={styles.fixed} /> : null}
      </View>
    ];
  }
}

let styles = {
  fixed: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    height: 100,
    backgroundColor: 'green',
    opacity: 0.5
  },
  card: {
    margin: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 3
  },
  profilePicture: {
    width: 80,
    height: 80,
    backgroundColor: '#cccccc',
    borderRadius: 80,
    marginRight: 16,
    marginBottom: 16,
  },
  name: {
    color: '#3B5998',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 24,
    color: '#9197A3',
  },
  header: {
    flexDirection: 'row',
  },
  bling: {
    marginTop: 8,
    color: '#6D84B4',
    fontSize: 26,
  },
};

export default StyleDemo;
