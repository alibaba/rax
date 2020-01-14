jest.mock('universal-env', () => {
  return {
    isMiniApp: true,
    isNode: false,
    isWeChatMiniprogram: false,
    isWeb: false,
    isWeex: false
  };
});

let status = '';


const routes = [
  {
    'path': '/',
    'source': 'pages/Home/index'
  },
  {
    'path': '/page1',
    'source': 'pages/Page1/index',
  },
  {
    'path': '/page2',
    'source': 'pages/Page2/index'
  }
];

describe('history', () => {
  beforeAll(() => {
    global.my = {
      navigateTo: ({ url }) => {
        status = 'navigateTo:' + url;
      },
      redirectTo: ({ url }) => {
        status = 'redirectTo:' + url;
      },
      navigateBack: () => {
        status = 'navigateBack';
      }
    };

    global.getCurrentPages = () => {
      return [
        {
          route: 'pages/Page2/index'
        }
      ];
    };
  });

  it('push: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.push('/page1');
    });
    expect(status).toEqual('navigateTo:/pages/Page1/index');
  });

  it('replace: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.replace('/page1');
    });
    expect(status).toEqual('redirectTo:/pages/Page1/index');
  });

  it('goback: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.goBack();
    });
    expect(status).toEqual('navigateBack');
  });
});

describe('location', () => {
  beforeAll(() => {
    global.my = {
      navigateTo: ({ url }) => {
        status = 'navigateTo:' + url;
      },
      redirectTo: ({ url }) => {
        status = 'redirectTo:' + url;
      },
      navigateBack: () => {
        status = 'navigateBack';
      }
    };

    global.getCurrentPages = () => {
      return [
        {
          route: 'pages/Page2/index'
        }
      ];
    };
  });

  it('pathname', async() => {
    let history;
    await import('..').then(({ createMiniAppHistory }) => {
      history = createMiniAppHistory(routes);
    });
    expect(history.location.pathname).toEqual('/pages/Page2/index');
  });
});

