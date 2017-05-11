/*
** 注意，修改stata里状态时，需返回一个新的对象才能更新
*/

export default {

  updataOffer(state, { payload }) {
    const offerList = state.offerList.concat(payload);
    return {
      offerList
    };
  },

  updataMain(state, { payload }) {
    const data = handleData(payload);
    return {
      ...data,
      searchKeyword: payload.searchKeyword,
      searchPlaceholder: payload.searchPlaceholder
    };
  },

  noMoreOffers(state, {payload}) {
    return {
      hasMoreOffer: payload
    };
  },

  resetOfferList(state, {payload}) {
    state.offerList = payload;
    return state;
  }
};

function handleData(original) {
  var floors = {};
  original.floors.forEach(function(item = {}) {
    if (item.key === 'heapMap') {
      try {
        let heapMapData = JSON.parse((item.data || {}).string || null);

        floors.heapMap = heapMapData;
      } catch (e) {
        // TODO
      }
    } else {
      floors[item.key] = item;
    }
  });

  return floors;
}