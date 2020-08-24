import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

import './index.css';

import CustomComp from '../../components/CustomComp';

export default function Home() {
  function noop() {}
  return (
    <View className="home">
      <View className="test" onClick={noop}>onClick -> onTap (alibaba miniapp) && bindtap (wechat miniprogram) in rax-view</View>
      <Text className="test" onClick={noop}>onClick -> bindtap (wechat miniprogram) in rax-text</Text>
      <Image onClick={noop} onChange={noop}>onClick/onChange are not transformed (alibaba miniapp) && onClick -> bindonClick/onChange -> bindonChange (wechat miniprogram)</Image>
      <button className="test" style={{color: 'red'}} onClick={noop} onChange={noop}>onClick -> onTap (alibaba miniapp) && onClick -> bindtap (wechat miniprogram) && onChange -> bindchange (wechat miniprogram) </button>
      <CustomComp onClick={noop} onChange={noop}>not transformed</CustomComp>
    </View>
  );
}
