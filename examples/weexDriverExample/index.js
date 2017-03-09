import {createElement, Component, render} from 'rax';
import {Text, View} from 'rax-components';
import {isWeex} from 'universal-env';
import weexRaxDriver from 'weex-rax-driver';

class Example extends Component {
  render() {
    return (
      <div>
        <p>Hello</p>
        <img width="560" height="560" src="https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg" />
        <a href="https://m.taobao.com">
          click
        </a>
        <textarea rows="10">哈哈哈</textarea>
        <video width="630" height="350" autoplay controls src="http://flv2.bn.netease.com/videolib3/1611/01/XGqSL5981/SD/XGqSL5981-mobile.mp4" />
      </div>
    );
  }
}

render(<Example />, null, isWeex ? weexRaxDriver : null);
