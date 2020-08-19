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
<<<<<<< HEAD
        console.log(1123)
      setVisible(true)
      
=======
        setVisible(true);
>>>>>>> master
      }}>open</View>
      <Modal
        visible={visible}
        onHide={() => {
<<<<<<< HEAD
          setVisible(false)
=======
          setVisible(false);
>>>>>>> master
        }}
      >
        <Text>Hello, world</Text>
      </Modal>
    </View>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> master

export default Home;
