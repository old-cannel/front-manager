/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import router from 'umi/router';

message.config({
  maxCount: 1,
});

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const { status, } = response;
  if (status === 401) {
    message.info(error.data.msg)
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return error.data;
  }
  message.info((error.data.msg || '服务异常'))
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return false;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return false;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

/**
 * 配置request请求时的默认参数
 */
export const request = extend({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: localStorage.getItem('authorization')
      ? localStorage.getItem('authorization')
      : '',
  },
  errorHandler,
})

request.interceptors.response.use((response) => {
  if (response.status === 200) {
    response.clone().json().then(({ code, msg }) => {
      if (code !== 10000) {
        message.error(msg);
      }
    });
  }
  return response;
});

/**
 * 请求不需要header的情况
 * @type {RequestMethod}
 */
export const requestNoAuthorize = extend({
  errorHandler,
});
