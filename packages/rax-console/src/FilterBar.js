import {createElement, Component} from 'rax';
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
  CONSOLE_CLOSE
} from './const';
import clearIconSource from 'image-source-loader!./images/clear.svg';
import closeIconSource from 'image-source-loader!./images/close.svg';
import './index.css';

class ClearButton extends Component {
  render() {
    const {dispatch} = this.props;

    return <img
      className="filter-clear"
      src={clearIconSource.uri}
      onClick={() => dispatch({
        type: MESSAGES_CLEAR,
      })}
    />;
  }
}

class CloseButton extends Component {
  render() {
    const {dispatch} = this.props;

    return <img
      className="close-button"
      src={closeIconSource.uri}
      onClick={() => dispatch({
        type: CONSOLE_CLOSE,
      })}
    />;
  }
}

class FilterButton extends Component {
  render() {
    const {active, label, filterKey, dispatch} = this.props;

    return <span
      className={['filter-button', {'filter-checked': active}]}
      onClick={() => dispatch({
        type: FILTER_TOGGLE,
        filter: filterKey,
      })}
    >{label}</span>;
  }
}

export default class FilterBar extends Component {
  render() {
    const {
      filter,
      filteredMessagesCount,
      dispatch
    } = this.props;

    const getLabel = (baseLabel, filterKey) => {
      const count = filteredMessagesCount[filterKey];
      if (filter[filterKey] || count === 0) {
        return baseLabel;
      }
      return `${baseLabel} (${count})`;
    };

    return <div className="filter-bar">
      <ClearButton dispatch={dispatch} />
      <div className="filter-buttons">
        <FilterButton
          dispatch={dispatch}
          active={filter[FILTERS.ERROR]}
          label={getLabel(
            'Errors',
            FILTERS.ERROR
          )}
          filterKey={FILTERS.ERROR} />
        <FilterButton
          dispatch={dispatch}
          active={filter[FILTERS.WARN]}
          label={getLabel(
            'Warnings',
            FILTERS.WARN
          )}
          filterKey={FILTERS.WARN} />
        <FilterButton
          dispatch={dispatch}
          active={filter[FILTERS.LOG]}
          label={getLabel(
            'Logs',
            FILTERS.LOG
          )}
          filterKey={FILTERS.LOG} />
        <FilterButton
          dispatch={dispatch}
          active={filter[FILTERS.INFO]}
          label={getLabel(
            'Info',
            FILTERS.INFO
          )}
          filterKey={FILTERS.INFO} />
        <FilterButton
          dispatch={dispatch}
          active={filter[FILTERS.DEBUG]}
          label={getLabel(
            'Debug',
            FILTERS.DEBUG
          )}
          filterKey={FILTERS.DEBUG} />
      </div>
      <CloseButton dispatch={dispatch} />
    </div>;
  }
}