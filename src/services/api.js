import { request, requestNoAuthorize } from '@/utils/request';

// 接口请求前缀
export const API_PREFIX = `/api/demo`;
// 上传文件地址
export const UPLOAD_URL = `/api/upload/files`;
// 文件回显前缀
export const FILE_DISPLAY_PREFIX = `/api/upload/files`;

/**
 * 登录
 */
export async function loginJwt(params) {
  return requestNoAuthorize(`${API_PREFIX}/loginjwt`, {
    method: 'post',
    requestType: 'form',
    data: params,
  });
}
/**
 * 退出登录
 */
export async function logoutJwt() {
  return requestNoAuthorize(`${API_PREFIX}/logoutjwt`, {
    method: 'post',
  });
}

/**
 * 获取用户信息
 */
export async function queryCurrent() {
  return request(`${API_PREFIX}/token/user`, {
    method: 'POST',
  });
}

/**
 * 获取用户菜单 操作权限
 */
export async function queryAuthorize() {
  return request(`${API_PREFIX}/token/user/menus`, {
    method: 'POST',
  });
}
