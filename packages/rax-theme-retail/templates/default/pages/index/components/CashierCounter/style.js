import {
  textOverflow,
  center,
  borderRadius,
  percent
} from '../../mods/commonStyle';

export default {
  container: {},
  titleSection: {
    backgroundColor: '#fff',
    width: percent(100),
    height: 180,
    position: 'relative',
    marginTop: 20,
    ...center()
  },
  highlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: percent(100),
    height: 150
  },
  image: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: percent(100),
    height: 180
  },
  textContainer: {
    width: 320,
    height: 110,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    lineHeight: 45
  },
  subTitle: {
    maxWidth: 320,
    fontSize: 22,
    color: '#B19E90',
    lineHeight: 30,
    ...textOverflow()
  },
  more: {
    flexDirection: 'row',
    position: 'absolute',
    top: 86,
    right: 20,
    width: 100,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    ...borderRadius(22)
  },
  moreText: {
    fontSize: 24,
    color: '#333',
    paddingLeft: 8
  },
  moreIcon: {
    fontSize: 18,
    marginLeft: 2
  },
  scroll: {
    backgroundColor: '#fff',
    width: percent(100),
    height: 160,
    paddingTop: 20,
    paddingLeft: 6,
    paddingRight: 26,
    marginBottom: 1
  },
  scrollImage: {
    width: 176,
    height: 101,
    marginLeft: 20
  }
};