import user from '@core/user';

const authSetting = {
  'scope.userInfo': true
};

export function getSetting(params) {
  const { success } = params || {};
  // pending until authed
}

const userInfoMock = {
  userInfo: {
    avatarUrl:
      'https://gw.alicdn.com/tfs/TB1Qa8FlL5TBuNjSspmXXaDRVXa-228-320.png',
    nickName: 'ZeroLing'
  }
};
export function getUserInfo(params) {
  if (typeof params === 'function') {
    return params({
      userId: '267737146'
    });
  }
  const { success } = params || {};
  user.info(
    {},
    response => {
      if (typeof success === 'function') {
        success(userInfoMock);
      }
    },
    err => {
      console.error(err);
    }
  );
}

export function canIUse(key) {
  switch (key) {
    case 'button.open-type.getUserInfo':
      return true;
  }
  return false;
}
