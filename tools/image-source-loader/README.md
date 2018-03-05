# image source loader for webpack

A source is an object contains: base64 uri, width and height of a image. eg: `{ uri: 'data:image/png;base64, iVBxxxx...', width: 2, height: 3 }`

If your looking for a loader that simple encodes as base64 try [base64-loader](https://github.com/antelle/base64-loader)

## Installation

`npm install image-source-loader`

## Usage

``` javascript
const source = require("image-source!./1x1.png");

// source => {
//   uri: "data:image/png;base64,iVBORw0KGgoAAAANS...",
//   width: 1,
//   height: 1
// }
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## Support

See ./mimes.json for currently supported extensions/mimes.  
Create a Pull Request if you need more added.  
