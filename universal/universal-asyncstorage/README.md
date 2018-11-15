# universal-asyncstorage [![npm](https://img.shields.io/npm/v/universal-asyncstorage.svg)](https://www.npmjs.com/package/universal-asyncstorage)

> AsyncStorage

## Install

```bash
$ npm install universal-asyncstorage --save
```

## Usage

```js
import AsyncStorage from 'universal-asyncstorage';
```

## APIS

### setItem(key, value)
```js
try {
  await AsyncStorage.setItem('key', 'value');
} catch (error) {
}
```

### getItem(key)
```js
try {
  const value = await AsyncStorage.getItem('key');
  if (value !== null){
    console.log(value);
  }
} catch (error) {
}
```

### removeItem(key)
```js
try {
  await AsyncStorage.removeItem('key');
} catch (error) {
}
```

### getAllKeys()
```js
try {
  await AsyncStorage.getAllKeys();
} catch (error) {
}
```

### clear()
```js
try {
  await AsyncStorage.clear();
} catch (error) {
}
```
