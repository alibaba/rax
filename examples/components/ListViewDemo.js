import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';
import TextInput from 'rax-textinput';
import Button from 'rax-button';
import Switch from 'rax-switch';
import Video from 'rax-video';
import ScrollView from 'rax-scrollview';
import TouchableWithoutFeedback from 'rax-touchable';
import ListView from 'rax-listview';


let listData = [
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
    {name1: 'tom'}, {name1: 'tom'}, {name1: 'tom'},
];
// 将 item 定义成组件

class ListViewDemo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: listData
    };
  }
  listHeader = () => {
    return (
      <View style={styles.title}>
        <Text style={styles.text}>Header</Text>
      </View>
    );
  }
  listLoading = () => {
    if (this.state.index < 4) {
      return (
        <View style={styles.loading}>
          <Text style={styles.text}>loading...</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  listItem = (item, index) => {
    if (index % 2 == 0) {
      return (
        <View style={styles.item1}>
          <Text style={styles.text}>{item.name1}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.item2}>
          <Text style={styles.text}>{item.name1}</Text>
        </View>
      );
    }
  }
  handleLoadMore = () => {
    setTimeout(() => {
      this.state.index++;
      if (this.state.index < 5) {
        this.state.data.push(
          {name1: 'loadmore 2'},
          {name1: 'loadmore 3'},
          {name1: 'loadmore 4'},
          {name1: 'loadmore 5'},
          {name1: 'loadmore 2'},
          {name1: 'loadmore 3'},
          {name1: 'loadmore 4'},
          {name1: 'loadmore 5'}
        );
      }
      this.setState(this.state);
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
      <ListView
        style={{
          height: 500,
        }}
        renderHeader={this.listHeader}
        renderFooter={this.listLoading}
        renderRow={this.listItem}
        dataSource={this.state.data}
        onEndReached={this.handleLoadMore}
      />
      </View>
    );
  }

};


let styles = {
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  title: {
    margin: 50
  },
  text: {
    fontSize: 28,
    color: '#000000',
    fontSize: 28,
    padding: 40
  },
  item1: {
    height: 110,
    backgroundColor: '#909090',
    marginBottom: 3
  },
  item2: {
    height: 110,
    backgroundColor: '#e0e0e0',
    marginBottom: 3
  },
  loading: {
    padding: 50,
    textAlign: 'center',
  }
};

export default ListViewDemo;
