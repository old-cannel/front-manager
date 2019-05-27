import { queryList, tableDel, tableInfo,tableColumnInfo,save,checkRouter } from '@/services/auto/auto';
import { generateCode } from '@/utils/utils';
import { message } from 'antd';

const requestResolver = (response, success, fail) => {
  if( typeof response === 'string') {
    response = JSON.parse(response);
  }
  if (response.code === 10000) {
    success && success(response.result);
  } else {
    fail && fail(response);
  }
};

export default {
  namespace: 'auto',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/auto/completeList') {
          dispatch({ type: 'fetch' });
          dispatch({
            type: 'save',
            payload: {
              filterKey: new Date(),
            }
          })
        }
      });
    },
  },

  effects: {
    *fetch({payload={}}, {call, put}) {
      const response = yield call(queryList, {});
      if (response.code !== 10000) {
        message.error('数据加载失败');
        return;
      }
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.result.records || [],
            pagination: {
              current: response.result.current || 1,
              pageSize: response.result.size || 10,
              total: response.result.total || 0,
            },
          },
        }
      });
    },
    //删除
    *remove({payload, success, fail}, {call, put}) {
      const response = yield call(tableDel, payload);
      requestResolver(response, success, fail);
    },
    //新增仓位信息
    *add({payload, success, fail}, {call, put}) {
      const response = yield call(save, payload);
      requestResolver(response, success, fail);
    },
    //数据表字段
    *tableColumn({payload, success, fail}, {call, put}) {
      const response = yield call(tableColumnInfo, payload);
      requestResolver(response, success, fail);
    },
    //数据库表信息
    *tableList({payload, success, fail}, {call, put}) {
      const response = yield call(tableInfo, payload);
      yield put({
        type: 'save',
        payload: {
          tableData: response.result || [],
        }
      });
    },
    //新增页面
    *addFrame({payload, success, fail}, {call, put}) {
      const response = yield call(generateCode, payload);
      requestResolver(response, success, fail);
    },
    //新增仓位信息
    *check({payload, success, fail}, {call, put}) {
      const response = yield call(checkRouter, payload);
      requestResolver(response, success, fail);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
