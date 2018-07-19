import storage from '@core/storage';

export function getStorageSync(key) {
  throw new Error(
    'getStorageSync: 在淘宝轻应用中不存在此方法，需要修改成异步的 getStorage 调用'
  );
}

export function getStorage(params) {
  storage.getItem(
    {
      key: params.key
    },
    ({ data }) => {
      params.success({
        data: JSON.parse(data)
      });
    },
    params.fail
  );
}

export function setStorageSync(key, val) {
  throw new Error(
    'setStorageSync: 在淘宝轻应用中不存在此方法，需要修改成异步的 setStorage 调用'
  );
}

export function setStorage(params) {
  storage.setItem(
    {
      key: params.key,
      value: JSON.stringify(params.data)
    },
    params.success,
    params.fail
  );
}
