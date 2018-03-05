'use strict';

import {PropTypes, createElement, Component} from 'rax';
import {View, Text, Image, Link} from 'rax-components';
import { isWeb } from 'universal-env';
import Openurl from '../../mods/openUrl';
import styles from './style.js';

class Offer extends Component {
  static propsTypes = {
    offer: PropTypes.object,
    style: PropTypes.string
  }

  static defaultProps = {
    offer: {}
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps.offer) !== JSON.stringify(this.props.offer);
  }

  render() {
    const {offer, style} = this.props;
    const price = offer.discountPrice ? offer.discountPrice.toString() : offer.price;
    const addCartUrl = '';

    return (<View style={[styles.container, style]}>
      <Openurl url={offer.offerDetailUrl}>
        <Image
          source={{uri: offer.offerImage}}
          style={{width: 372, height: 372, paddingLeft: 0, paddingRight: 0}}
          resizeMode={'cover'}
        />
        <View style={styles.infoWrap}>
          <Text style={[styles.title]} numberOfLines={2} >{offer.offerTitle}</Text>
          <View style={[styles.util.flexRow]}>
            {offer.moq ?
              <Text style={[styles.subText, styles.util.flexRow]}>{offer.moq}
                {offer.unit}起批
              </Text> : null
            }
          </View>
          <View style={styles.priceWrap}>

            <Text style={[styles.priceText, {marginRight: 4}]}>¥</Text>
            <Text style={styles.oldPrice}>{price}</Text>
            <Text style={[styles.priceText, {color: '#666666', top: -1}]}>/</Text>
            <Text style={[styles.priceText, {color: '#666666'}]}>{offer.unit}</Text>
          </View>
        </View>
      </Openurl>
      {isWeb ?
        <Link href={addCartUrl} style={styles.addCart} /> :
        <Openurl url={addCartUrl} style={styles.addCart} />
      }
    </View>);
  }
}

export default Offer;
