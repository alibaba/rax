import {
  center
} from '../../mods/commonStyle';

export default {
  container: {
    width: 750,
    marginTop: 24,
    overflow: 'hidden'
  },
  title: {
    width: 750,
    height: 80,
    backgroundColor: '#fff',
    borderColor: '#e5e5e5',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    ...center()
  },
  titleText: {
    fontSize: 34,
    color: '#333',
    fontWeight: 'bold'
  },
  cellContrainer: {
    flexDirection: 'row'
  },
  cell: {
    marginBottom: 4,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderBottomWidth: 1
  },
  rightCell: {
    marginLeft: 4,
    borderRightWidth: 0,
    borderLeftWidth: 1
  },
  loadingSection: {
    backgroundColor: '#fff',
    width: 750,
    height: 146,
    paddingBottom: 20,
    ...center()
  },
  loading: {
    height: 146,
    width: 249
  },
  noMoreSection: {
    width: 750,
    height: 130,
    flexDirection: 'row',
    ...center()
  },
  nomore: {
    width: 62,
    height: 96
  },
  nomoreText: {
    marginLeft: 16,
    fontSize: 26,
    color: '#999'
  }
};