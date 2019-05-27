#{IMPORTSERVER}
import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  list: [],//table list
  current: {},
  pagination: {},//分页

};

export default {
  namespace: '#{NAMESPACE}',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '#{ROUTER}' || location.pathname === '#{ROUTER}/') {
          initState.pageKey = Math.random();
          dispatch({ type: 'updateState', payload: initState });
        }
      });
    },
  },
  state: initState,

  effects: {
    //分页list
    * queryList({ payload = {} }, { call, put }) {
      const page = { size: 10, current: 1 };
      let param = { ...page, ...payload };
      const { code, result } = yield call(queryList, param);
      if (result && code === 10000) {
        const pagination = {
          current: param ? Number(param.current) : 1,
          pageSize: param ? Number(param.size) : 10,
          total: result.total,
        };
        yield put({ type: 'updateState', payload: { list: result.records, pagination } });
      }
    },

    //修改
    * edit({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { current: result,editLoading:false } });
      }
    },

    //新增保存
    * save({ payload = {} }, { call }) {
      return yield call(save, payload);
    },

    //修改保存
    * update({ payload = {} }, { call }) {
      return yield call(update, payload);
    },

    //删除
    * delete({ payload = {} }, { call, put }) {
      const result = yield call(del, payload);
      if (result && result.code === 10000) {
        message.success(result.msg);
        yield put({ type: 'queryList' });
      }else{
        message.success(result.msg);
      }

    },

    //获取详情
    * get({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { current: result } });
      }
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
