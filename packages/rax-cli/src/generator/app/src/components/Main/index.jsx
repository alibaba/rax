import './index.css';
import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Link from 'rax-link';
import Image from 'rax-image';

export default (props) => {
  return (
    <View className="home">
      <%_ if (!projectFeatures.includes('ssr')) { -%>
      <Image
        className="logo"
        source={{
          uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
        }}
      />
      <%_ } -%>
      <Text className="title">Welcome to Your Rax App</Text>

      <Text className="info">More infomation about</Text>
      <Text className="info">how to cutomize this project</Text>
      <View className="box">
        <Link className="info" href="/about">
          about
        </Link>
      </View>
    </View>
  );
};
