import {queryList,save,update,get,del,listTree,checkCode} from '@/services/sys/area/service';
import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  list: [],// table list
  current: {},
  filterKey: Math.random(),
  allList:[],
  editLoading:false,
};

const treeData = list => {
  list.forEach(item => {
    item.title = item.name;
    item.value = item.id;
    if (item.children) {
      treeData(item.children);
    }
  });
};
export default {
  namespace: 'sysarea',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/area' || location.pathname === '/sys/area/') {
          const state = { ...initState, ...{ pageKey: Math.random() } };
          dispatch({ type: 'updateState', payload: state });
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
        yield put({ type: 'updateState', payload: { list: result } });
      }
    },

    // 修改
    * edit({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
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
        yield put({ type: 'updateState', payload: { filterKey: Math.random() } });
        yield put({ type: 'queryList' });
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

    // 获取treeList
    * listTree({ payload = {} }, { call, put }) {
      const { code, result } = yield call(listTree, payload);
      if (code === 10000 && result) {
        treeData(result)
        yield put({ type: 'updateState', payload: { allList: result } });
      }
    },

    // 验证code
    * checkCode({ payload = {} }, { call }) {
      return  yield call(checkCode, payload);
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
