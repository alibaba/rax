import {
  center,
  percent
} from '../../mods/commonStyle';

export default {
  image: {
    position: 'absolute',
    top: 0,
    width: percent(100),
    height: 174
  },
  header: {
    position: 'absolute',
    top: 40,
    width: percent(100),
    height: 116 - 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconWrapper: {
    width: 44 + 2 * 24,
    height: 56,
    position: 'relative',
    ...center()
  },
  newMessage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    color: '#CC221D',
    fontSize: 24,
    position: 'absolute',
    top: navigator.platform === 'iOS' ? -8 : 0,
    right: 10,
    backgroundColor: '#fff'
  },
  scan: {
    width: 44,
    height: 39
  },
  message: {
    width: 44,
    height: 39
  },
  searchbar: {
    flex: 1,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 3,
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIcon: {
    width: 26,
    height: 26,
    marginLeft: 12
  },
  position: {
    marginLeft: 12
  },
  keyword: {
    fontSize: 24,
    color: 'black'
  },
  placeholder: {
    fontSize: 24,
    color: '#666'
  }
};
