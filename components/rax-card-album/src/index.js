import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import Picture from 'rax-picture';
import styles from './style';

class Card extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.dataSource || nextProps.dataSource.pic !== this.props.dataSource.pic) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    let {dataSource, ...otherProps} = this.props;
    let data = dataSource[0];
    if (!data) {
      return;
    }
    return (
      <View style={styles.container} {...otherProps}>
        <View style={styles.contentItemTitle}>
          <Text style={styles.contentItemTitleTxt} numberOfLines="1">{data.title}</Text>
        </View>
        <View style={styles.contentItemDesc}>
          <Text style={styles.contentItemDescTxt} numberOfLines="1">{data.summary}</Text>
        </View>
        <Link style={styles.itemInfo} href={data.url}>
          <Picture source={{uri: data.pic}} style={styles.itemPic} autoWebp={true} />
          <View>
            <View style={styles.infoTitle}><Text style={styles.titleText}>{data.picText}</Text></View>
            <View style={styles.infoLook}>
              <View style={styles.infoLine} />
              <View style={styles.infoBtn}><Text style={styles.btnText}>立即查看</Text></View>
              <View style={styles.infoLine} />
            </View>
          </View>
          <View style={styles.infoArrow} />
        </Link>
        <View style={styles.centerWrap}>
          <View style={styles.itemsWrap}>
            {data.album.map((item, index) => {
              return (
                <Link key={index} style={styles.itemLink} href={item.url}>
                  <Picture style={styles.itemImg} source={{uri: item.pic}} autoWebp={true} />
                </Link>
              );
            })}
          </View>
        </View>
        <View style={styles.contentItemExtra}>
          {data.userNick ? <Text style={styles.extraFrom}>来自</Text> : null}
          {data.userNick ? <Text style={styles.extraSource}>{data.userNick}</Text> : null}
          {data.pvCount ? <View style={styles.viewCountCtn}>
            <Picture style={styles.viewCountImage} source={{uri: 'http://gw.alicdn.com/mt/TB1Wm0mLXXXXXXbapXXXXXXXXXX-24-24.png'}} />
            <Text style={styles.viewCountText}>{data.pvCount}</Text>
          </View> : null}
        </View>
      </View>
    );
  }
}

export default Card;