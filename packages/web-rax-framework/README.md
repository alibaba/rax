# web-rax-framework

## Global API Rax Framework provide

* `document`
  * fonts
    * add


* `FontFace`
  ```js
  API:
  var iconFontFace = new FontFace('iconfont', 'url(http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf)');
  document.fonts.add(iconFontFace);

  ELEMENT:
  <Text style={{fontFamily: 'iconfont'}}>{'\uE601'}</Text>
  ```
