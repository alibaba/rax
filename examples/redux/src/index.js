/* global __REDUX_DEVTOOLS_EXTENSION__ */

import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import {createStore, combineReducers} from 'redux';
import {connect, Provider} from 'rax-redux';

class Page extends Component {
  render() {
    const {counter, content, dispatch} = this.props;
    const {count} = counter;
    const {text} = content;

    return <View style={styles.main}>
      <View style={styles.box}>
        <Text style={styles.text}>
          {text}：
        </Text>
        <Text style={styles.text}>
          {count}
        </Text>
      </View>
      <View style={styles.opt}>
        <Text style={styles.btn} onPress={() => {
          dispatch({type: 'counter/add'});
        }}>
          +
        </Text>
        <Text style={styles.btn} onPress={() => {
          dispatch({type: 'counter/minus'});
        }}>
          -
        </Text>
        <Text style={[styles.btn, styles.set]} onPress={() => {
          dispatch({type: 'content/set', text: 'New Value'});
        }}>
          Set text
        </Text>
      </View>
    </View>;
  }
}

function mapStateToProps(state) {
  return {
    content: state.content,
    counter: state.counter
  };
}

let App = connect(
  mapStateToProps
)(Page);

function counter(state = {
  count: 0
}, action = {}) {
  switch (action.type) {
    case 'counter/add':
      return Object.assign({}, state, {
        count: state.count + 1
      });
    case 'counter/minus':
      return Object.assign({}, state, {
        count: state.count - 1
      });
    default:
      return state;
  }
}

function content(state = {
  text: 'Value'
}, action = {}) {
  switch (action.type) {
    case 'content/set':
      return Object.assign({}, state, {
        text: action.text
      });
    default:
      return state;
  }
}

let store = createStore(
  combineReducers({
    content,
    counter
  }),
  typeof __REDUX_DEVTOOLS_EXTENSION__ === 'function' && __REDUX_DEVTOOLS_EXTENSION__()
);

const styles = {
  main: {
    flex: 1,
    paddingTop: 36
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  opt: {
    flexDirection: 'row',
    marginTop: 28,
    justifyContent: 'center'
  },
  text: {
    fontSize: 38,
    lineHeight: 38,
  },
  btn: {
    fontSize: 38,
    lineHeight: 38,
    marginRight: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#333333',
    width: 38,
    height: 38,
    alignItems: 'center',
    textAlign: 'center'
  },
  set: {
    width: 200
  }
};

render(<Provider store={store}>
  <App />
</Provider>);
