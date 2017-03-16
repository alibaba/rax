
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
import MultiRow from 'rax-multirow';

class MultiRowDemo extends Component {
  render() {
    return (
      <View>

        <View style={styles.container}>
          <MultiRow
            dataSource={[1, 2, 3, 4, 5, 6]}
            cells={3}
            renderCell={(item, index) => {
              return (
                <Text style={styles.num}>{item}</Text>
              );
            }
          } />
        </View>

        <View style={styles.container}>
          <MultiRow
            dataSource={[1, 2, 3, 4, 5]}
            cells={3}
            renderCell={(item, index) => {
              return (
                <Text style={styles.num}>{item}</Text>
              );
            }
          } />
        </View>

        <View style={styles.container}>
          <MultiRow
            dataSource={[1, 2, 3, 4, 5, '']}
            cells={3}
            renderCell={(item, index) => {
              return (
                <Text style={styles.num}>{item}</Text>
              );
            }
          } />
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
  num: {
    textAlign: 'center',
  }
};

export default MultiRowDemo;
