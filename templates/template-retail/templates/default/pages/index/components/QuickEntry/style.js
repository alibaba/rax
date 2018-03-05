import {
  center,
  percent
} from '../../mods/commonStyle';

export default {
  container: {
    width: percent(100),
    height: 184,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 21,
    paddingRight: 21
  },
  item: {
    flex: 1,
    ...center()
  },
  image: {
    width: 96,
    height: 96
  },
  text: {
    fontSize: 20,
    lineHeight: 23,
    marginTop: 12,
    color: '#333',
    textAlign: 'center'
  }
};