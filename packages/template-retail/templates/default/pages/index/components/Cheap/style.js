import {
  center
} from '../../mods/commonStyle';

export default {
  titleContainer: {
    position: 'relative',
    flexDirection: 'row',
    height: 80,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    marginTop: 20,
    ...center()
  },
  moreUrl: {
    position: 'absolute',
    right: 20,
    top: 24,
    lineHeight: 34,
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center'
  },
  offerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 338,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5'
  }
};