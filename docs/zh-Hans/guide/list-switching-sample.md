# Tab 长列表切换

![](https://gw.alicdn.com/tps/TB1ZNSJOVXXXXXMXpXXXXXXXXXX-716-352.png)

## 主要组件介绍

* rax-slider 水平滚动轮播
* listview 页面列表方案

## 核心实现思路

**tab切换**

* 当进行页面切换操作时，tabheader 未单纯页面跳转功能
* 当实现单页应用时，tabheader 可以作为框架切换导航
* 如果要实现导航下方列表的水平滑动切换动画效果，tabheader 作为控制器来控制多 滚动容器的水平移移动动画 

**listview**

* 两列长列表为了便于布局与组织，推荐使用 listview
* 此时 listview 作为页面级的滚动容器存在
* listview 的 header 部分可以用来做列表的个性化页头，也可以用来实现下拉刷新效果
* 列表内部两列布局可以使用 rax-grid 来实现
* 列表底部提供 footer 块，可以用来实现页脚 loading 或者页脚自定义模块
* listview 列表滚动到页面最下方时会出发 endReached 事件，用来实现滚动加载更多的需求
