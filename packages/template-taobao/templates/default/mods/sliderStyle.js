export default {
  slideWrapper: {
    position: 'relative',
  },
  swipeWrapper: {
    overflow: 'hidden',
    position: 'relative'
  },
  swipeStyle: {
    position: 'relative',
    transform: 'translate3d(0,0,0)',
    transition: 'all .5s ease'
  },
  childrenStyle: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  activeDot: {
    borderRadius: '50%',
    marginLeft: '3rem',
    marginRight: '3rem',
    marginTop: '3rem',
    marginBottom: '3rem',
    display: 'inline-block'
  },
  normalDot: {
    borderRadius: '50%',
    marginLeft: '3rem',
    marginRight: '3rem',
    marginTop: '3rem',
    marginBottom: '3rem',
    display: 'inline-block'
  },
  defaultPaginationStyle: {
    position: 'absolute',
    bottom: '0.2rem',
    width: '100%',
    display: 'flex',
    margin: '0 auto',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    itemColor: 'rgba(255, 255, 255, 0.5)',
    itemSelectedColor: 'rgb(255, 80, 0)',
    itemSize: '8rem'
  }
};