const errImage =
  'https://gw.alicdn.com/tfs/TB1VBforHSYBuNjSspfXXcZCpXa-510-370.png';

/**
 * Create an error page.
 * @param createElement {Function}
 * @param message {String}
 * @param showNavigateBack {Boolean}
 */
export default function createErrorPage({
  createElement,
  message = '好像发生了一些问题',
  showNavigateBack = true,
}) {
  return createElement(
    'view',
    { style: styles.container },
    [
      createElement('image', {
        style: styles.image,
        src: errImage,
        mode: 'widthFix',
      }),
      createElement('text', { style: styles.text }, message),
      showNavigateBack ? createElement('navigator', { 'open-type': 'navigateBack' }, [
        createElement('button', { size: 'small', style: styles.button }, '返回')
      ]) : null,
    ]
  );
}

const styles = {
  container: {
    width: 750,
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center'
  },
  image: {
    width: 290,
  },
  text: {
    marginTop: 30,
    fontSize: 30,
    color: '#999999'
  },
  button: {
    marginTop: 10,
  },
};
