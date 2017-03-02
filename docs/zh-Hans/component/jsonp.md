# JSONP 支持跨域请求

## 引入

```jsx
import JSONP from 'universal-jsonp';
```

## 使用

```jsx
JSONP('http://jsfiddle.net/echo/jsonp/', {
    jsonpCallback: 'custom_callback'
  })
  .then((response) => {
    return response.json();
  })
  .then((obj) => {
    console.log('parsed obj', obj);
  })
  .catch(function(err) {
    console.log('parsing failed', err);
  });
```
