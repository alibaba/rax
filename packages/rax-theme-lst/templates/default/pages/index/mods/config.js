import Shelf from '../components/Shelf';
import OfferList from '../components/OfferList';
import QuickEntry from '../components/QuickEntry';
import Promotion from '../components/Promotion';
import CashierCounter from '../components/CashierCounter';
import StoresNews from '../components/StoresNews';
import Cheap from '../components/Cheap';
import Redbag from '../components/Redbag';

/*
**  otherProps其他需要传入的props, $开头表示变量，取值路径是props，
**  如：hasMoreOffer = '$hasMoreOffer'，则映射 hasMoreOffer = props[hasMoreOffer]，传入相应组件
**   imgSrc: '$heapMap.imgSrc', 映射imgSrc=props[heapMap][imgSrc];
*/

export default [
  {
    components: QuickEntry,
    propsFromStore: {
      sourceData: 'quickEntry.data'
    }
  }, {
    components: StoresNews,
    propsFromStore: {
      sourceData: 'headlines.data'
    }
  }, {
    components: Redbag,
    propsFromStore: {
      sourceData: 'hongbao.data'
    }
  }, {
    components: Cheap,
    propsFromStore: {
      sourceData: 'cheap'
    }
  }, {
    components: Promotion,
    propsFromStore: {
      sourceData: 'promotion.data'
    }
  }, {
    components: CashierCounter,
    propsFromStore: {
      sourceData: 'cashierCounter'
    }
  }, {
    components: Shelf,
    propsFromStore: {
      sourceData: 'shelf'
    }
  }, {
    components: OfferList,
    propsFromStore: {
      sourceData: 'offerList',
      hasMoreOffer: 'hasMoreOffer'
    }
  }
];
