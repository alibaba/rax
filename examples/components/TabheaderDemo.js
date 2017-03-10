
import {createElement, Component} from 'rax';
import {
  View,
  Text,
  Image,
  Link,
  TextInput,
  Button,
  Switch,
  Video,
  ScrollView,
  TouchableWithoutFeedback} from 'rax-components';
import TabHeader from 'rax-tabheader';

function renderItem(item, index) {
  return <View style={styles.item}><Text style={styles.text}>{item}</Text></View>;
}
function renderSelect(item, index) {
  return <View style={styles.select}><Text style={styles.text}>{item}</Text></View>;
}

class TabheaderDemo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      top: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.refs.tabheader.select(1);
    }, 1000);
  }

  onPress = (index) => {
    console.log('onPress', index);
  }

  onSelect = (index) => {
    console.log('onSelect', index);
  }

  onSelected = (index) => {
    console.log('onSelected', index);
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <TabHeader
            ref="tabheader"
            style={styles.tabheader}
            dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8']}
            renderItem={renderItem}
            renderSelect={renderSelect}
            onPress={this.onPress}
            onSelected={this.onSelected}
            selected={0}
            itemWidth="166rem"
            dropDownCols={4}
            type={'dropDown-border-scroll'}
          />
        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tabheader: {

  },
};

export default TabheaderDemo;
