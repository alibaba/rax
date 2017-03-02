# Tabbar 底部导航

Tabbar 可以看作一个页面级的导航布局，包含了底部导航和切换的页面，外部不需要嵌套其它标签。

## API

**Tabbar**

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|barTintColor|color||bar的背景色|
|style|style||附加在bar上的样式|
|tintColor|color||选中tab的文案颜色|

**Tabbar.Item**

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|badge|string,number||透出的消息数|
|icon|image source||icon地址|
|selectedIcon|image source||tab选中时的icon地址|
|onPress|Function||选中的回调|
|selected|bool||是否选中|
|style|style||附加在tab上的样式|
|title|string||透出的文案|

## 示例

<img src="https://img.alicdn.com/tps/TB1ZqDcKVXXXXb0XFXXXXXXXXXX-392-703.gif" height = "300" alt="图片名称" align=center />

```jsx
/** @jsx createElement */
import {createElement, Component, render} from 'rax';
import {View, Text, Image} from 'rax-components';
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
      <Tabbar
        unselectedTintColor="yellow"
        tintColor="#ff4400"
        barTintColor="darkslateblue">
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
