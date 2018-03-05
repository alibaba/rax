import {
  percent
} from '../../mods/commonStyle';


export default {
  rowContrainer: {
    flexDirection: 'row',
    width: percent(100)
  },
  columnContrainer: {
    flexDirection: 'row',
    width: percent(100)
  },
  cell: {
    borderLeftWidth: 1
  },
  bottomRow: {
    borderBottomWidth: 1
  },
  cellCommon: {
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    flex: 1,
    borderTopWidth: 1,
    overflow: 'hidden'
  }
};