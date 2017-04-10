import {isWeex} from 'universal-env';

export default {
  initWebStyle: () => {
    if (!isWeex && typeof document !== 'undefined') {
      if (!document.getElementById('rxtabheaderstyle')) {
        var node = document.createElement('style'),
          str = 'html{-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}';
        node.innerHTML = str;
        node.id = 'rxtabheaderstyle';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  },
};