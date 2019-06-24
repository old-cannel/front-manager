import { queryDict } from '@/services/common/common';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    dictInfo: [],
  },

  effects: {
    *queryDict({}, { put, call }) {
      const result = yield call(queryDict);
      if (result && result.code === 10000) {
        const dicts = result.result.map(item => {
          return { ...item, ...{ value: item.dictValue, label: item.dictKey } };
        });
        yield put({
          type: 'global/updateDictInfo',
          payload: dicts,
        });
      }
    },
  },

  reducers: {
    updateDictInfo(state, { payload }) {
      return {
        ...state,
        dictInfo: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
