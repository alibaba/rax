import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import Picture from 'rax-picture';

class Card extends Component {
  render() {
    let {
      title,
      pic,
      desc,
      url,
      price,
      commendNum
    } = this.props;

    return (
      <Link href={url} style={style.root}>
        <View style={style.container}>
          <View style={style.picBox}>
            <Picture source={{uri: pic}} style={style.pic} resizeMode={'contain'} />
          </View>
          <View style={style.context}>
            <Text numberOfLines="1" style={style.title}>{title}</Text>
            <Text numberOfLines="2" style={style.desc}>{desc}</Text>
            <Text numberOfLines="1" style={style.price}>{price}</Text>
            <Text numberOfLines="1" style={style.commendNum}>{commendNum}</Text>
          </View>
        </View>
      </Link>
    );
  }
}

let style = {
  root: {
    width: 750,
  },
  container: {
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    width: 750,
    paddingLeft: 22,
    paddingTop: 11,
    height: 188,
  },
  picBox: {
    borderStyle: 'solid',
    borderColor: '#efefef',
    borderWidth: 1,
    marginRight: 22,
    width: 164,
    height: 164
  },
  pic: {
    width: 164,
    height: 164
  },
  context: {
    flexDirection: 'column',
    paddingTop: 10,
    position: 'relative',
    width: 515,
    height: 177
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 24,
    color: '#333333',
    textOverflow: 'ellipsis'
  },
  desc: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 24,
    color: '#979797',
    textOverflow: 'ellipsis',
    marginTop: '10rem'

  },
  price: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 24,
    textOverflow: 'ellipsis',
    position: 'absolute',
    color: '#ff4200',
    bottom: 10,
    left: 0
  },
  commendNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 24,
    textOverflow: 'ellipsis',
    position: 'absolute',
    bottom: 10,
    right: 10
  }
};


export default Card;