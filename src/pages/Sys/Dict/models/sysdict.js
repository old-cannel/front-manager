import {queryList,save,update,get,del,checkType,getAllDict} from '@/services/sys/dict/service';
import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  list: [],// table list
  current: {},
  pagination: {},// 分页
  filterKey: Math.random(),
  allList:[]
};

export default {
  namespace: 'sysdict',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/dict' || location.pathname === '/sys/dict/') {
          const state = { ...initState, ...{ pageKey: Math.random() } };
          dispatch({ type: 'updateState', payload: state });
          dispatch({ type: 'getAllDict'});
        }
      });
    },
  },
  state: initState,

  effects: {
    // 分页list
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

    // 修改
    * edit({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'getAllDict'});
        yield put({ type: 'updateState', payload: { current: result,editLoading:false } });
      }
    },

    // 新增保存
    * save({ payload = {} }, { call }) {
      return yield call(save, payload);
    },

    // 修改保存
    * update({ payload = {} }, { call }) {
      return yield call(update, payload);
    },

    // 删除
    * delete({ payload = {} }, { call, put }) {
      const result = yield call(del, payload);
      if (result && result.code === 10000) {
        message.success(result.msg);
        yield put({ type: 'getAllDict'});
        yield put({ type: 'updateState', payload: { filterKey: Math.random() } });
        yield put({ type: 'queryList' });
      }else{
        message.success(result.msg);
      }
      return result
    },

    // 获取详情
    * get({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { current: result } });
      }
    },

   // 验证字典类型
    * checkType({ payload = {} }, { call }) {
      return yield call(checkType, payload);
    },

   // 获取所有字典值
    * getAllDict({ payload = {} }, { call,put }) {
      const {code,result}=yield call(getAllDict, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { allList: result } });
      }
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
