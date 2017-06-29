import { createElement, Component } from 'rax';
import { View, Text, ScrollView, RecyclerView } from 'rax-components';
import FloorWrapper from '../../mods/wrap';
import Canopy from '../Canopy';
import styles from './style';
import main from '../../mods/mock/home.js';
import offers from '../../mods/mock/offers.js';

const noop = () => {};

class Home extends Component {
  static defaultProps = {
    dispatch: noop,
    listData: []
  }

  constructor(props, context) {
    super(props, context);
    this.beginPage = 0;
    this.loadMoreOffers = this.loadMoreOffers.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(refreshCallBack) {
    const { dispatch } = this.props;
    this.loadMainData(refreshCallBack);
    // 下拉刷新重置offerList数据
    if (refreshCallBack) {
      dispatch('resetOfferList', []);
    }
    this.loadMoreOffers();
  }

  // callBack下拉刷新成功
  loadMainData(callBack) {
    const { dispatch } = this.props;
    const model = main.data.model;

    dispatch('updataMain', model);
    if (callBack && typeof callBack === 'function') {
      setTimeout(() => {
        callBack();
      }, 800);
    }
  }

  loadMoreOffers() {
    const { dispatch} = this.props;
    const model = offers.data;
    if (!model || !model.length) {
      return dispatch('noMoreOffers', false);
    }

    dispatch('updataOffer', model);
  }

  render() {
    const { searchKeyword, searchPlaceholder } = this.props;

    return (
      <View style={styles.wrapper}>
        <FloorWrapper style={styles.app} key="floors"
          component={RecyclerView}
          onEndReached={this.loadMoreOffers}
          onRefresh={this.loadData}
          onEndReachedThreshold={500}
          {...this.props} />
        <Canopy searchKeyword={searchKeyword}
          searchPlaceholder={searchPlaceholder} />
      </View>
    );
  }
}

export default Home;
