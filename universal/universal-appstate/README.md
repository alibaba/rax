# universal-appstate [![npm](https://img.shields.io/npm/v/universal-appstate.svg)](https://www.npmjs.com/package/universal-appstate)

## Installation

### To install universal-appstate from NPM, run:

```sh
npm install --save universal-appstate
```

## Create a universal appstate

```js
import AppState from 'universal-appstate';

console.log(AppState.isAvailable);
console.log(AppState.currentState); // active|background

const _handleAppStateChange = (nextAppState) => {
  console.log(nextAppState); // active|background
}

AppState.addEventListener('change', _handleAppStateChange);
AppState.removeEventListener('change', _handleAppStateChange);
```
