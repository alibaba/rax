'use strict';

import {createElement, Component, findDOMNode} from 'rax';
import Layer from './layer';
import View from 'rax-view';
import {isWeex} from 'universal-env';
import binding from 'weex-bindingx';

function getEl(el) {
  return isWeex ? findDOMNode(el).ref : findDOMNode(el);
}


class GyroscopeParallax extends Component {
  windowHeight = 0;
  windowWidth = 0;

  static defaultProps = {
    elementWidth: null,
    elementHeight: null,
    limitX: false,
    limitY: false,
    invertX: true,
    invertY: true,
    windowHeight: 0,
    windowWidth: 0
  };

  state = {}


  updateBounds() {
    this.elementWidth = this.props.elementWidth || this.props.style.width || 750;
    this.elementHeight = this.props.elementHeight || this.props.style.height || 200;
  }

  getWindowSize() {
    if (isWeex) {
      let dom = require('@weex-module/dom');
      dom.getComponentRect('viewport', (e) => {
        if (e.result && e.size && e.size.width && e.size.height) {
          this.windowWidth = e.size.width;
          this.windowHeight = e.size.height;
        }
      });
    } else {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  formatPropsToExpression(props) {
    let result = [];
    if (!props) return result;
    let {depthX = 0, depthY = 0, limitX, limitY, invertX, invertY} = props;
    if (depthX > 0) {
      limitX = limitX || depthX * 150;
      result.push({
        property: 'transform.translateX',
        expression: `min(abs(x) * ${depthX},${limitX}) * (x/max(abs(x),0.001))*${invertX ? '(0-1)' : '1'}`
      });
    }

    if (depthY > 0) {
      limitY = limitY || depthY * 150;
      result.push({
        property: 'transform.translateY',
        expression: `min(abs(y) * ${depthY},${limitY}) * (y/max(abs(y),0.001))*${invertY ? '(0-1)' : '1'}`
      });
    }
    return result;
  }

  genBindingProps() {
    let props = [];
    let index = 0;
    this.props.children.forEach((child) => {
      if (child.type === Layer) {
        let childProps = child.props;
        let element = this.refs['layer_' + index];
        let expressions = this.formatPropsToExpression(childProps);
        expressions.forEach((expression) => {
          props.push({
            element: getEl(element),
            property: expression.property,
            expression: {
              origin: expression.expression
            }
          });
        });
      }
      index++;
    });
    return props;
  }

  bindExp() {
    let props = this.genBindingProps();
    let res = binding.bind({
      eventType: 'orientation',
      options: {
        sceneType: '2d'
      },
      props: props
    }, () => {
    });
    this.token = res && res.token;
  }


  componentDidMount() {
    this.getWindowSize();
    this.updateBounds();
    if (this.props.children && !(this.props.children instanceof Array)) {
      this.props.children = [this.props.children];
    }

    setTimeout(() => {
      this.bindExp();
    }, 200);
  }

  start = () => this.bindExp()

  stop = () => {
    this.token && binding.unbind({
      token: this.token,
      eventType: 'orientation'
    });
  }

  render() {
    if (this.props.children && !(this.props.children instanceof Array)) {
      this.props.children = [this.props.children];
    }
    let children = this.props.children.map((child, index) => {
      if (child.type === Layer) {
        return <Layer {...child.props} ref={`layer_${index}`} />;
      } else {
        return child;
      }
    });

    return (<View style={{...this.props.style}}>
      {children}
    </View>);

    return (
      <View style={{...this.props.style}}>
        {children.map((child, i) => {
          return (<View key={i} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
            ref={`l${i}`}>{child}</View>);
        })}
      </View>
    );
  }
}

GyroscopeParallax.Layer = Layer;

export default GyroscopeParallax;


