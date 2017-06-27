import {createElement, Component} from 'rax';
import View from 'rax-view';
import ListView from 'rax-listview';
import Navigator from '..//Navigator';
import MineHeader from './header';
import Item from '..//RowItem';
import styles from './mine.css';

export default class Mine extends Component {

  renderRow = (items, idx) => {
    return (
      <View style={styles.group} key={idx}>
        {
          items.map((item, idx) => {
            return (
              <Item
                title={item.title}
                icon={item.icon}
                key={idx} />
            );
          })
        }
      </View>
    );
  }

  render() {
    const { title = '' } = this.props;
    return (
      <View style={styles.container}>
        <Navigator title={title} />
        <MineHeader />
        <ListView
          renderRow={this.renderRow}
          dataSource={data}
        />
      </View>
    );
  }
}

const data = [
  [{ title: '相册', icon: { uri: require('../../images/album.png') } },
  { title: '收藏', icon: { uri: require('../../images/collection.png') } },
  { title: '钱包', icon: { uri: require('../../images/wallet.png') } },
  { title: '优惠券', icon: { uri: require('../../images/youhuiquan.png') } }],

  [{ title: '表情', icon: { uri: require('../../images/expression.png') } },
  { title: '设置', icon: { uri: require('../../images/setting.png') } }],
];
