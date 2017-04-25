import {createElement, Component} from 'rax';
import Picture from 'rax-picture';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';

class Card extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.dataSource || nextProps.dataSource[0].item_numiid !== this.props.dataSource[0].item_numiid;
  }
  render() {
    let {dataSource, ...otherProps} = this.props;
    if (!dataSource) {
      dataSource = ['', ''];
      return <View style={styles.container}>{
        dataSource.map((item, index) => {
          return <View key={index} style={styles.item}>
            <View style={styles.itemPicPlaceholder} />
            <View style={styles.itemTitlePlaceholder} />
            <View style={styles.linePlaceholder} />
          </View>;
        })}
      </View>;
    }
    return <View style={styles.container} {...otherProps}>{
      dataSource.map((item, index) => {
        return <Link key={index} href={item.url} style={styles.item}>
          <Picture source={{uri: item.pic}} style={styles.itemPic} />
          <View style={styles.itemTitleWrap}>
            <Text numberOfLines="2" style={styles.itemTitle}>{item.title}</Text>
          </View>
          <View style={styles.lineWrap}>
            <Text style={styles.price}>￥</Text>
            <Text style={styles.priceTxt}>{item.currentPrice}</Text>
            <Text style={styles.num}>{item.tradeNum}人付款</Text>
          </View>
        </Link>;
      })}
    </View>;
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 750,
    height: 526,
    marginBottom: 20
  },
  item: {
    width: 369,
    height: 526,
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  itemPic: {
    width: 369,
    height: 369
  },
  itemPicPlaceholder: {
    width: 369,
    height: 369,
    backgroundColor: '#eeeeee'
  },
  itemTitlePlaceholder: {
    marginTop: 12,
    marginLeft: 18,
    height: 30,
    width: 333,
    backgroundColor: '#eeeeee'
  },
  linePlaceholder: {
    marginTop: 12,
    marginLeft: 18,
    height: 30,
    width: 155,
    backgroundColor: '#eeeeee'
  },
  itemTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 12
  },
  itemTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 26,
    color: '#333333',
    textOverflow: 'ellipsis',
    lines: '2',
    overflow: 'hidden'
  },
  lineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 18,
    marginTop: 8
  },
  price: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 22,
    color: '#FF5000',
    marginBottom: 3
  },
  priceTxt: {
    fontFamily: 'PingFang SC',
    fontSize: 32,
    color: '#FF5000'
  },
  num: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 22,
    color: '#999999',
    marginLeft: 14,
    marginBottom: 4
  }
};

export default Card;