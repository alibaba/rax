import {createElement, Component} from 'rax';
import View from 'rax-view';
import ListView from 'rax-listview';
import Navigator from '..//Navigator';
import Item from '..//RowItem';
import styles from './discover.css';


export default class Discover extends Component {
  renderRow = (items, idx) => {
    return (
      <View style={styles.group} key={idx}>
        {
          items.map((item, idx) => <Item key={idx} title={item.title} icon={item.icon} />)
        }
      </View>
    );
  }

  render() {
    const { title = '' } = this.props;
    return (
      <View style={styles.container}>
        <Navigator title={title} />
        <ListView
          renderRow={this.renderRow}
          dataSource={data}
        />
      </View>
    );
  }
}

const data = [
  [{ title: '朋友圈', icon: { uri: require('../../images/pengyouquan.png') }}],

  [{ title: '扫一扫', icon: { uri: require('../../images/scanning.png') }},
  { title: '摇一摇', icon: { uri: require('../../images/shake.png') }}],

  [{ title: '附近的人', icon: { uri: require('../../images/nearby.png') }},
  { title: '漂流瓶', icon: { uri: require('../../images/bottle.png') }}],

  [{ title: '购物', icon: { uri: require('../../images/shopping.png') }},
  { title: '游戏', icon: { uri: require('../../images/game.png') }}],
];
