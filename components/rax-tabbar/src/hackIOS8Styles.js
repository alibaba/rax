import isIOS8Web from './isIOS8Web';
import separateStyle from './separateStyle';

const ISIOS8WEB = isIOS8Web();

export default {
  getScrollViewStyle() {
    if (ISIOS8WEB) {
      return {
        display: 'inline-block',
        width: 750,
        overflow: 'scroll',
        whiteSpace: 'nowrap'
      };
    } else {
      return {};
    }
  },
  getScrollViewItemStyle(props, boxStyle) {
    if (ISIOS8WEB) {
      let styles = {
        display: 'inline-block',
        whiteSpace: 'normal'
      };

      try {
        styles.paddingTop = (boxStyle.height - props.iconStyle.height - separateStyle(boxStyle, 'text').fontSize) / 2;
      } catch (e) {
        styles.paddingTop = 20;
      }
      return styles;
    } else {
      return {};
    }
  }
};