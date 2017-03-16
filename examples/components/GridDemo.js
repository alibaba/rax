
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
import {Row, Col} from 'rax-grid';

class GridDemo extends Component {
  render() {
    return (
      <View>

        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col style={styles.bg2}>
              <Text style={styles.text}>Col2</Text>
            </Col>
            <Col style={styles.bg3}>
              <Text style={styles.text}>Col3</Text>
            </Col>
          </Row>
        </View>

        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col style={styles.bg3}>
              <Text style={styles.text}>Col2</Text>
            </Col>
          </Row>
        </View>
        <View style={styles.container}>
          <Row>
            <Col style={styles.bg1}>
              <Text style={styles.text}>Col1</Text>
            </Col>
            <Col>
              <Row>
                <Col style={styles.bg2}>
                  <Text style={styles.text}>child Col</Text>
                </Col>
                <Col style={styles.bg3}>
                  <Text style={styles.text}>child Col</Text>
                </Col>
              </Row>
            </Col>
          </Row>
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
  text: {
    textAlign: 'center',
  },
  bg1: {
    backgroundColor: '#cccccc',
  },
  bg2: {
    backgroundColor: '#dddddd',
  },
  bg3: {
    backgroundColor: '#ededed',
  }
};

export default GridDemo;
