# Asyncstorage 本地存储

## 概述

`storage` 是一系列允许你增删改查本地数据的API。类似于 web 下的 localstorage

> 注意：设置的缓存，不可以通过手淘的'清除缓存'清除掉

## API

### setItem(key, value, callback)

传递一个 key 进去可以增加数据
如果已经存在 key，修改数据

#### 参数

* `key`*(string)*: 要存储数据的名字。 "" or null 是被不允许的
* `value`*(string)*: 要存储的值。"" or null 是不被允许的
* `callback`*(object)*: 成功回调

##### 示例

```js
let AsyncStorage = require('universal-asyncstorage');

AsyncStorage.setItem('bar', 'bar-value', function(obj) {
  // callback.'obj' is an object that contains 'result' and 'data'. obj.result indicate wether `setItem` is succeed.
  // obj.data will return 'undefined' if success or 'invalid_param' if your key/value is ""/null.
});
```

### getItem(key, callback)

当传递一个名字，会返回这个名字的值

#### 参数

* `key`*(string)*:  要查询的名字。"" or null 是不被允许的
* `callback`*(object)*: 成功回调

##### 示例

```js
let AsyncStorage = require('universal-asyncstorage');

AsyncStorage.getItem('foo', function(e) {
  //callback.'e' is an object that contains 'result' and 'data'.
  // use 'e.data' to fetch the value of the key,if not found,'undefined' will return.
});
```

### removeItem(key, callback)

传递一个名字，删除掉改名字的值

#### 参数

* `key`*(string)*:  你要删除数据的名字 "" or null 不被允许的
* `callback`*(object)*: 成功回调

##### 示例

```js
let AsyncStorage = require('universal-asyncstorage');

AsyncStorage.removeItem('foo', function(obj) {
  // callback. 'obj' is an object that contains 'result' and 'data'.
  // obj.result will return 'success' or 'failed' according to the executing result.
  // obj.data will always return 'undefined' in this function if success.
});
```

### sLength(callback)

返回在本地存储了几个数据

#### Arguments

* `callback`*(object)*: 成功回调

##### Example

```jsx
const AsyncStorage = require('universal-asyncstorage');

AsyncStorage.sLength(function(obj) {
  // callback. 'obj' is an object that contains 'result' and 'data'.
  // obj.data will return that number.
});
```

### getAllKeys(callback)

返回本地存储数据的键集合

#### 参数

* `callback`*(object)*: 成功回调

##### 示例

```jsx
let AsyncStorage = require('universal-asyncstorage');

AsyncStorage.getAllKeys(function(obj) {
  // callback. 'obj' is an object that contains 'result' and 'data'.
  // obj.data will return that array of keys.
});
```

### clear()

清空所有数据

##### 示例

```jsx
const AsyncStorage = require('universal-asyncstorage');

AsyncStorage.clear();
```

### multiRemove(keys)

清空指定数组的数据

#### 参数

* `keys`*(array)*: 键集合

##### 示例

```jsx
const AsyncStorage = require('universal-asyncstorage');

AsyncStorage.multiRemove(['test', 'test1']);
```

> 注意：所有API都是异步，在 web 下使用也希望是异步和 weex 统一
