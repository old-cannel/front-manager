import {queryList,save,update,get,del,loadApi,checkCode,checkUrl} from '@/services/sys/menu/service';
import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  current: {},
  menuTreeData:[] // 菜单树
};

const treeData = list => {
  list.forEach(item => {
    item.title = item.name;
    item.value = item.code;
    if (item.children) {
      treeData(item.children);
    }
  });
};

export default {
  namespace: 'sysmenu',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/menu' || location.pathname === '/sys/menu/') {
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
      const param = { ...page, ...payload };
      const { code, result } = yield call(queryList, param);
      if (result && code === 10000) {
        treeData(result)
        yield put({ type: 'updateState', payload: { menuTreeData:result } });
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

    // 获取api
    * loadApi(_, { call }) {
      return  yield call(loadApi);
    },

    // 验证编码是否唯一
    * checkCode({payload} , { call }) {
      return  yield call(checkCode,payload);
    },

    // 验证Url是否唯一
    * checkUrl({payload} , { call }) {
      return  yield call(checkUrl,payload);
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
