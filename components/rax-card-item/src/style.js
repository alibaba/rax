const styles = {
  container: {
    width: 750,
    backgroundColor: '#ffffff'
  },
  itemwrap: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#e0e0e0',
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4
  },
  item: {
    flexDirection: 'row'
  },
  pic: {
    width: 250,
    height: 250
  },
  content: {
    marginLeft: 24,
    marginRight: 20,
    position: 'relative',
    width: 446
  },
  textwrap: {
    overflow: 'hidden',
    marginTop: 18,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    color: '#333333',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 446
  },
  subtitle: {
    fontSize: 28,
    color: '#333333',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 446,
    marginTop: 8
  },
  desc: {
    fontSize: 28,
    color: '#999999',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 446,
    marginTop: 8
  },
  sign: {
    flexDirection: 'row',
    position: 'absolute',
    width: 300,
    left: 0,
    bottom: 20
  },
  highlightext: {
    fontFamily: 'PingFangSC-Medium',
    color: '#ff5000',
    fontSize: 34
  },
  weakentext: {
    fontFamily: 'PingFang SC',
    fontSize: 24,
    color: '#999999',
    marginLeft: 14,
    marginTop: 10,
    textDecoration: 'line-through'
  },
  extratext: {
    fontSize: 24,
    color: '#999999',
    position: 'absolute',
    right: 4,
    bottom: 20
  },
  tagtext: {
    fontSize: 24,
    color: '#204994',
    position: 'absolute',
    right: 4,
    bottom: 20
  }
};


export default styles;