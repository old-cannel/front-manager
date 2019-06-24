import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList() {
  const url =`${API_PREFIX}/sys/menu/listTree`
  return request(url);
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/menu/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/menu/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/menu`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/menu/${params.id}`;
  return request(url);
}

// 验证code
export async function checkCode(params) {
  const url =`${API_PREFIX}/sys/menu/checkCode?id=${params.id}&code=${params.code}`;
  return request(url);
}

// 验证url
export async function checkUrl(params) {
  const url =`${API_PREFIX}/sys/menu/checkUrl?url=${params.url}&id=${params.id}`;
  return request(url);
}

// 获取所有api
export async function loadApi() {
  const url = `${API_PREFIX}/sys/api/list`;
  return request(url, {
    method: 'POST',
    data: JSON.stringify({})
  });
}
