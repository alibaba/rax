# weex-rax-framework-api

## Global API Rax Framework provide

* `window`
  * devicePixelRatio
  * open()
  * postMessage()
  * addEventListener()
  * removeEventListener()
* `document`
  * fonts
    * add
* `navigator`
  * platform
  * product
  * appName
  * appVersion
* `screen`
  * width
  * height
  * availWidth
  * availHeight
  * colorDepth
  * pixelDepth
* `location`
  * hash
  * search
  * pathname
  * port
  * hostname
  * host
  * protocol
  * origin
  * href
* [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
* `FontFace`
  ```js
  var bitterFontFace = new FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
  document.fonts.add(bitterFontFace);

  var oxygenFontFace = new FontFace('Oxygen', 'url(https://fonts.gstatic.com/s/oxygen/v5/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)');
  document.fonts.add(oxygenFontFace);
  ```
* [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
  * href
  * origin
  * searchParams
  * toString()
* [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
  * append()
  * delete()
  * entries()
  * get()
  * getAll()
  * has()
  * keys()
  * set()
  * values()
  * toString()
* `alert`
* `define`
* `require`
* `__weex_downgrade__`
* `__weex_env__`
* `__weex_define__`
* `__weex_require__`
