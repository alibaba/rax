import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import ScrollView from 'rax-scrollview';
import TouchableWithoutFeedback from 'rax-touchable';

class ViewDemo extends Component {
  state = {
    showBorder: true
  };

  _handlePress = () => {
    this.setState({showBorder: !this.state.showBorder});
  };

  render() {
    return (
      <View>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this._handlePress}>
            <View>
              <View style={{
                borderWidth: 2,
                borderStyle: this.state.showBorder ? 'dashed' : 'solid',
                padding: 10
              }}>
                <Text style={{fontSize: 22}}>
                  Dashed border style
                </Text>
              </View>
              <View style={{
                marginTop: 10,
                borderWidth: 2,
                borderRadius: 10,
                borderStyle: this.state.showBorder ? 'dotted' : 'solid',
                padding: 10
              }}>
                <Text style={{fontSize: 22}}>
                  Dotted border style
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <View style={{opacity: 0}}><Text>Opacity 0</Text></View>
          <View style={{opacity: 0.1}}><Text>Opacity 0.1</Text></View>
          <View style={{opacity: 0.3}}><Text>Opacity 0.3</Text></View>
          <View style={{opacity: 0.5}}><Text>Opacity 0.5</Text></View>
          <View style={{opacity: 0.7}}><Text>Opacity 0.7</Text></View>
          <View style={{opacity: 0.9}}><Text>Opacity 0.9</Text></View>
          <View style={{opacity: 1}}><Text>Opacity 1</Text></View>
        </View>

        <View style={styles.container}>
          <View style={[styles.box, {padding: 10}]}>
            <Text style={{fontSize: 22}}>10rem padding</Text>
          </View>
          <View style={[styles.box, {margin: 10}]}>
            <Text style={{fontSize: 22}}>10rem margin</Text>
          </View>
          <View style={[styles.box, {margin: 10, padding: 10, alignSelf: 'flex-start'}]}>
            <Text style={{fontSize: 22}}>
              10rem margin and padding,
            </Text>
            <Text style={{fontSize: 22}}>
              widthAutonomous=true
            </Text>
          </View>
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
  box: {
    backgroundColor: '#527FE4',
    borderColor: '#000033',
    borderWidth: 1,
  },
};

export default ViewDemo;
