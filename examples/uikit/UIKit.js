// Based on React Native Elements UI Toolkit https://github.com/react-native-community/react-native-elements
import Button from './Button';
import Card from './Card';
import {ScrollView, View, Text} from 'rax-components';
import {createElement} from 'rax';

function UIKit() {
  return (
    <ScrollView>

      <Card
        title="HELLO WORLD"
        image={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}>
          <Text style={{marginBottom: 20}}>
            The idea with React Native Elements is more about component structure than actual design.
          </Text>
          <Button
            small
            icon={{name: 'code'}}
            backgroundColor="#03A9F4"
            fontFamily="Lato"
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title="VIEW NOW" />
      </Card>

    </ScrollView>
  );
}

export default UIKit;
