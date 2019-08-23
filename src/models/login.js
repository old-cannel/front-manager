import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { loginJwt, logoutJwt } from '@/services/api';
import { setAuthority } from '@/utils/authority';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call }) {
      const { code, result } = yield call(loginJwt, payload);
      if (code === 10000) {
        localStorage.setItem('authorization', result);
        setTimeout(() => {}, 1000);
        window.location.href = '/admin/';
      } else {
        localStorage.setItem('authorization', '');
      }
    },

    // 退出登录清除操作
    *logout(_, { put, call }) {
      if (localStorage.getItem('authorization')) {
        const { code, msg } = yield call(logoutJwt);
        if (code === 10000) {
          localStorage.setItem('authorization', '');
          yield put({
            type: 'updateState',
            payload: {
              currentUser: {},
              serviceMenus: [],
              operationCodes: [],
            },
          });
          yield put(
            routerRedux.push({
              pathname: '/user/login',
            })
          );
          message.success(msg);
        }
      } else {
        localStorage.setItem('authorization', '');
        yield put({
          type: 'updateState',
          payload: {
            currentUser: {},
            serviceMenus: [],
            operationCodes: [],
          },
        });
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
