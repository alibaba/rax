import {
  center,
  textOverflow,
  percent
} from '../../mods/commonStyle';

export default {
  container: {
    width: percent(100),
    height: 76,
    backgroundColor: '#fff',
    position: 'relative',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    ...center()
  },
  image: {
    marginLeft: 20,
    width: 118,
    height: 30,
    marginTop: 2
  },
  textsView: {
    flex: 1,
    marginRight: 15,
    height: 54,
    overflow: 'hidden'
  },
  texts: {
    paddingRight: 20,
    marginTop: 12,
    marginLeft: 18,
    fontSize: 24,
    height: 34,
    color: '#333',
    ...textOverflow()
  },
  allView: {
    position: 'absolute',
    left: 0
  }
};