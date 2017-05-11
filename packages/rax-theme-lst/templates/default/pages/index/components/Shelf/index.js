import { createElement, Component, PropTypes } from 'rax';
import { View, Text, Image, RecyclerView } from 'rax-components';
import style from './style';
import OpenUrl from '../../mods/openUrl';

class Recommend extends Component {
  static propTypes = {
    sourceData: PropTypes.object
  }

  static defaultProps = {
    sourceData: {}
  }

  hanldeGroceriesProps(sourceData) {
    let arr = [];
    let prev = sourceData.slice();
    let curr;
    while (prev && prev.length) {
      curr = prev.length && prev.splice(0, 4);
      arr.push(curr);
    }

    return arr;
  }

  groceriesRow(item, row) {
    const img = 'https://cbu01.alicdn.com/cms/upload/2017/161/692/3296161_38443169.png';
    if (!item.length) {
      return null;
    }
    return (
      <RecyclerView.Cell style={style.listView}>
        {item.map(itemImage, row)}
        <View style={style.shelfBorder} />
        <Image source={{uri: img}} style={style.shadowImg} resizeMode="cover" />
      </RecyclerView.Cell>
    );

    function itemImage(itemDetail, index) {
      if (!itemDetail.image && !itemDetail.title) {
        return null;
      }

      const appUrl = itemDetail.appUrl;
      return (
        <OpenUrl style={style.listViewItem} url={appUrl}>
          <Image source={{uri: itemDetail.image}} resizeMode="cover"
            style={style.groceriesImage} lazyload={true} />
          <View style={style.listViewTitle}>
            <Text style={style.listViewTitleFont}>{itemDetail.title}</Text>
          </View>
        </OpenUrl>
      );
    }
  }

  render() {
    const props = this.props;
    const lists = props.sourceData.data || [];
    const sourceData = this.hanldeGroceriesProps(lists);
    if (sourceData.length === 0) {
      return null;
    }

    return [
      <RecyclerView.Cell style={style.titleWrapper}>
        <Text style={style.title}>{props.sourceData.title}</Text>
      </RecyclerView.Cell>,
      ...sourceData.map(this.groceriesRow)
    ];
  }
}

export default Recommend;