import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Touchable from 'rax-touchable';
import ListView from 'rax-listview';
import Navigator from '../Navigator';
import Item from './Item';
import styles from './contact.css';

export default class Contact extends Component {

  generateItem = (item, idx) => {
    return (
      <Item
        title={item.title}
        header={item.header}
        key={idx}
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
  { title: '新的朋友', header: {uri: require('../../images/new-friend.png')} },
  { title: '群聊', header: {uri: require('../../images/group.png')} },
  { title: '标签', header: {uri: require('../../images/tag.png')} },
  { title: '公众号', header: {uri: require('../../images/gongzhonghao.png')} },
];

