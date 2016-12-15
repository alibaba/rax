import {createElement, Component, render} from 'rax';
import {View, Text, TouchableHighlight} from 'rax-components';
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
        <TouchableHighlight style={styles.btn} onPress={() => {
          dispatch({type: 'counter/add'});
        }}>
          <Text style={styles.text}>
          +
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.btn} onPress={() => {
          dispatch({type: 'counter/minus'});
        }}>
          <Text style={styles.text}>
          -
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {
          dispatch({type: 'content/set', text: 'New Value'});
        }}>
          <Text style={styles.text}>
            Set lab
          </Text>
        </TouchableHighlight>
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

  //多个 reducer 时使用 combineReducers
  combineReducers({
    content,
    counter
  })
);

const styles = {
  main: {
  },
  box: {
    flexDirection: 'row'
  },
  opt: {
    flexDirection: 'row',
    marginTop: '28rem'
  },
  text: {
    fontSize: '38rem'
  },
  btn: {
    marginRight: '12rem',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#333333',
    width: '38rem',
    height: '38rem',
    alignItems: 'center'
  },
  asyn: {
    width: '300rem'
  }
};

render(<Provider store={store}>
  <App />
</Provider>);
