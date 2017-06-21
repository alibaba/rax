import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableOpacity from 'rax-touchable';
import Tabbar from 'rax-tabbar';

const isWeex = typeof callNative !== 'undefined';

const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAVCAYAAACdbmSKAAACE0lEQVQ4EbWTPWgUQRTHf/N2di8X/A4XFAynjSEoSDo/S8Ug2EkCCYI2looiKS0SBSGdooWVQWxSxGstFMRPUFKIEoyIohJQFA2XI7e7MyOzezm9i00KHyzDe/v//9/HvFG1Ws2xSpNV4jP4fyRZ21KQDm+dxRXXg01Rze4c2ARKZdI9g7h1JXAOlMrIWi3+RL+7D4sGAgXLRA8KFMGLCvXhCVx5d5Mo8cmrpBt6IZKc4NUaX5II6sc84Z1RVO1XM5PKRv71A9G9a9gkBQmyZEop5O0z3FIVrS3x0VHMwWEwBo010L2NeGSipVnvyNMpoulxsIJ8foPxQS/mlZvm+/AiDbOlMhbJy7JpHlUKrebncKJRJsZ19UChE/XpNc4agufT+DIRhe3cmJOcRUfXT6BUkI3YbO8nOXUDZh9RfHiTuGaoS0hRDLbvQCO/QtKBM6j6AmYpRs89IZy6iDt0mnTnEaKCphhBvOswrnd/PnIRtNk3RP37FwqPJ4lNRDRTwXb1kAyNw8I32LQVc+xCc9w+napVq9l16snzhLMPiG1IJCnx4GVM/0CjpNZDsosUwQyNkW7uIyCl7iLCu5fg/UyObtu9nGQtrmMNycgV3NpuCtpm0yzcPgcfX4EIzl9Hw/KN8I5XE8nU9csKJuhAMLgtO7B7jy/js/MPybt/bXILqs1pfYSN1W/DrHBbSSt+/zvwG0xM0LIGM+ZGAAAAAElFTkSuQmCC';


var itemStyle = {
  color: '#ffffff',
  fontSize: 22,
  paddingTop: 0,
  lineHeight: 'normal',
  height: 110,
};
var itemSelectedStyle = {
  backgroundColor: 'rgb(255, 68, 102)'
};
var iconStyle = {
  marginBottom: 5,
  width: 42,
  height: 42,
};

var styles = {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex'
  },
  content: {
    position: 'relative',
    display: 'flex',
    flex: 1
  },
  bar: {
    backgroundColor: 'rgb(56, 61, 72)',
    height: 110,
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderTop: 'none',
  },
  content: {
    display: 'flex',
    flex: 1
  },
  tabContent: {
    flex: 1,
    overflow: 'scroll',
  },
};

class TabbarDemo extends Component {
  state = {
    selectedTab: 'redTab',
    notifCount: 0,
    presses: 0,
  };

  render() {
    return (
      <View style={styles.container}>
        <Tabbar
          horizontal={false}
          fixedPlace="top"
          barTintColor="#a09090"
          style={styles.bar}>
          <Tabbar.Item
            title="Index"
            icon={{uri: base64Icon}}
            iconStyle={iconStyle}
            style={itemStyle}
            selectedStyle={itemSelectedStyle}
            >
            <View style={styles.content}>
              <ScrollView>
                <Text style={{color: 'red', marginTop: 20, marginLeft: 20}}>Index Content</Text>
              </ScrollView>
            </View>
          </Tabbar.Item>
          <Tabbar.Item
            title="Channel1"
            selected={true}
            icon={{uri: base64Icon}}
            iconStyle={iconStyle}
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            style={itemStyle}
            selectedStyle={itemSelectedStyle}
            onPress={() => {
              alert('empty tab');
            }} />
          <Tabbar.Item
            title="Channel2"
            icon={{uri: base64Icon}}
            iconStyle={iconStyle}
            style={itemStyle}
            selectedStyle={itemSelectedStyle}>
            <View style={styles.content}>
              <ScrollView>
                <Text style={{color: 'red', marginTop: 20, marginLeft: 20}}>Channel2 Content</Text>
              </ScrollView>
            </View>
          </Tabbar.Item>
          <Tabbar.Item
            title="Channel3"
            icon={{uri: base64Icon}}
            iconStyle={iconStyle}
            style={itemStyle}
            selectedStyle={itemSelectedStyle}>
            <View style={styles.content}>
              <ScrollView>
                <Text style={{color: 'red', marginTop: 20, marginLeft: 20}}>Channel3 Content</Text>
              </ScrollView>
            </View>
          </Tabbar.Item>
          <Tabbar.Item
            title="My"
            icon={{uri: base64Icon}}
            iconStyle={iconStyle}
            style={itemStyle}
            selectedStyle={itemSelectedStyle}>
            <View style={styles.content}>
              <ScrollView>
                <Text style={{color: 'red', marginTop: 20, marginLeft: 20}}>My Content</Text>
              </ScrollView>
            </View>
          </Tabbar.Item>
        </Tabbar>
      </View>
    );
  }
}

export default TabbarDemo;
