# Countdown 倒计时

倒计时组件，可设置倒计时毫秒数，以及展现的模板。

![](https://gw.alicdn.com/tfs/TB1OdDNRVXXXXXeapXXXXXXXXXX-255-201.gif)

## 安装

```bash
$ npm install rax-countdown --save
```

## 引用

```jsx
import Countdown from 'rax-countdown';
```

## 属性

| 名称                | 类型     | 默认值              |  描述                                    | Required |
| :------------------ | :------- | :------------------- | :--------------------------------------- | :------- |
| timeRemaining       | Number   | /                    | 倒计时剩余时间,单位为"毫秒"                          | Yes      |
| interval            | Number   | 1000                 | 倒计时的间隔,单位为"毫秒"                           | No       |
| tpl                 | String   | {d}天{h}时{m}分{s}秒{ms} | 倒计时展示模板,默认为'{d}天{h}时{m}分{s}秒'            | No       |
| formatFunc          | Function | /                    | 自定义格式化剩余时间的方法,非`undefined`时tpl失效,处理剩余时间的展示 | No       |
| onTick              | Function | /                    | 倒计时变化时调用的方法                              | No       |
| onComplete          | Function | /                    | 倒计时完成时调用的方法                              | No       |
| timeStyle           | Object   | /                    | 时间-数字的样式                                 | No       |
| secondStyle         | Object   | /                    | 秒最后一位样式                                  | No       |
| textStyle           | Object   | /                    | 时间-单位的样式                                 | No       |
| timeWrapStyle       | Object   | /                    | 各时间区块的样式                                 | No       |
| timeBackground      | Object   | /                    | 各时间区块背景(可加背景图)                           | No       |
| timeBackgroundStyle | Object   | /                    | 各时间区块背景样式                                | No       |

## 基本示例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import View from 'rax-view';
import Countdown from 'rax-countdown';

class App extends Component {
  onComplete() {
    console.log('countdown complete');
  }
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <Countdown
            timeRemaining={100000}
            tpl={'{d}天{h}时{m}分{s}秒'}
            onComplete={this.onComplete}
          />
        </View>
        <View style={styles.container}>
          <Countdown
            timeRemaining={100000000}
            timeStyle={{
              'color': '#007457',
              'backgroundColor': 'red',
              'marginLeft': '2rem',
              'marginRight': '2rem'
            }}
            secondStyle={{'backgroundColor': 'yellow'}}
            textStyle={{'backgroundColor': 'blue'}}
            tpl={'{d}-{h}-{m}-{s}'}
            onComplete={this.onComplete}
          />
        </View>
        <View style={styles.container}>
          <Countdown
            timeRemaining={500000}
            tpl="{h}:{m}:{s}"
            timeStyle={{
              color: '#ffffff',
              fontSize: 40,
            }}
            secondStyle={{
              color: '#ffffff',
              fontSize: 40,
            }}
            timeWrapStyle={{
              borderRadius: 6,
              width: 50,
              height: 60,
              backgroundColor: '#333333',
            }}
           />
        </View>
      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
};

render(<App />);
```

