# 网络请求

Rax 支持 HTTP、JSONP 等多种网络请求方式，Rax 实现了 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，并推荐使用 fetch 来发起异步网络请求。



### 关于 Fetch

Fetch 提供了获取资源的统一接口，通过定义 `request` 和 `response` 对象，将资源获取抽象成发送资源请求和获取资源响应两步，统一并简化了资源获取过程。具体特性和能力可详阅 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。Fetch 目前是'现实标准'，虽然浏览器的原生支持并不是很好，但可以借助 polyfill 在不支持的浏览器中使用。

Rax Framework 提供了全局变量 fetch。



### HTTP 请求

##### Fetch API

```xml
Promise <Response> fetch(url[, options]);
```

**options 参数**

- method(String)：资源请求方法('GET'|'POST')
- headers(Object): 请求头
- body(String)：请求体
- dataType(String)：资源类型（仅在weex下支持，包括json和text两种）
- mode(String)：请求模式（cors, no-cors, same-origin 和 jsonp）



##### 实例：

```jsx
fetch('./api.json', {
    mode: 'same-origin',
    dataType: 'json',
    method: 'GET'
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    // handle exception
  });
```



### JSONP

请确保已经在项目中安装 [`universal-jsonp`](https://www.npmjs.com/package/universal-jsonp) 模块，否则请在终端执行：

```bash
$ npm install universal-jsonp --save
```



##### 实例：

```jsx
import jsonp from 'universal-jsonp';

jsonp('http://domain.com/jsonp', { jsonpCallbackFunctionName: 'callback' })
  .then((response) => {
    return response.json();
  })
  .then((obj) => {
    console.log(obj);
  })
  .catch((err) => {
    // handle exception
  });
```



### 参考

-  [fetch 标准规范](https://fetch.spec.whatwg.org/)