import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Touchable from 'rax-touchable';
import ListView from 'rax-listview';
import Navigator from '../Navigator';
import MessageItem from './Item';
import styles from './message.css';

export default class Message extends Component {

  generateItem = (item, idx) => {
    return (
      <MessageItem
        key={idx}
        name={item.name}
        content={item.content}
        time={item.time}
        header={item.header}
      />
    );
  }

  renderHeader = () => {
    return (
      <View style={styles.search}>
        <View style={styles.searchBtn}>
          <Touchable>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                  style={{height: 28, width: 28, marginRight: 12}}
                  source={{ uri: require('../../images/search.png') }}
                />
                <Text style={{fontSize: 28, color: '#7A7A7A'}}>搜索</Text>
              </View>
              <View>
                <Image
                  style={{height: 30, width: 30, marginRight: 12}}
                  source={{ uri: require('../../images/microphone.png') }}
                />
              </View>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }

  render() {
    const { title = '' } = this.props;

    return (
      <View style={styles.container}>
        <Navigator title={title} />
        <ListView
          renderHeader={this.renderHeader}
          renderRow={this.generateItem}
          dataSource={data}
        />
      </View>
    );
  }
}

const data = [
  { name: '德玛西亚', content: '人在塔在!', time: '15:07',
    header: {uri: require('../../images/demaxiya.png')} },
  { name: '啦啦啦啦', content: '我陪你吃草', time: '14:58',
    header: {uri: require('../../images/header2.png')} },
  { name: '文件传输助手', content: '[图片]', time: '13:42',
    header: {uri: require('../../images/file-manager.png')} }
];
