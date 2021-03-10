# rax-jsx-runtime

This module is adapted to react's jsx-runtime module. For more information, please see：[introducing-the-new-jsx-transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.htm)

## Installation
npm install rax-jsx-runtime

## Usage
An example Babel configuration look like:

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "rax-jsx-runtime"
      }
    ]
  ]
}
```
