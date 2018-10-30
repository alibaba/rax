/* global Component */
/* eslint-disable new-cap */
Component({
  data: { x: 1 }, // 组件内部数据
  props: { y: 1 }, // 可给外部传入的属性添加默认值
  didMount() {
    this.setData({
      x: 2
    });
  }, // 生命周期函数
  didUpdate() { },
  didUnmount() { },
  methods: { // 自定义事件
    handleTap() {
      this.setData({ x: this.data.x + 1 }); // 可使用 setData 改变内部属性
    },
  },
});
