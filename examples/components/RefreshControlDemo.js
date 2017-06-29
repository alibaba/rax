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
import RecyclerView from 'rax-recyclerview';
import RefreshControl from 'rax-refreshcontrol';

let arrayFrom = function(arrayLike /* , mapFn, thisArg */) {
  if (arrayLike == null) {
    throw new TypeError('Object is null or undefined');
  }

  // Optional args.
  var mapFn = arguments[1];
  var thisArg = arguments[2];

  var C = this;
  var items = Object(arrayLike);
  var symbolIterator = typeof Symbol === 'function'
    ? Symbol.iterator
    : '@@iterator';
  var mapping = typeof mapFn === 'function';
  var usingIterator = typeof items[symbolIterator] === 'function';
  var key = 0;
  var ret;
  var value;

  if (usingIterator) {
    ret = typeof C === 'function'
      ? new C()
      : [];
    var it = items[symbolIterator]();
    var next;

    while (!(next = it.next()).done) {
      value = next.value;

      if (mapping) {
        value = mapFn.call(thisArg, value, key);
      }

      ret[key] = value;
      key += 1;
    }

    ret.length = key;
    return ret;
  }

  var len = items.length;
  if (isNaN(len) || len < 0) {
    len = 0;
  }

  ret = typeof C === 'function'
    ? new C(len)
    : new Array(len);

  while (key < len) {
    value = items[key];

    if (mapping) {
      value = mapFn.call(thisArg, value, key);
    }

    ret[key] = value;

    key += 1;
  }

  ret.length = key;
  return ret;
};


class Row extends Component {
  handleClick = (e) => {
    this.props.onClick(this.props.data);
  };

  render() {
    return (
     <TouchableWithoutFeedback onPress={this.handleClick} >
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.props.data.text + ' (' + this.props.data.clicks + ' clicks)'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class RefreshControlDemo extends Component {
  state = {
    isRefreshing: false,
    loaded: 0,
    refreshText: '↓ Pull To Refresh',
    rowData: arrayFrom(new Array(20)).map(
      (val, i) => ({text: 'Initial row ' + i, clicks: 0})),
  };

  handleClick = (row) => {
    row.clicks++;
    this.setState({
      rowData: this.state.rowData,
    });
  };

  handleRefresh = (e) => {
    this.setState({
      isRefreshing: true,
      refreshText: 'Refreshing',
    });
    setTimeout(() => {
      // prepend 10 items
      const rowData = arrayFrom(new Array(10))
      .map((val, i) => ({
        text: 'Loaded row ' + (+this.state.loaded + i),
        clicks: 0,
      }))
      .concat(this.state.rowData);

      this.setState({
        loaded: this.state.loaded + 10,
        isRefreshing: false,
        rowData: rowData,
        refreshText: '↓ Pull To Refresh',
      });
    }, 1000);
  };

  render() {
    const rows = this.state.rowData.map((row, ii) => {
      return <Row key={ii} data={row} onClick={this.handleClick} />;
    });
    return (
      <View style={styles.container}>
        <ScrollView
          style={{height: 500}}
          refreshControl={null}>
          <RefreshControl
            style={styles.refreshView}
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
          >
            <Text>{this.state.refreshText}</Text>
          </RefreshControl>
          {rows}
        </ScrollView>
      </View>
    );
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
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  box: {
    width: 64,
    height: 64,
  },
  eventLogBox: {
    padding: 10,
    margin: 10,
    height: 80,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    margin: 5,
  },
  text: {
    alignSelf: 'center',
    color: 'black',
  },
  refreshView: {
    height: 80,
    width: 750,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshArrow: {
    fontSize: 30,
    color: '#45b5f0'
  },
};


export default RefreshControlDemo;
