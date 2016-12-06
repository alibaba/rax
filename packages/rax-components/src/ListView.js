import {createElement, Component} from 'rax';
import View from './View';
import RecyclerView from './RecyclerView';
import {isWeex} from 'universal-env';

const SCROLLVIEW_REF = 'scrollview';

class ListView extends Component {

  static defaultProps = {
    renderScrollComponent: props => <RecyclerView {...props} />,
    dataSource: [],
  };

  scrollTo = (options) => {
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].scrollTo(options);
    }
  }

  render() {
    let {
      renderScrollComponent,
      renderHeader,
      renderFooter,
      renderRow,
      dataSource,
      onEndReached,
      onEndReachedThreshold,
      id,
      className,
      style,
    } = this.props;

    let header = typeof renderHeader == 'function' ? renderHeader() : null;
    let footer = typeof renderFooter == 'function' ? renderFooter() : null;
    let body = dataSource.map((i, index) => {
      return renderRow(i, index);
    });

    let props = {
      id,
      className,
      ref: SCROLLVIEW_REF,
      style,
      children: [].concat(header, body, footer),
      onEndReached,
      onEndReachedThreshold,
      _autoWrapCell: true,
    };

    return renderScrollComponent(props);
  }
}

export default ListView;
