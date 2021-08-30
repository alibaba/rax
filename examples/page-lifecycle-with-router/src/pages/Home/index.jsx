import { createElement } from 'rax';
import { registerNativeEventListeners, addNativeEventListener, removeNativeEventListener, usePageShow, usePageHide } from 'rax-app';
import View from 'rax-view';
import Text from 'rax-text';

import './index.css';

import Logo from '../../components/Logo';

function handler(lifeCycle) {
  return () => {
    console.log('home page ' + lifeCycle);
    if (lifeCycle === 'onShareAppMessage') {
      return {
        title: '分享标题',
        desc: '分享详细说明',
        path: 'pages/Home/index'
      };
    }
  };
}

const lifeCycles = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onShareAppMessage', 'onTitleClick', 'onOptionMenuClick', 'onPopMenuClick', 'onPullDownRefresh', 'onPullIntercept', 'onTabItemTap', 'onPageScroll', 'onReachBottom'];

lifeCycles.forEach(lc => addNativeEventListener(lc, handler(lc)));

function Home(props) {
  // To start listening for location changes...
  let unlisten = props.history.listen(( action, location ) => {
    console.log('in home page action', action);
    console.log('in home page location', location);
  });

  usePageShow(() => {
    console.log('home page show -- from usePageShow');
  });
  usePageHide(() => {
    console.log('home page hide -- from usePageHide');
  });
  return (
    <View className="home">
      <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
      <Text className="title">这里是 Home 页面</Text>
      <Text className="info" onClick={() => {
        props.history.push('/about');
      }}>history.push About 页面</Text>
      <Text className="info" onClick={() => {
        props.history.replace('/about');
      }}>history.replace About 页面</Text>
    </View>
  );
}

registerNativeEventListeners(Home, ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onShareAppMessage', 'onTitleClick', 'onOptionMenuClick', 'onPopMenuClick', 'onPullDownRefresh', 'onPullIntercept', 'onTabItemTap', 'onPageScroll', 'onReachBottom']);

export default Home;
