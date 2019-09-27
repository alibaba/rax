# Image 图片

基础类型的图片实现，这里的 Image 组件只提供了基础的图片展示，更好的显示图片可以使用 Picture 组件。 

（针对 gif 图片的显示依赖客户端的图片库，手淘环境可以在 attribute 和 style 上设置 quality='original' 解决）

![](https://gw.alicdn.com/tfs/TB1KqzRRVXXXXasaXXXXXXXXXXX-255-367.gif)

## 安装

```bash
$ npm install rax-image --save
```

## 引用

```jsx
import Image from 'rax-image';
```

## 属性

| 名称         | 类型     | 默认值  | 描述                           |
| :--------- | :----- | :--- | :--------------------------- |
| source     | Object | ''   | 设置图片的 uri                    |
| style      | Object | ''   | 样式 图片不设置宽高则默认为0x0            |
| resizeMode | String | ''   | 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小 |

同时支持任意自定义属性的透传。  

其中 resizeMode 支持的值包括：contain、cover、stretch、center、repeat。

## 本地图片示例
在使用前请先检查 webpack.config.js 中已经启用了 image-source-loader

```jsx 
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image source={require('./path/to/your/image.png')}
        resizeMode="cover"
      />
    );
  }
}

render(<App />);
```

## URL 图片示例

```jsx
// demo

import {createElement, render, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

let image = {
  uri: 'https://camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067'
};

let image2 = {
  uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'
};

let base64Image = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
};

let gifImage = {
  uri: 'http://storage.slide.news.sina.com.cn/slidenews/77_ori/2016_34/74766_703038_567223.gif'
};

class App extends Component {
  render() {
    return (
      <View style={styles.root}>

        <View style={styles.container}>
          <Text>GIF</Text>

          <Image
            style={styles.gif}
            source={gifImage}
          />

        </View>

        <View style={styles.container}>
          <Text>圆角</Text>

          <Image source={image2} style={[styles.base, {
            borderRadius: 200
          }]}
          />

        </View>

        <View style={styles.container}>
          <Text>内部包含子元素</Text>

          <Image source={image} style={[styles.base]}>
            <Text style={styles.nestedText}>Rax</Text>
          </Image>

        </View>

        <View style={styles.container}>
          <Text>Resize Mode</Text>

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.contain}
            source={image}
          />

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.cover}
            source={image}
          />

          <Image
            style={styles.resizeMode}
            resizeMode={Image.resizeMode.stretch}
            source={image}
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
  base: {
    width: 100,
    height: 100,
  },
  resizeMode: {
    width: 100,
    height: 60,
    borderWidth: 1,
    margin: 10,
    borderColor: 'black'
  },
  gif: {
    height: 200,
    width: 350
  },
  nestedText: {
    marginLeft: 36,
    marginTop: 36,
    color: 'black'
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 40,
    backgroundColor: 'rgba(33,33,33,0.5)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  maskTitle: {
    color: 'white',
    paddingTop: 6,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center'
  }
};

render(<App />);
```
