# Tabbar 底部导航

Tabbar 可以看作一个页面级的导航布局，包含了底部导航和切换的页面，外部不需要嵌套其它标签。

其具有两种能力：

- 能力一：可以看作一个页面级的导航布局，包含了导航条和切换的页面，外部不需要嵌套其它标签；
- 能力二：仅创建导航条模块；
- 使用差别在于是否在Tabbar.Item中添加children，具体代码参考后面实例；

## API

**Tabbar**

| 名称         | 类型          | 默认值   | 描述                                       |
| :--------- | :---------- | :---- | :--------------------------------------- |
| horizontal | Boolean     | false | 是否出现水平滚动条                                |
| fixedPlace | String      | top   | 导航条位置（可选值top, bottom)                    |
| style      | styleObject | {}    | 附加在bar上的样式，(其中backgroundImage样式做了weex兼容) |
| autoHidden | Boolean     | false | 如果tabbar在RaxEmbed中，是否由自动隐藏tabbar模块       |

**Tabbar.Item**

| 名称            | 类型           | 默认值                   | 描述                                      |
| :------------ | :----------- | :-------------------- | :-------------------------------------- |
| title         | string       | 无                     | 选中项上的文案                                 |
| style         | styleObject  | 无                     | 附加在tab上的样式（其中backgroundImage样式做了weex兼容） |
| icon          | image source | 无                     | icon图片url                               |
| selectedIcon  | image source | 无                     | tab选中状态icon的url                         |
| iconStyle     | styleObject  | {width: 48,height:48} | icon的样式                                 |
| selectedStyle | styleObject  |                       | tab选中状态icon的样式                          |
| selected      | boolean      | false                 | 是否选中                                    |
| href          | String       | 空                     | 仅weex中生效：点击当前项动作改为“打开一个页面”              |
| onPress       | Function     |                       | 选中的回调，用于处理h5中页面切换                       |

## 示例

<img src="http://img.alicdn.com/tfs/TB15eKQOXXXXXcgaXXXXXXXXXXX-372-349.gif" height = "300" alt="图片名称" align=center />

```jsx
/** @jsx createElement */
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Tabbar from 'rax-tabbar';

let base64Icon = 'data:image/png;base64..';

class TabBarExample extends Component {
  state = {
    selectedTab: 'redTab',
    notifCount: 0,
    presses: 0,
  };

  _renderContent(color, pageText, num) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  }

  render() {
    return (
      <Tabbar fixedPlace="bottom">
        <Tabbar.Item
          title="Blue Tab"
          icon={{uri: base64Icon, scale: 3}}
          selected={this.state.selectedTab === 'blueTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'blueTab',
            });
          }}>
          {this._renderContent('#414A8C', 'Blue Tab')}
        </Tabbar.Item>
        <Tabbar.Item
          title="Red Tab"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
        </Tabbar.Item>
        <Tabbar.Item
          renderAsOriginal
          title="More"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
          {this._renderContent('#21551C', 'Green Tab', this.state.presses)}
        </Tabbar.Item>
      </Tabbar>
    );
  }
}

let styles = {
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
};

render(<TabBarExample />);
```
