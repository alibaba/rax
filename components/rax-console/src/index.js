import {createElement, Component} from 'rax';
import FilterBar from './FilterBar';
import ConsoleOutput from './ConsoleOutput';
import getMessageVisibility from './getMessageVisibility';
import consoleIconSource from 'image-source-loader!./images/webconsole.svg';
import './index.css';
import {
  DEFAULT_FILTERS,
  DEFAULT_FILTERS_VALUES,
  FILTERS,
  MESSAGE_TYPE,
  MESSAGE_SOURCE,
  MESSAGES_CLEAR,
  DEFAULT_FILTERS_RESET,
  FILTER_TEXT_SET,
  FILTER_TOGGLE,
  FILTERS_CLEAR,
  CONSOLE_CLOSE,
  TIMESTAMPS_TOGGLE
} from './const';

function getDefaultFiltersCounter() {
  const count = DEFAULT_FILTERS.reduce((res, filter) => {
    res[filter] = 0;
    return res;
  }, {});
  count.global = 0;
  return count;
}

export default class Console extends Component {
  messageId = 0;

  state = {
    // List of all the messages added to the console.
    messagesById: new Map(),
    // Array of the visible messages.
    visibleMessages: [],
    // Object for the filtered messages.
    filteredMessagesCount: getDefaultFiltersCounter(),
    filtersState: {...DEFAULT_FILTERS_VALUES},
    show: false,
    timestampsVisible: false,
  };

  dispatch = (action) => {
    if (action.type === CONSOLE_CLOSE) {
      this.setState({
        show: false
      });
    } else if (action.type === TIMESTAMPS_TOGGLE) {
      this.setState({
        timestampsVisible: action.value
      });
    } else {
      this.handleFilter(action);
    }
  };

  handleFilter = (action) => {
    let messagesById = this.state.messagesById;
    if (action.type === MESSAGES_CLEAR) {
      messagesById = new Map();
    }

    let filtersState = this.filters(this.state.filtersState, action);

    const filteredMessagesCount = getDefaultFiltersCounter();
    const visibleMessages = [];

    messagesById.forEach((message, msgId) => {
      const {
        visible,
        cause
      } = getMessageVisibility(message, this.state, filtersState);
      if (visible) {
        visibleMessages.push(msgId);
      } else if (DEFAULT_FILTERS.includes(cause)) {
        filteredMessagesCount.global += 1;
        filteredMessagesCount[cause] += 1;
      }
    });

    this.setState({
      messagesById,
      filtersState,
      visibleMessages,
      filteredMessagesCount,
    });
  }

  filters(state = {...DEFAULT_FILTERS_VALUES}, action) {
    switch (action.type) {
      case FILTER_TOGGLE:
        const {filter} = action;
        const active = !state[filter];
        return {
          ...state,
          [filter]: active
        };
      case FILTERS_CLEAR:
        return {...DEFAULT_FILTERS_VALUES};
      case DEFAULT_FILTERS_RESET:
        const newState = {...state};
        DEFAULT_FILTERS.forEach(filterName => {
          newState[filterName] = DEFAULT_FILTERS_VALUES[filterName];
        });
        return newState;
      case FILTER_TEXT_SET:
        const {text} = action;
        return {
          ...state,
          [FILTERS.TEXT]: text
        };
    }

    return state;
  }

  addMessage(newMessage) {
    const state = this.state;
    const filtersState = state.filtersState;

    newMessage.id = ++this.messageId;
    newMessage.timeStamp = Date.now();

    const addedMessage = Object.freeze(newMessage);
    state.messagesById.set(newMessage.id, addedMessage);

    const {
      visible,
      cause
    } = getMessageVisibility(addedMessage, state, filtersState);

    if (visible) {
      state.visibleMessages.push(newMessage.id);
    } else if (DEFAULT_FILTERS.includes(cause)) {
      state.filteredMessagesCount.global++;
      state.filteredMessagesCount[cause]++;
    }

    this.forceUpdate();
  }

  render() {
    return this.state.show ? <div className="container">
      <div className="console" style={this.props.style}>
        <FilterBar dispatch={this.dispatch} filter={this.state.filtersState} filteredMessagesCount={this.state.filteredMessagesCount} />
        <ConsoleOutput
          messages={this.state.messagesById}
          visibleMessages={this.state.visibleMessages}
          timestampsVisible={this.state.timestampsVisible}
        />
      </div>
    </div> : <img onClick={() => this.setState({show: true})} className="console-icon" src={consoleIconSource.uri} />;
  }
}
