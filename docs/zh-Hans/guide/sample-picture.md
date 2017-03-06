
# 大图横向浏览

![](https://gw.alicdn.com/tps/TB1kN1FOVXXXXbJXpXXXXXXXXXX-598-360.png)

## 主要组件介绍

* rax-slider 横向滚动大图与 tabheader 联动
* rax-tabheader 横向滑动导航与 slider 联动

## 核心实现思路

**tab切换**

* 在底部 tabheader 点击时调用 slider 的 slideTo 方法可以切换到指定位置
* slider 切换过程中，调用 tabheader 的 select 方法实现与底部 tab 的联动切换
* 两个组件的相互配合的情况可以有更多的应用场景，比如轮播图切换时间轴，轮播图与部分业务模块的联动切换等