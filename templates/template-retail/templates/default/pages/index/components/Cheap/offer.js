import { PropTypes, Component, createElement } from 'rax';
import { View, Text, Image } from 'rax-components';
import OpenUrl from '../../mods/openUrl';

export default class CheapOffer extends Component {
  static propsTypes = {
    offerData: PropTypes.object,
    index: PropTypes.object
  }

  static defaultProps = {
    offerData: {}
  }

  render() {
    const {offerData} = this.props;
    const hasDiscount = offerData.discountPrice && offerData.discountPrice !== 0 && offerData.discountPrice < offerData.price;

    let discountPrice = hasDiscount ? offerData.discountPrice : offerData.price;
    let discount = 0;
    if (hasDiscount) {
      discount = Math.round(offerData.price * 100 - offerData.discountPrice * 100) / 100;
    }

    if (!offerData.offerTitle) {
      return null;
    }

    return (
      <OpenUrl style={styles.container} url={offerData.offerDetailUrl}>
        <Image source={{uri: offerData.offerImage}} resizeMode="cover" style={styles.offerImg} />

        {hasDiscount ?
          <Text style={styles.discoutnTag}>直降￥{discount}</Text> : null
        }

        <Text style={styles.title} numberOfLines={1}>{offerData.offerTitle}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>￥{discountPrice}</Text>
          <Text style={styles.priceSplash}>/</Text>
          <Text style={styles.priceUnit}>{offerData.unit}</Text>
          {hasDiscount ?
            <Text style={styles.oldPrice}>￥{offerData.price}</Text> : null
          }
        </View>
      </OpenUrl>
    );
  }
}

const styles = {
  container: {
    width: 250,
    padding: 20,
    borderLeftWidth: 1,
    borderColor: '#e5e5e5',
    boxSizing: 'border-box',
    position: 'relative'
  },
  offerImg: {
    width: 210,
    height: 210
  },
  title: {
    width: 210,
    fontSize: 24,
    marginTop: 16,
    textOverflow: 'ellipsis'
  },
  discoutnTag: {
    borderWidth: 1,
    borderColor: '#df2211',
    color: '#df2211',
    fontSize: 22,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    position: 'absolute',
    left: 20,
    top: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  price: {
    // top: -1,
    fontSize: 28,
    color: '#df2211',
    lineHeight: 40
  },
  priceSplash: {
    fontSize: 22,
    color: '#999999',
    lineHeight: 30
  },
  priceUnit: {
    fontSize: 22,
    color: '#999999',
    flex: 1,
    lineHeight: 30
  },
  oldPrice: {
    fontSize: 22,
    lineHeight: 30,
    color: '#999999',
    textDecoration: 'line-through'
  }
};
