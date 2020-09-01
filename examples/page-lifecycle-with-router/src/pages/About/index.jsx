import { createElement } from 'rax';
import { registerNativeEventListeners, addNativeEventListener, removeNativeEventListener, usePageShow, usePageHide } from 'rax-app';
import View from 'rax-view';
import Text from 'rax-text';

import './index.css';

import Logo from '../../components/Logo';

function handler(lifeCycle) {
  return () => {
    console.log('about page ' + lifeCycle);
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

function About(props) {
  // To start listening for location changes...
  let unlisten = props.history.listen(( action, location ) => {
    console.log('in about page action', action);
    console.log('in about page location', location);
  });

  usePageShow(() => {
    console.log('about page show -- from usePageShow');
  });
  usePageHide(() => {
    console.log('about page hide -- from usePageHide');
  });

  return (
    <View className="home">
      <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
      <Text className="title">这里是 About 页面</Text>
      <Text className="info" onClick={() => {
        props.history.push('/about');
      }}>history.push Home 页面</Text>
      <Text className="info" onClick={() => {
        props.history.replace('/about');
      }}>history.replace Home 页面</Text>
      <Text className="info" onClick={() => {
        props.history.goBack();
      }}>history.back Home 页面</Text>

    </View>
  );
}

registerNativeEventListeners(About, ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onShareAppMessage', 'onTitleClick', 'onOptionMenuClick', 'onPopMenuClick', 'onPullDownRefresh', 'onPullIntercept', 'onTabItemTap', 'onPageScroll', 'onReachBottom']);

export default About;
