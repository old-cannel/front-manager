import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREFIX}/sys/user?size=${params.size?params.size:10}&current=${params.current}`
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/user/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/user/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/user`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 启用禁用
export async function enabled(params) {
  const url =`${API_PREFIX}/sys/user/enabled`;
  return request(url, {
    method: 'post',
    data: JSON.stringify(params),
  });
}

// 启用禁用
export async function resetPassword(params) {
  const url =`${API_PREFIX}/sys/user/resetPassword`;
  return request(url, {
    method: 'post',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/user/${params.id}`;
  return request(url);
}


export async function checkWorkNum(params) {
  const url =`${API_PREFIX}/sys/user/checkWorkNum?id=${params.id}&workNum=${params.workNum}`;
  return request(url);
}
export async function checkUserName(params) {
  const url =`${API_PREFIX}/sys/user/checkUserName?id=${params.id}&userName=${params.userName}`;
  return request(url);
}

export async function getUserAllList() {
  const url =`${API_PREFIX}/sys/user/allList`;
  return request(url);
}

