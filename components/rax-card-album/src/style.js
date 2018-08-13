const styles = {
  container: {
    width: 750,
    backgroundColor: '#ffffff'
  },
  contentItemTitle: {
    height: 70,
    marginLeft: 25,
    marginTop: 10,
    width: 700,
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: '0',
    webkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  contentItemTitleTxt: {
    fontSize: 36,
    color: '#051b28',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 700
  },
  contentItemDesc: {
    height: 40,
    marginLeft: 25,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: '0',
    webkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  contentItemDescTxt: {
    color: '#666666',
    fontSize: 28,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 700
  },
  itemInfo: {
    position: 'relative',
    height: 286,
    alignItems: 'center'
  },
  itemPic: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 286,
    width: 750
  },
  infoTitle: {
    position: 'relative',
    display: 'flex',
    marginTop: 90,
    borderTopWidth: 4,
    borderTopColor: '#ffffff',
    borderTopStyle: 'solid',

    height: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  infoLook: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoBtn: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  btnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoLine: {
    height: 4,
    backgroundColor: '#ffffff',
    flex: 1.5
  },
  infoArrow: {
    position: 'absolute',
    left: 375,
    marginLeft: -14,
    bottom: 0,
    border: '14rem solid transparent',
    borderBottomColor: '#ffffff'
  },
  itemsWrap: {
    width: 710,
    marginTop: 18,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  itemImg: {
    width: 160,
    height: 160
  },
  itemLink: {
    marginLeft: 9,
    marginRight: 9
  },
  centerWrap: {
    alignItems: 'center'
  },
  contentItemExtra: {
    flexDirection: 'row',
    marginTop: 16,
    marginRight: 22.6,
    marginBottom: 20,
    marginLeft: 22.5,
    position: 'relative'
  },
  extraTag: {
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderRadius: '3px',
    fontSize: 24,
    color: '#a5a5a5'
  },
  extraFrom: {
    marginLeft: 10,
    fontSize: 24,
    color: '#999999'
  },
  extraSource: {
    marginLeft: 10,
    fontSize: 24,
    color: '#999999'
  },
  viewCountCtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewCountImage: {
    width: 33,
    height: 27,
    marginRight: 12,
  },
  viewCountText: {
    fontSize: 24,
    color: '#999999',
  },

};

export default styles;