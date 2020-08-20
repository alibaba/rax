import { createElement, useState } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Modal from 'rax-modal';

import './index.css';

const Home = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <View onClick={() => {
        setVisible(true);
      }}>open</View>
      <Modal
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Text>Hello, world</Text>
      </Modal>
    </View>
  );
};

export default Home;
