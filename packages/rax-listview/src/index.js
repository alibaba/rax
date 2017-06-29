import {createElement, Component} from 'rax';
import {isWeex} from 'universal-env';
import View from 'rax-view';
import RecyclerView from 'rax-recyclerview';

const SCROLLVIEW_REF = 'scrollview';

class ListView extends Component {

  static propTypes = {};

  static defaultProps = {
    renderScrollComponent: props => <RecyclerView {...props} />,
    dataSource: [],
  };

  scrollTo = (options) => {
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].scrollTo(options);
    }
  }

  resetScroll = () => {
    if (this.refs[SCROLLVIEW_REF]) {
      this.refs[SCROLLVIEW_REF].resetScroll();
    }
  }

  render() {
    let {
      renderScrollComponent,
      renderHeader,
      renderFooter,
      renderRow,
      dataSource,
    } = this.props;

    let header = typeof renderHeader == 'function' ? renderHeader() : null;
    let footer = typeof renderFooter == 'function' ? renderFooter() : null;
    let body = dataSource.map((i, index) => {
      return renderRow(i, index);
    });

    let props = {
      ...this.props,
      ...{
        ref: SCROLLVIEW_REF,
        children: [].concat(header, body, footer),
        _autoWrapCell: true,
      },
    };

    return renderScrollComponent(props);
  }
}

export default ListView;
