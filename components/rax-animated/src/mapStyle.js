// { scale: 2 } => 'scale(2)'
function mapTransform(t) {
  var k = Object.keys(t)[0];
  var unit = '';
  // Only process translateX translateY translateZ
  if (k.indexOf('translate') === 0) {
    unit = 'rem';
  }
  return `${k}(${t[k]}${unit})`;
}

// NOTE(lmr):
// Since this is a hot code path, right now this is mutative...
// As far as I can tell, this shouldn't cause any unexpected behavior.
function mapStyle(style) {
  if (style && style.transform && typeof style.transform !== 'string') {
    // Use vendor prefixed styles
    let convertedValue = style.transform.map(mapTransform).join(' ');
    style.webkitTransform = convertedValue;
    style.transform = convertedValue;
  }

  return style;
}

export default mapStyle;
