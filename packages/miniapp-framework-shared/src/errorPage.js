const errImage =
  'https://gw.alicdn.com/tfs/TB1VBforHSYBuNjSspfXXcZCpXa-510-370.png';

export default function createErrorPage({
  createElement,
  message = '好像发生了一些问题',
  require
}) {
  const navigator = require('@core/navigator');

  function pop() {
    navigator.pop();
  }

  return createElement(
    'view',
    {
      style: styles.container
    },
    [
      createElement('image', {
        style: styles.image,
        src: errImage,
        mode: 'widthFix',
      }),
      createElement(
        'text',
        {
          style: styles.text
        },
        message
      ),
      createElement(
        'button',
        {
          size: 'small',
          onClick: pop,
          style: {
            marginTop: 10
          }
        },
        '返回'
      )
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
    width: 290
  },
  text: {
    marginTop: 30,
    fontSize: 30,
    color: '#999999'
  }
};
