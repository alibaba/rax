import {createElement, Component} from 'rax';
import Picture from 'rax-picture';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import styles from './style';

class Card extends Component {
  render() {
    let {dataSource, ...otherProps} = this.props;
    if (!dataSource) {
      dataSource = ['', '', ''];
      return (
        <View style={styles.container}>
          {dataSource.map((item, index) =>
            <View key={index} style={styles.item.link}>
              <View style={[styles.item.image, styles.imagePlaceholder]} />
              <View style={[styles.item.titleWrap, styles.titlePlaceholder]} />
              <View style={[styles.item.priceWrap, styles.pricePlaceholder]} />
            </View>
          )}
        </View>
      );
    }
    return (
      <View style={styles.container} {...otherProps}>
        {dataSource.slice(0, 3).map((item, index) =>
          <Link key={index} style={styles.item.link} href={item.url}>
            <Picture style={styles.item.image} source={{uri: item.pic}} autoWebp={true} resizeMode="contain" />
            <View style={styles.item.titleWrap}>
              <Text style={styles.item.title} numberOfLines="1">{item.title}</Text>
            </View>
            <View style={styles.item.priceWrap}>
              <Text style={styles.item.price} numberOfLines="1">&yen;&nbsp;{item.price}</Text>
            </View>
          </Link>
        )}
      </View>
    );
  }
}

export default Card;
