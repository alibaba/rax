import { createElement, Component, PropTypes } from 'rax';
import { View, Text, Image, RecyclerView, ScrollView } from 'rax-components';
import OpenUrl from '../../mods/openUrl';
import { getRandomValue } from '../../mods/util.js';
import style from './style.js';

export default class CashierCounter extends Component {
  static propTypes = {
    sourceData: PropTypes.object,
    style: PropTypes.object
  }

  static defaultProps = {
    sourceData: {}
  }

  render() {
    const sourceData = this.props.sourceData.data || {};
    if (!sourceData.cashier || !sourceData.cashier.length) return null;

    const moreUrl = sourceData.moreUrl;

    return (
      <RecyclerView.Cell style={[style.container, this.props.style]}>
        <View style={style.titleSection}>
          <Image
            source={{uri: sourceData.backgroundImg}}
            style={style.image}
            resizeMode="cover" />
          <View style={style.textContainer}>
            <Text style={style.title}>{sourceData.title}</Text>
            <Text style={style.subTitle} numberOfLines="1">
              {sourceData.subTitle}
            </Text>
          </View>
          <View style={style.more}>
            <Text style={style.moreText}>更多</Text>
          </View>
          <OpenUrl
            style={style.highlight}
            url={moreUrl} />
        </View>

        <ScrollView horizontal={true} style={style.scroll} showsHorizontalScrollIndicator={false}>
          {
            sourceData.cashier.map((item = {}) => {
              const appUrl = item.appUrl;

              return item.imgs && item.imgs.length ?
                <View>
                  <OpenUrl
                    component={Image}
                    style={style.scrollImage}
                    source={{uri: (getRandomValue(item.imgs) || {}).imgSrc}}
                    resizeMode="cover"
                    url={appUrl} /> </View> : null;
            })
          }
        </ScrollView>
      </RecyclerView.Cell>
    );
  }
}