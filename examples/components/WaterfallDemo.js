import {createElement, Component} from 'rax';
import View from 'rax-view';
import Waterfall from 'rax-waterfall';

let dataSource = [
  {
    height: 550,
    item: {}
  },
  {
    height: 624,
    item: {}
  },
  {
    height: 708,
    item: {}
  },
  {
    height: 600,
    item: {}
  },
  {
    height: 300,
    item: {}
  },
  {
    height: 100,
    item: {}
  },
  {
    height: 400,
    item: {}
  },
  {
    height: 550,
    item: {}
  },
  {
    height: 624,
    item: {}
  },
  {
    height: 708,
    item: {}
  },
  {
    height: 600,
    item: {}
  },
  {
    height: 300,
    item: {}
  },
  {
    height: 100,
    item: {}
  },
  {
    height: 400,
    item: {}
  }
];

class WaterfallDemo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: dataSource
    };
  }

  loadMore = () => {
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.concat(dataSource)
      });
    }, 1000);
  }


  render() {
    return (<View style={styles.container}>
      <View>first module</View>
      <Waterfall
        style={{
          height: 500,
          width: 660
        }}
        columnWidth={150}
        columnCount={4}
        columnGap={20}
        dataSource={this.state.dataSource}
        renderHeader={() => {
          return [
            <View key="1" style={{height: 100, backgroundColor: 'yellow', marginBottom: 20}}>header1</View>,
            <View key="2" style={{height: 100, backgroundColor: 'green', marginBottom: 20}}>header2</View>
          ];
        }}
        renderFooter={() => {
          return <View key="3" style={{height: 300, backgroundColor: 'blue', marginTop: 20}}>footer1</View>;
        }}
        renderItem={(item, index) => {
          return (<View style={{height: item.height, backgroundColor: 'red', marginBottom: 20}}>
            {index}
          </View>);
        }}
        onEndReached={this.loadMore} />
    </View>);
  }
}

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
};

export default WaterfallDemo;
