# 电梯长列表

![](https://gw.alicdn.com/tps/TB1499MOVXXXXcIXXXXXXXXXXXX-641-436.png)

## 主要组件介绍

* rax-slider 水平滚动轮播
* rax-tabheader 带下拉的 tab 切换，包含下拉筛选功能（用于实现电梯）
* rax-gotop 浮动的返回顶部
* listview 页面列表方案

## 核心实现思路

**电梯定位**

* 电梯是大促活动中常用的页面楼层跳转方式，这里推荐的方式是使用 tabheader 实现楼层电梯，h5 利用矛点定位楼层，weex 上使用 `Dom.scrollToElement` 仅页面位置的定位。页面定位的时候需要注意的是需要给跳转的目标节点添加唯一的 id。

**吸顶元素**

* h5 滚动容器上有默认的 `webkitOverflowScrolling = 'touch'`，所以会有吸顶元素滚动跟随的问题，此时 h5 上的处理逻辑可以在吸顶的时机讲 tabheader 复制到滚动容器外部。
* 在设置 tabheader 的吸顶行为时，在 `list` 内部 weex 下可以使用 header 标签。如果在 scrollview 容器内部，利用 tabheader 的 appear 触发时机进行吸顶设置

**列表的实现**

* 长列表的实现可以使用 rax-componets 提供的 ListView，当在 ScrillView 内部使用 ListView 时，可以通过 rax-flowview 进行内部列表容器的替换，避免出现双滚动条
* 长列表的另一种实现是在 list 内部。此时页面滚动容器是 RecyclerView 的情况下，为了达到列表更好的性能，不推荐使用 ListView，而是每行数据使用单独的 cell 进行包裹（搭建平台使用该方案）
