# GyroscopeParallax  陀螺仪视差动画

![动画](https://img.alicdn.com/tfs/TB1F_f_ogoQMeJjy0FoXXcShVXa-320-569.gif)

## 安装

```bash
$ npm install rax-gyroscope-parallax --save
```

## 引用

```jsx
import GyroscopeParallax from 'rax-gyroscope-parallax';
```





## API说明

### 容器(GyroscopeParallax)属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onRotate|/|beta、gamma发生旋转时触发|
|onOrientationChange|/|alpha、beta、gamma旋转时触发,即原生deviceorientation事件透出|



### 层(Layer)属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|depthX|String|0|水平偏移量比率，值越大速度越快|
|depthY|String|0|垂直偏移量比率，值越大速度越快|
|limitX|String|Number|水平最大偏移量限制|
|limitY|String|Number|垂直最大偏移量限制|
|invertX|Boolean|false|是否水平方向反向
|invertY|Boolean|false|是否垂直方向反向

#### 方法

- start() 开始动画
- stop() 停止动画








## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import GyroscopeParallax from 'rax-gyroscope-parallax';
import Picture from 'rax-picture';


const styles = {
  container: {
    width: 750,
    position:'absolute',
    bottom:0,
    top:0
  },
  logo:{
    position:'absolute',
    top:400
  },
  rope1:{
    position:'absolute',
    width: 750,
    height: 50,
    left: 0,
    top: 160
  },
  rope2:{
    position:'absolute',
    width: 750,
    height: 50,
    left: 0,
    top: 260
  },
  block1: {
    width: 200,
    height: 200,
    left: 275,
    top: 200,
    position:'absolute'
  },
  block2: {
    width: 100,
    height: 100,
    left: 500,
    top: 190,
    position:'absolute',

  },
  block3: {
    width: 80,
    height: 80,
    left: 180,
    top: 290,
    position:'absolute',
  },
  block4:{
    width: 220,
    height: 220,
    left: 480,
    top: 280,
    position:'absolute'
  },
  birds:{
    width:120,
    height:120,
    left:100,
    top:180,
    position:'absolute'
  },
  lighthouse:{
    width:300,
    height:450,
    left:400,
    bottom:160,
    position:'absolute'
  },
  wave0:{
    width:750,
    height:120,
    bottom:140
  },
  wave1:{
    width:750,
    height:150,
    bottom:80
  },
  wave2:{
    width:750,
    height:200,
    bottom:10
  },
  wave3:{
    width:750,
    height:200,
    bottom:-80
  },
  bg: {
    width: 1500,
    height: 800,
    backgroundColor: '#f60',
    flexDirection: 'row',
    position: 'absolute',
    left: -375,
    top: 0
  }
};


const images = {
  background: '//img.alicdn.com/tfs/TB1GW.3XGagSKJjy0FgXXcRqFXa-2080-1100.png',
  cloud: '//img.alicdn.com/tfs/TB1_DqdXfxNTKJjy0FjXXX6yVXa-280-280.png',
  cloud2: '//img.alicdn.com/tfs/TB1qLI3XGagSKJjy0FgXXcRqFXa-280-280.png',
  birds: '//img.alicdn.com/tfs/TB1OUI0XGagSKJjy0FbXXa.mVXa-280-280.png',
  rope: '//img.alicdn.com/tfs/TB1YRI3XGigSKJjSsppXXabnpXa-1600-200.png',
  lighthouse: '//img.alicdn.com/tfs/TB1YBucd3MPMeJjy1XdXXasrXXa-320-560.png',
  wave: '//img.alicdn.com/tfs/TB1Rmmcd3MPMeJjy1XdXXasrXXa-800-320.png'
};

class Demo extends Component {


  componentDidMount() {
    setInterval(() => {
      this.setState({text: Date.now()});
    }, 100);
  }


  render() {
    return (
      [<Picture  resizeMode="cover" source={{uri:images.background}} style={{width:750,height:2000,position:'absolute',bottom:0,top:0}}/>,
      <GyroscopeParallax onRotate={this.onRotate}
        calibrationThreshold={50}
        style={styles.container}>
        <GyroscopeParallax.Layer depthX={1} depthY={2} style={styles.rope1}>
          <Picture resizeMode="cover" style={{width:750,height:50}} source={{uri:images.rope}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1} depthY={3} style={styles.rope2}>
          <Picture resizeMode="cover" style={{width:750,height:50}} source={{uri:images.rope}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1} depthY={2} style={styles.birds}>
          <Picture resizeMode="cover" style={{width:200,height:200,marginLeft:-60}} source={{uri:images.birds}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.8} depthY={2} style={styles.block1}>
          <Picture style={{width:200,height:200}} source={{uri:images.cloud}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1.4} depthY={2} style={styles.block2}>
          <Picture style={{width:100,height:100}} source={{uri:images.cloud2}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={1.6} depthY={3} style={styles.block3}>
          <Picture style={{width:80,height:80}} source={{uri:images.cloud2}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={2} depthY={3} style={styles.block4}>
          <Picture style={{width:220,height:220}} source={{uri:images.cloud}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.2} depthY={.2} style={styles.lighthouse}>
          <Picture style={{width:300,height:450}} source={{uri:images.lighthouse}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.2} depthY={.4} style={styles.wave0}>
          <Picture style={{width:1300,height:200,marginLeft:0}} source={{uri:images.wave}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.5} depthY={.6} style={styles.wave1}>
          <Picture style={{width:1500,height:200,marginLeft:-200}} source={{uri:images.wave}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.7} depthY={.8} style={styles.wave2}>
          <Picture style={{width:1500,height:200,marginLeft:0}} source={{uri:images.wave}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer depthX={.7} depthY={1} style={styles.wave3}>
          <Picture style={{width:1500,height:200,marginLeft:-200}} source={{uri:images.wave}}></Picture>
        </GyroscopeParallax.Layer>
        <GyroscopeParallax.Layer  depthX={.7} depthY={1.5} style={styles.logo}>
          <Text style={{color:'#fff',fontSize:90,textAlign:'center',width:750}}>Bin<Text style={{color:'red'}}>d</Text>ing</Text>
        </GyroscopeParallax.Layer>
      </GyroscopeParallax>
        ]

    );
  }
}

render(<Demo />);

```


## DEMO


- [灯塔](https://jsplayground.taobao.org/raxplayground/6e0dc611-3d6b-45bc-af83-ba50329a8f8e)









