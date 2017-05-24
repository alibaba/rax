const style = {
  container: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    width: 750,
    height: 384,
    paddingLeft: 18,
    flexDirection: 'row'
  },
  item: {
    link: {
      width: 234,
      height: 384,
      marginRight: 6,
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'column',
      display: 'flex'
    },
    image: {
      marginTop: 18,
      width: 234,
      height: 234,
      resizeMode: 'contain',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    titleWrap: {
      display: 'flex',
      width: 218,
      height: 36,
      marginTop: 24,
      marginLeft: 16,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'left',
      alignContent: 'flex-start',
      textAlign: 'left',
      overflow: 'hidden'
    },
    title: {
      width: 218,
      fontSize: 28,
      color: '#333333',
      lines: '1',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    priceWrap: {
      display: 'flex',
      width: 218,
      height: 36,
      marginTop: 18,
      marginLeft: 16,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'left',
      alignContent: 'flex-start',
      textAlign: 'left',
      overflow: 'hidden'

    },
    price: {
      display: 'flex',
      fontSize: 28,
      color: '#ff6440',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      textAlign: 'left',
      lines: '1'
    }
  },
  imagePlaceholder: {
    backgroundColor: '#eeeeee'
  },
  titlePlaceholder: {
    marginLeft: 0,
    width: 200,
    backgroundColor: '#eeeeee'
  },
  pricePlaceholder: {
    marginLeft: 0,
    width: 160,
    backgroundColor: '#eeeeee'
  }
};

export default style;
