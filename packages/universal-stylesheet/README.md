# universal-stylesheet [![npm](https://img.shields.io/npm/v/universal-stylesheet.svg)](https://www.npmjs.com/package/universal-stylesheet)

## Installation

### To install universal-stylesheet from NPM, run:

```sh
npm install --save universal-stylesheet
```

## Create a universal StyleSheet

```js
import StyleSheet from 'universal-stylesheet';

let styles = StyleSheet.create({
  container: {
    width: 750,
    height: 500,
    backgroundColor: 'red'
  },
  header: {
    width: 750,
    height: 100,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ddd'
  },
  row: {
    flexDirection: 'row'
  }
});
```

## Use in the jsx

```js
<View style={styles.container}>
  <View style={[styles.row, styles.header]} />
</View>
```

## API

* create
* flatten
