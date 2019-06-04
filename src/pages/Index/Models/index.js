import { getData, getTable } from '@/services/index/service';

const initState = {
  pageKey: Math.random(),
  index: {},
  tableOne: [],
  tableTwo: [],
};

export default {
  namespace: 'index',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/index') {
          initState.pageKey = Math.random();
          dispatch({ type: 'updateState', payload: initState });
        }
      });
    },
  },
  state: initState,

  effects: {
    // 分页list
    *getData({ payload = {} }, { call, put }) {
      const { code, result } = yield call(getData, payload);
      if (result && code === 10000) {
        yield put({
          type: 'updateState',
          payload: {
            index: result,
          },
        });
      }
    },
    *getTable({ payload = {} }, { call, put }) {
      const { code, result } = yield call(getTable, payload);
      if (result && code === 10000) {
        yield put({
          type: 'updateState',
          payload: {
            tableOne: result.tableOne,
            tableTwo: result.tableTwo,
          },
        });
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
