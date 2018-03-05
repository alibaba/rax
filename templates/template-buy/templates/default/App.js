import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import TextInput from 'rax-textinput';
import Switch from 'rax-switch';
import ScrollView from 'rax-scrollview';
import Text from 'rax-text';
import Picture from 'rax-picture';
import Button from 'rax-button';
import Picker from 'rax-picker';
import Counter from './mods/Counter';
import CardItem from './mods/CardItem';
import FormLine from './mods/FormLine';
import FormSub from './mods/FormSub';
import styles from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 30,
      count: 1,
      express: '',
      huabei: false,
    };
  }

  formSub = () => {
    console.log(this.state);
  }

  render() {
    console.log(styles.bottom);
    console.log(styles.userName);
    console.log({fontSize: 30});
    return (
      <ScrollView style={styles.container}>
        <View style={styles.userInfoBox}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>收货人：郑西坡</Text>
            <Text style={styles.userName}>13588888888</Text>
          </View>
          <View><Text style={styles.userAddr}>收货地址：汉东省京州市光明区光明峰街道969号</Text></View>
          <View><Text style={styles.tip}>(收获不便时，可选择免费代收货服务)</Text></View>
        </View>
        <View style={styles.border}>
          <Picture source={{uri: 'https://gw.alicdn.com/tfs/TB1dCVBRXXXXXbrXpXXXXXXXXXX-750-12.jpg'}} style={styles.borderPic} resizeMode={'contain'} />
        </View>
        <View style={styles.shop}>
          <View style={styles.shopPicBox}>
            <Picture source={{uri: 'https://img.alicdn.com/tfs/TB1j3BaRXXXXXa3XVXXXXXXXXXX-32-32.jpg'}} style={styles.shopPic} resizeMode={'contain'} />
          </View>
          <Text style={styles.shopTitle}>朱然的纵火小铺</Text>
        </View>
        <CardItem
          title={'[现货] 三国志13 日本原版官方正品 扑克牌'}
          pic={'https://gd2.alicdn.com/imgextra/i4/30782564/TB2sNreXzzyQeBjy1zdXXaInpXa_!!30782564.jpg_400x400.jpg'}
          desc={'这里是一段描述'}
          url={'https://www.taobao.com/'}
          price={'¥30.00'}
          commendNum={'x1'} />
        <FormLine>
          <Text>购买数量</Text>
          <Counter
            value={1}
            end={5}
            start={0}
            onChange={(num) => {
              this.state.count = num;
            }}
            onComplete={(num) => {
              this.state.count = num;
            }} />
        </FormLine>
        <FormLine>
          <Text>配送方式</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={'10.00'}
              onValueChange={(item) => {
                this.state.express = item;
              }}
              style={styles.picker}>
              <Picker.Item value={'10.00'} label={'快递 ¥ 10.00'} />
              <Picker.Item value={'20.00'} label={'EMS ¥ 20.00'} />
            </Picker>
            <Picture source={{uri: 'https://gw.alicdn.com/tfs/TB1JxM4QVXXXXc3aXXXXXXXXXXX-26-52.jpg'}} style={styles.pickerPic} resizeMode={'contain'} />
          </View>
        </FormLine>
        <FormLine>
          <Text>运费险</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={'0.00'}
              onValueChange={(item) => {
                this.state.express = item;
              }}
              style={styles.picker}>
              <Picker.Item value={'0.00'} label={'无运费险'} />
              <Picker.Item value={'10.00'} label={'运费险 ¥ 20.00'} />
            </Picker>
            <Picture source={{uri: 'https://gw.alicdn.com/tfs/TB1JxM4QVXXXXc3aXXXXXXXXXXX-26-52.jpg'}} style={styles.pickerPic} resizeMode={'contain'} />
          </View>
        </FormLine>
        <FormLine>
          <Text>运费险投保须知</Text>
          <View><Text>？</Text></View>
        </FormLine>
        <FormLine>
          <Text>买家留言</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder={'选填：对本次交易的说明'}
            />
          </View>
        </FormLine>
        <FormSub>
          <Text style={styles.subText}>共1件商品</Text>
          <Text style={styles.subText}>小记：</Text>
          <Text style={styles.price}>¥ 40.00</Text>
        </FormSub>
        <FormLine>
          <View>
            <Text>花呗分期</Text>
          </View>
          <View>
            <Switch
              onValueChange={(value) => {
                this.state.huabei = value;
                this.setState(this.state);
              }}
              value={this.state.huabei} />
          </View>
        </FormLine>
        <FormSub>
          <Text style={styles.subText}>合计</Text>
          <Text style={styles.price}>¥ 40.00</Text>
          <Button style={styles.btn} onPress={this.formSub}>
            <Text style={styles.btnText}>提交订单</Text>
          </Button>
        </FormSub>

      </ScrollView>
    );
  }
}

export default App;
