# babel-plugin-flatten-jsx-children

> Flatten children when transforming JSX elements.

## Installation

```sh
npm install --save-dev babel-plugin-flatten-jsx-children
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["flatten-jsx-children"]
}
```

## Example

```JSX
<div>
  <div>a</div>
  <div>b</div>
</div>
```

### Before

```js
createElement("div", null, createElement("div", null, "a"), createElement("div", null, "b"));
```

### After

```js
createElement("div", null, [
  createElement("div", null, "a"), 
  createElement("div", null, "b")
]);
```