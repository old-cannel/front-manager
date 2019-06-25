import { request } from '@/utils/request';
import { API_PREFIX } from '@/services/api';

// 分页
export async function queryList(params) {
  const url = `${API_PREFIX}/sys/api/list`;
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url = `${API_PREFIX}/sys/api/add`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url = `${API_PREFIX}/sys/api/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url = `${API_PREFIX}/sys/api`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url = `${API_PREFIX}/sys/api/${params.id}`;
  return request(url);
}

// checkName
export async function checkName(params) {
  const url = `${API_PREFIX}/sys/api/checkName?id=${params.id}&name=${params.name}`;
  return request(url);
}

// checkUrl
export async function checkUrl(params) {
  const url = `${API_PREFIX}/sys/api/checkUrl?id=${params.id}&path=${params.path}&requestMethod=${params.requestMethod}`;
  return request(url);
}



