---
title: Rax 0.3 发布
date: 20170528
author: 亚城
---

# Rax 0.3 发布

![Rax 0.3](https://img.alicdn.com/tfs/TB1CVaVRpXXXXcnXFXXXXXXXXXX-817-460.jpg)

2017年5月底 Rax 发布 0.3 版本。伴着初夏，我们看看都有哪些新东西。

## 一些数据

经过近一个多月的稳步发展，Rax 体系上积累了一些新的尝试。

* 1377 commits
* 199 pull requests
* 70 issues
* 2910 stars

## framework

新增支持 API，进一步向 W3C 标准同步

* location
  * assign
  * replace
  * reload
* navigator.userAgent
* WebSocket

## 重复检测

检测项目里的 Rax 重复打包情况

![](https://img.alicdn.com/tfs/TB1SD1BRpXXXXchaXXXXXXXXXXX-590-71.png)

## 组件生态

基础组件体系的扩充

**rax-canvas**

* Weex 下基于 gcanvas
* Web 下基于 canvas
* 目标：兼容 w3c 下所有的 api

**rax-charts**

* 基于 rax-canvas 和 g2-mobile
* 简单的图表需求
* 手淘版本：安卓 6.7.4+ 和 ios 6.6.0+

![](https://img.alicdn.com/tfs/TB1czOLRpXXXXcbXVXXXXXXXXXX-842-461.jpg)

**rax-qrcode & rax-barcode**

* 基于 rax-canvas
* 通过文本生成条形码以及二维码
* 支持常见条码格式 ( CODE39 CODE128 等 )
* 支持部分样式自定义

```
import {createElement, Component, render} from 'rax';
import {View} from 'rax-components';

import QRCode from 'rax-qrcode';
import BarCode from 'rax-barcode'

class Demo extends Component {
  constructor() {
    super();
    this.state = {
      data: 'Example 1234'
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <QRCode
          data={'1234567890'}
          options={{
            typeNumber: -1,
            errorCorrectLevel: QRCode.ErrorCorrectLevel.H
          }}
        />
        <BarCode
          data={'123456789'}
          options={{
            fillColor: 'red'
          }}
        />
      </View>
    );
  }
}

render(<Demo />);
```

![](https://img.alicdn.com/tfs/TB1UbyWRpXXXXbPXFXXXXXXXXXX-277-432.jpg_320x320.jpg)

**rax-picker & rax-datepicker & rax-timepicker**

唤起客户端原生的时间选择与日期选择，Web 上使用原生 select 或 input 实现。

![](https://img.alicdn.com/tfs/TB1TlGwRpXXXXXWapXXXXXXXXXX-812-378.jpg)

**rax-checkbox & rax-counter**

![](https://img.alicdn.com/tfs/TB1hEm7RpXXXXXeXpXXXXXXXXXX-789-259.jpg)

**电商类 UI 区块抽象**

常用业务 UI 区块的沉淀

![](https://img.alicdn.com/tfs/TB1DjWNRpXXXXbcXVXXXXXXXXXX-815-364.jpg)
![](https://img.alicdn.com/tfs/TB1FEK7RpXXXXaUXpXXXXXXXXXX-842-349.jpg)
![](https://img.alicdn.com/tfs/TB1wIe2RpXXXXc8XpXXXXXXXXXX-822-458.jpg)

## webgl driver

**Rax Driver**

* 抽象 View 层的实现
* 提供跨容器支持能力
* 标准的统一的 API ( createElement replaceChild setAttribute …)

**WebGL Driver**

* 与 Rax 结合的 driver 层
* 基于 three.js
* 提高 3D 开发的效率和体验

```
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  camera.position.z = 5;

  var render = function () {
    requestAnimationFrame( render );
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
  };
  render();
```

```
  <scene
    width={this.width}
    height={this.height}
    onAfterRender={this.onAfterRender}
  >
    <perspective-camera
      fov={75}
      aspect={this.width / this.height}
      near={0.1}
      far={1000}
      position={this.cameraPosition}
    />
    <mesh
      rotation={this.state.cubeRotation}
    >
      <box-geometry
        width={1}
        height={1}
        depth={1}
      />
      <mesh-basic-material
        color={0x00ff00}
      />
    </mesh>
  </scene>
```

![](https://img.alicdn.com/tfs/TB1vXqARpXXXXcvaXXXXXXXXXXX-666-255.jpg)

![](https://img.alicdn.com/tfs/TB1b91pRpXXXXXMaFXXXXXXXXXX-697-320.jpg)

## rax 工具包

rax-cli & rax-scripts

* rax init 初始化项目
* rax-scripts start 启动调试
* rax-scripts build 构建项目

特性

* Hot reload 热加载功能
* 兼容旧项目，无缝迁移

![](https://img.alicdn.com/tfs/TB1DNWTRpXXXXXZXVXXXXXXXXXX-865-452.jpg)



Rax 0.4，欲知后事如何，尽情期待