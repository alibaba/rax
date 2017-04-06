import {createElement, Component} from 'rax';
export default class Global extends Component {
  constructor(props) {
    super(props);
    const {
      GMObject,
      sizes,
      scales,
      widthRatio,
      animateReduceMultiple,
      defaultFont,
      pixelRatio = 2, // 无线上清晰一些，默认设置为 2
      margin,
      colors,
      axis
    } = props;
    const GMGlobal = GMObject.Global;
    if (sizes) {
      GMGlobal.sizes = sizes;
    }

    if (scales) {
      GMGlobal.scales = scales;
    }

    if (widthRatio) {
      GMGlobal.widthRatio = widthRatio;
    }

    if (animateReduceMultiple) {
      GMGlobal.animateReduceMultiple = animateReduceMultiple;
    }

    if (defaultFont) {
      GMGlobal.defaultFont = defaultFont;
    }

    if (pixelRatio) {
      GMGlobal.pixelRatio = pixelRatio;
    }

    if (margin) {
      GMGlobal.margin = margin;
    }

    if (colors) {
      GMGlobal.colors = colors;
    }

    if (axis) {
      GMGlobal.axis = axis;
    }
  }
}
