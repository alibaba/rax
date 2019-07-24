# Postcss plugin rpx2vw

> Transform rpx to vw.

## Install

```bash
$ npm install --save postcss-plugin-rpx2vw
```

## Example

### Input

```css
.a {
  margin: -10rpx .5vh;
  padding: 5vmin 9.5rpx 1rpx;
  border: 3rpx solid black;
  border-bottom-width: 1rpx;
  font-size: 14rpx;
  line-height: 20rpx;
}

.b {
  border: 1rpx solid black;
  margin-bottom: 1rpx;
  font-size: 20rpx;
  line-height: 30rpx;
}

@media (min-width: 750rpx) {
  .c {
    font-size: 16rpx;
    line-height: 22rpx;
  }
}
```

### Output

```css
.a {
  margin: -1.33333vw .5vh;
  padding: 5vmin 1.26667vw 0.13333vw;
  border: 0.4vw solid black;
  border-bottom-width: 0.13333vw;
  font-size: 1.86667vw;
  line-height: 2.66667vw;
}

.b {
  border: 0.13333vw solid black;
  margin-bottom: 0.13333vw;
  font-size: 2.66667vw;
  line-height: 4vw;
}

@media (min-width: 100vw) {
  .c {
    font-size: 2.13333vw;
    line-height: 2.93333vw;
  }
}
```

## Usage

Default Options:

```js
{
  viewportWidth: 750,
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',
  unitPrecision: 5,
}
```

- `viewportWidth` The width of the viewport.
- `viewportUnit` Expected unit.
- `fontViewportUnit` Expected font unit.
- `unitPrecision` The decimal point is exact to several digits.

```javascript
const PostcssPluginRpxToVw = require('postcss-plugin-rpx2vw');

postcss([ PostcssPluginRpxToVw ]);
```

## Contributing
   Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for contributing.
