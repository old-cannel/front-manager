import {queryList,save,update,get,del,checkWorkNum,checkUserName} from '@/services/sys/user/service';
import {treeList} from '@/services/sys/organization/service';
import {roleList} from '@/services/sys/role/service';

import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  list: [],// table list
  current: {},
  pagination: {},// 分页
  filterKey: Math.random(),
  roleList:[],
  orgList:[],
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
  namespace: 'sysuser',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/user' || location.pathname === '/sys/user/') {
          const state = { ...initState, ...{ pageKey: Math.random() } };
          dispatch({ type: 'updateState', payload: state });
          dispatch({ type: 'initEdit' });
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

    * initEdit ({ payload = {} }, { call, put }) {
      const { code, result } = yield call(treeList, payload);
      if (code === 10000) {
        treeData(result)
        yield put({ type: 'updateState', payload: { orgList: result } });
      }
      const roleListResult = yield call(roleList, payload);
      if(roleListResult.code===10000){
        yield put({ type: 'updateState', payload: { roleList: roleListResult.result } });
      }
    },

    // 验证工号唯一性
    * checkWorkNum ({ payload = {} }, { call }) {
      return  yield call(checkWorkNum, payload);
    },

    // 验证用户名唯一性
    * checkUserName ({ payload = {} }, { call }) {
      return  yield call(checkUserName, payload);
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
