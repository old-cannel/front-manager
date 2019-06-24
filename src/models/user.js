import { queryCurrent, queryAuthorize,updatePassword } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    currentUser: {}, // 用户信息
    serviceMenus: [], // 用户菜单
    operationCodes: [], // 用户操作权限
  },

  effects: {
    *loadForLogin(_, { put }) {
      yield put({ type: 'queryCurrent' });
      yield put({ type: 'queryAuthorize' });
    },
    // 用户信息
    *queryCurrent(_, { call, put }) {
      const { code, result } = yield call(queryCurrent);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { currentUser: result } });
      }
    },
    // 修改密码
    *updatePassword({payload={}}, { call }) {
      return yield call(updatePassword,payload);
    },
    // 用户权限（菜单权限，操作权限）
    *queryAuthorize(_, { call, put }) {
      const { code, result } = yield call(queryAuthorize);
      if (code === 10000 && result) {
        yield put({
          type: 'updateState',
          payload: {
            serviceMenus: result.menus,
            operationCodes: result.operationCodes,
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
