import { PropTypes, Component, createElement } from 'rax';
import { View, Text, RecyclerView, Image } from 'rax-components';
import Cell from '../OfferCell';
import style from './style';

export default class OfferList extends Component {
  static propsTypes = {
    sourceData: PropTypes.array,
    cellStyle: PropTypes.object,
    style: PropTypes.object,
    hasMoreOffer: PropTypes.bool
  }

  static defaultProps = {
    sourceData: [],
    hasMoreOffer: true
  }

  getRowCell(sourceData) {
    let rows = [];
    for (let i = 0; i < sourceData.length; i += 2) {
      let offerOdd = sourceData[i];
      offerOdd.offerDetailUrl = offerOdd.offerDetailUrl;

      let offerEven = sourceData[i + 1];
      offerEven.offerDetailUrl = offerEven.offerDetailUrl;
      // 第一排cell不能有上边框
      let topBorder = i !== 0 ? {
        borderTopWidth: 1
      } : {};
      rows.push(
        <RecyclerView.Cell style={style.cellContrainer}>
          <Cell style={[style.cell, topBorder, this.props.cellStyle]} offer={offerOdd} />
          {sourceData[i + 1] ?
            (<View>
              <Cell
                style={[style.cell, style.rightCell, topBorder, this.props.cellStyle]}
                offer={offerEven} />
            </View>) : null
          }
        </RecyclerView.Cell>
      );
    }

    return rows;
  }

  render() {
    const props = this.props;
    const sourceData = props.sourceData;
    if (!sourceData.length) return null;
    return (
      [<RecyclerView.Cell style={style.title}>
        <Text style={style.titleText}>为你推荐</Text>
      </RecyclerView.Cell>,
      ...this.getRowCell(sourceData),
      props.hasMoreOffer ?
        <RecyclerView.Cell style={style.loadingSection}>
          <Image
            source={{uri: 'https://cbu01.alicdn.com/cms/upload/2017/911/203/3302119_38443169.gif'}}
            style={style.loading}
          />
        </RecyclerView.Cell>
        :
        <RecyclerView.Cell style={style.noMoreSection}>
          <Image
            source={{uri: 'https://cbu01.alicdn.com/cms/upload/2017/112/103/3301211_38443169.png'}}
            style={style.nomore}
          />
          <Text style={style.nomoreText}>已经到底了...</Text>
        </RecyclerView.Cell>
      ]

    );
  }
}
