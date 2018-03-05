import { createElement, PropTypes } from 'rax';
import { View, Text, RecyclerView } from 'rax-components';
import RowCell from './rowCell';
import ColumnCell from './columnCell';
import style from './style';

function Promotion(props) {
  if (!Array.isArray(props.sourceData)) {
    return null;
  }
  let data = props.sourceData.slice(0);
  if (data && data.length < 4) return null;
  const row = data.splice(0, 2);
  const column = data;
  /* 14是每个cell paddingRight, 24是paddingLeft 6是buffer */
  const columnTextWidth = 750 / column.length - (14 + 26 + 6);
  return [
    <RecyclerView.Cell style={style.rowContrainer}>
      {
        row.map(function(item, index) {
          item.appUrl = item.appUrl;
          return <View><RowCell dataSource={item} style={
            index !== 0 ? [style.cell, style.cellCommon] : style.cellCommon
          } /></View>;
        })
      }
    </RecyclerView.Cell>,
    <RecyclerView.Cell style={style.columnContrainer}>
      {
        column.map(function(item, index) {
          if (item.key === 'neiborhood') {
            if (item.entrys && item.entrys.length !== 0) {
              item.appUrl = (item.entrys[0] || {}).appUrl;
            } else {
              item.title = '';
            }
          }

          item.appUrl = item.appUrl;
          return <View style={[style.cellCommon, {
            borderBottomWidth: 1,
            borderLeftWidth: index !== 0 ? 1 : 0
          }]}>
            <ColumnCell
              dataSource={item}
              textStyle={{maxWidth: columnTextWidth}} />
          </View>;
        })
      }
    </RecyclerView.Cell>
  ];
}

Promotion.propTypes = {
  sourceData: PropTypes.array
};

Promotion.defaultProps = {
  sourceData: []
};

export default Promotion;