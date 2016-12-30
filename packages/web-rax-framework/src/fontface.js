const SUPPORTS_ORIGIN_FONT_LOADING = !!document['fonts'];

function FontFace(family, source) {
  this.family = family;
  this.source = source;
  if (!SUPPORTS_ORIGIN_FONT_LOADING) {
    document.fonts = {
      add: function(fontFace) {
        FontFaceHelper(fontFace.family, fontFace.source);
      }
    }
  }
}

const FontFaceHelper = (family, source) => {
  let tagTemplate = `@font-face{
    font-family: ${family};
    src: ${source}
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

export default window.FontFace ? window.FontFace : FontFace;
