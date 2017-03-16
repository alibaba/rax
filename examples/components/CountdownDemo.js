
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
  TouchableWithoutFeedback} from 'rax-components';
import Countdown from 'rax-countdown';

class CountdownDemo extends Component {
  onComplete() {
    console.log('countdown complete');
  }
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Countdown
            timeRemaining={10000}
            tpl={'{d}天{h}时{m}分{s}秒'}
            onComplete={this.onComplete}
          />
        </View>
        <View style={styles.container}>
          <Countdown
            timeRemaining={100000000}
            timeStyle={{
              'color': '#007457',
              'backgroundColor': 'red',
              'marginLeft': '2rem',
              'marginRight': '2rem'
            }}
            secondStyle={{'backgroundColor': 'yellow'}}
            textStyle={{'backgroundColor': 'blue'}}
            tpl={'{d}-{h}-{m}-{s}'}
            onComplete={this.onComplete}
          />
        </View>
        <View style={styles.container}>
          <Countdown
            timeRemaining={500000}
            tpl="{h}:{m}:{s}"
            timeStyle={{
              color: '#ffffff',
              fontSize: 40,
            }}
            secondStyle={{
              color: '#ffffff',
              fontSize: 40,
            }}
            timeWrapStyle={{
              borderRadius: 6,
              width: 50,
              height: 60,
              backgroundColor: '#333333',
            }}
           />
        </View>
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
};

export default CountdownDemo;
