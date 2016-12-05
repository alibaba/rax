# universal-stylesheet [![npm](https://img.shields.io/npm/v/universal-stylesheet.svg)](https://www.npmjs.com/package/universal-stylesheet)

## Installation

### To install universal-stylesheet from NPM, run:

```sh
npm install --save universal-stylesheet
```

## Create a universal StyleSheet

```js
import StyleSheet from 'universal-stylesheet';

const styles = StyleSheet.create({
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

### create
```js
/**
 * Creates stylesheet object
 *
 * @param {Object} styles
 * @returns {Object}
 */
 create (styles) {...}
```
### flatten
```js
/**
 * flatten style object
 *
 * @param {Object} style
 */
 flatten (style) {...}
```

## Example

```js
import StyleSheet from 'universal-stylesheet';

const styles = StyleSheet.create({
  container: {
    width: 750,
    height: 500,
    backgroundColor: 'red'
  },
  header: {
    width: 750,
    height: 30,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ddd'
  },
  row: {
    flexDirection: 'row'
  },
  listA: {
    width: 750,
    flex: 1,
    backgroundColor: 'red'
  },
  listB: {
    backgroundColor: 'green'
  }
});

StyleSheet.flatten([styles.listA, styles.listB]) // => { width: 750, flex: 1, backgroundColor: 'green' }
```
