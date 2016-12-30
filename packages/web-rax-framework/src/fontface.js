/*
* FOR USE
* API:
* FontFace('iconfont', '//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf');
* ELEMENT:
* <Text style={{fontFamily: 'iconfont'}}>{'\uE601'}</Text>
*/
const FontFace = (family, source) => {
  let tagTemplate = `@font-face{
    font-family: ${family};
    src: url('${source}')
  }`;
  const existTag = document.getElementById(family);
  if (existTag) {
    return;
  }

  let styleTag = document.createElement('style');
  styleTag.id = family;
  styleTag.innerHTML = tagTemplate;
  document.getElementsByTagName('head')[0].appendChild(styleTag);
};

export default FontFace;