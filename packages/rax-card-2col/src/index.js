import {createElement, Component} from 'rax';
import Picture from 'rax-picture';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import styles from './style';

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
          {item.pic ? <Picture source={{uri: item.pic}} style={styles.itemPic} /> : null}
          {item.title ? <View style={styles.itemTitleWrap}>
            <Text numberOfLines="2" style={styles.itemTitle}>{item.title}</Text>
          </View> : null}
          <View style={styles.lineWrap}>
            {item.content ? <Text style={styles.content}>{item.content}</Text> : null}
            {item.content ? <Text style={styles.tagging}>{item.tagging}</Text> : null}
          </View>
        </Link>;
      })}
    </View>;
  }
}

export default Card;