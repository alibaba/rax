'use strict';

import {createElement, Component, render, setNativeProps, findDOMNode} from 'rax';
import View from 'rax-view';
import {isWeex} from 'universal-env';
import bindingx from 'weex-bindingx';

// findDOMNode has difference between weex an web
function getEl(el) {
  if (typeof el === 'string' || typeof el === 'number') return el;
  return isWeex ? findDOMNode(el).ref : findDOMNode(el);
}

// judge bindingx support
const isSupportBinding = !!bindingx.isSupportBinding;


/*
{
          type: 'translate',
          in: [0, 660],
          out: [0, 0, 0, -660] // [x1,y1,x2,y2]
        }

        {
          expression:'y',
          property:'transform.translate'
        }
 */


function transformRangeToExpression(params = {}, propertyType) {
  let input = params.in;
  let output = params.out;
  let result = [];

  // 处理负数
  function negative(val) {
    return val < 0 ? `${Math.abs(val)}*(0-1)` : `${val}`;
  }

  /*
  {out2: 1, out1: 1.3, in2: 0, in1: -150, ratio: -0.0020000000000000005}
  in1 * x + y = out1
  in2 * x + y = out2 => y = out2 - in2 * x
  in1 * x + out2 - in2 * x = out1
  x  = (out1 - out2) / (in1 - in2)
  y = out2 - in2 * (out1 - out2) / (in1 - in2)
   */

  function transformExpression(in1, in2, out1, out2) {
    let inMax = Math.max(in1, in2);
    let inMin = Math.min(in1, in2);
    let outMax = Math.max(out1, out2);
    let outMin = Math.min(out1, out2);
    let inverse = in1 > in2;
    let x = (out1 - out2) / (in1 - in2);
    let y = out2 - in2 * (out1 - out2) / (in1 - in2);
    return `min(${outMax},max(${outMin},(y>=${negative(inMin)}&&y<=${negative(inMax)})?(y*${negative(x)}+${negative(y)}):(y<${negative(inMin)}?(${negative(inverse ? out2 : out1)}):(${negative(inverse ? out1 : out2)}))))`;
  }


  switch (propertyType) {
    case 'transform':
      if (params.type == 'translate' || params.type == 'scale') {
        let x1 = output[0];
        let y1 = output[1];
        let x2 = output[2];
        let y2 = output[3];

        result.push({
          property: `transform.${params.type}Y`,
          expression: transformExpression(input[0], input[1], y1, y2)
        });

        result.push({
          property: `transform.${params.type}X`,
          expression: transformExpression(input[0], input[1], x1, x2)
        });
      }

      if (params.type == 'rotate') {
        result.push({
          property: `transform.${params.type}Z`,
          expression: transformExpression(input[0], input[1], output[0], output[1])
        });
      }
      break;
    case 'opacity':
      result = [{
        property: 'opacity',
        expression: transformExpression(input[0], input[1], output[0], output[1])
      }];
      break;
    case 'backgroundColor':
      result = [{
        property: 'background-color',
        expression: `evaluateColor(\'${output[0]}\',\'${output[1]}\',${transformExpression(input[0], input[1], 0, 1)})`
      }];
      break;
  }

  return result;
}


class BindingParallax extends Component {

  static defaultProps = {
    bindingScroller: null,
    extraBindingProps: null
  }


  componentDidMount() {
    let {bindingScroller, transform = [], backgroundColor, opacity, extraBindingProps = []} = this.props;
    let parallax = getEl(this.refs.parallax);
    let bindingProps = [];
    transform.forEach((trans) => {
      let res = transformRangeToExpression(trans, 'transform');
      res.forEach((r) => {
        bindingProps.push({
          element: parallax,
          property: r.property,
          expression: r.expression,
          config: {
            transformOrigin: 'center'
          }
        });
      });
    });

    if (backgroundColor) {
      let res = transformRangeToExpression(backgroundColor, 'backgroundColor');
      res.forEach((r) => {
        bindingProps.push({
          element: parallax,
          property: r.property,
          expression: r.expression
        });
      });
    }

    if (opacity) {
      let res = transformRangeToExpression(opacity, 'opacity');
      res.forEach((r) => {
        bindingProps.push({
          element: parallax,
          property: r.property,
          expression: r.expression
        });
      });
    }

    if (extraBindingProps && extraBindingProps.length) {
      extraBindingProps.forEach((prop) => {
        prop.element = getEl(prop.element);
      });
    }
    bindingx.bind({
      anchor: bindingScroller,
      eventType: 'scroll',
      props: extraBindingProps && extraBindingProps.length ? [...bindingProps, ...extraBindingProps] : bindingProps
    });
  }

  render() {
    return <View ref="parallax" style={{...this.props.style}}>{this.props.children}</View>;
  }

}

class Parallax extends Component {


  static defaultProps = {
    bindingScroller: null
  }


  render() {
    let {bindingScroller} = this.props;
    if (!bindingScroller) return null;

    let scroller = isWeex ? findDOMNode(bindingScroller).ref : findDOMNode(bindingScroller);
    if (isSupportBinding || !isWeex) {
      return <BindingParallax {...this.props} bindingScroller={scroller} />;
    }

    return isWeex ? <parallax {...this.props} bindingScroller={scroller} /> :
      <View {...this.props} />;
  }
}


export default Parallax;