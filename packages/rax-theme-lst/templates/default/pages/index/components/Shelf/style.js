import {
  center,
  percent
} from '../../mods/commonStyle';

export default {
  title: {
    marginBottom: 24,
    paddingTop: 40,
    fontWeight: 'bold',
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5'
  },
  groceriesImage: {
    width: 156,
    height: 156
  },
  listView: {
    paddingLeft: 21,
    paddingRight: 21,
    width: percent(100),
    flexDirection: 'row',
    position: 'relative'
  },
  listViewItem: {
    marginBottom: 43,
    width: (percent(100) - 42) / 4,
    ...center()
  },
  listViewTitle: {
    width: (percent(100) - 42) / 4,
    textAlign: 'center',
    height: 71,
    lineHeight: 71,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    ...center()
  },
  listViewTitleFont: {
    fontSize: 29,
    color: '#333'
  },
  shelfBorder: {
    position: 'absolute',
    left: 21,
    bottom: 43,
    height: 71,
    width: percent(100) - 42,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5'
  },
  shadowImg: {
    position: 'absolute',
    left: 21,
    bottom: 22,
    height: 22,
    width: percent(100) - 42
  }
};