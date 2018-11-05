---
title: Rax 0.6 发布
date: 20180508
author: 亚城
---

# Rax 0.6 发布

## 一些数据

本数据截止 2017 年 4 月，Rax 在 Weex 层提供了更好的运行环境隔离机制、在 binding、canvas 等体验组建上有了进一步的突破

* 1806 commits
* 283 pull requests
* 98 issues
* 4265 stars

## 体验组件升级 

### rax-tab-panel

 可横向滑动的面板

### rax-parallax

Parallax 滚动视差动画。
用于呈现滚动视差效果: 随着用户滚动页面，一些组件会随着滚动产生动画视差效果，如放大/缩小、位移、背景色/透明度/模糊渐变等

![](//ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/5cba5521d6192d3415b016e946d6d21c.gif)

### rax-canvas

升级 gcanvas 提供更好的画布能力，图表相关组件也全面升级

## Weex Framework Sandbox 升级

提供更好的隔离环境，每个页面之间不会相互影响。旧版本全局共享同一个 window 对象运行环境，新版本从执行时机上进行了优化。保证页面间不会影响

## 核心库 changelog

* rax
  * test: add createContext test
  * feat: add createPortal and createContext
* universal-asyncstorage
  * feat: add asyncstorage
* element-loader
  * test: rework rax webpack plugin tests
  * docs: fix some element loader typo
* rax-picture
  * 添加forceupdate判断
* rax-scripts
  * chore: update rax-scripts to webpack v4
* rax-button
  * feat: add a11y role to button and checkbox
* rax-modal
  * feat: add maskCanBeClick for modal & anim by universal-transition
* weex-rax-framework
  * feat: rewrite weex framework
  * fix: bundleUrl in jsfm
* weex-rax-framework-api
  * feat: add framework api
  * test: for weex-rax-framework-api
  * fix: remove .gitignore & build in framework-api
  * feat: rewrite framework api
* universal-transition
  * fix: make sure node.ref existence in weex
  * feat: add needLayout
  * feat: add maskCanBeClick for modal & anim by universal-transition
* rax-waterfall
  * feat: set sync & append for cell
* rax-text
  * fix: rax text default style use pre-wrap in web
* rax-icon
  * fix: icon load FontFace in componentWillMount & update snapshots
* rax-canvas
  * fix: rax canvas use gcanvas.js
* babel-plugin-transform-jsx-stylesheet
  * feat: support array, object and expressions
* babel-preset-rax
  * chore: update name to BABEL_ADD_MODULE_EXPORTS
* rax-tab-panel
  * fix: fix panend trigger render
  * refactor: add rax-tab-panel deps
  * refactor: remove relative import in demo
  * refactor: add use strict
  * feat: add rax-tab-panel component
* rax-parallax
  * feat: add rax-parallax component
  * refactor: add demo for parallax
  * refactor: change comment to english
  * refactor: format code
* driver-server
  * fix doc of driver-server
  * fix doc of driver-server
* driver-browser
  * perf: const textContext attr
* universal-env
  * fix: use typeof WXEnvironment for Vue Weex
  * fix: universal-env isWeex use: typeof WXEnvironment & test for modal
* scripts/dist.js
  * fix: use webpack uglifyjs plugin 1.1.4
* rax-picture
  * 添加forceupdate判断
  * 增加placeholder的使用注意事项
* rax-scrollview
  * rax-scrollview in nodejs env will throw document is undefined
  * Remove the duplicate statement
  * refactor: move animation-utils package to inside
  * chore: var to const
  * fix: update animation-util






