import normalize from './normalizeText';
import {createElement} from 'universal-rx';
import {View, Image} from 'rx-components';
import Platform from 'universal-platform';
import StyleSheet from 'universal-stylesheet';
import Divider from './Divider';
import colors from './colors';
import Text from './Text';

const Card = ({
  children,
  flexDirection,
  containerStyle,
  wrapperStyle,
  title,
  titleStyle,
  dividerStyle,
  image,
  imageStyle,
  fontFamily}) =>
  <View style={[
    styles.container,
    image && {padding: 0},
    containerStyle && containerStyle]}>
    <View style={[styles.wrapper, wrapperStyle && wrapperStyle, flexDirection && {flexDirection}]}>
      {
        title && !image &&
          <View>
            <Text style={[
              styles.cardTitle,
              titleStyle && titleStyle,
              fontFamily && {fontFamily}
            ]}>{title}</Text>
            <Divider style={[styles.divider, dividerStyle && dividerStyle]} />
          </View>

      }
      {
        image &&
          <View style={{flex: 1}}>
            <Image
              resizeMode="cover"
              style={[{flex: 1, width: null, height: 150}, imageStyle && imageStyle]}
              source={image} />
            <View
              style={[{padding: 10}, wrapperStyle && wrapperStyle]}>
              {title && <Text style={[styles.imageTitle, titleStyle && titleStyle]}>{title}</Text>}
              {children}
            </View>
          </View>

      }
      { !image && children}
    </View>
  </View>
;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: colors.grey5,
    borderWidth: 1,
    padding: 15 * 2,
    margin: 15 * 2,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1
      },
      android: {
        elevation: 1
      }
    })
  },
  imageTitle: {
    fontSize: normalize(14 * 2),
    marginBottom: 8 * 2,
    color: colors.grey1,
    fontWeight: '500'
  },
  wrapper: {
    backgroundColor: 'transparent'
  },
  divider: {
    marginBottom: 15 * 2
  },
  cardTitle: {
    fontSize: normalize(14 * 2),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15 * 2,
    color: colors.grey1
  }
});

export default Card;
