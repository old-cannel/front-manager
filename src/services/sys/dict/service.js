import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREFIX}/sys/dict?size=${params.size?params.size:10}&current=${params.current}`
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/dict/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/dict/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/dict`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/dict/${params.id}`;
  return request(url);
}

// 获取详情
export async function checkType(params) {
  const url =`${API_PREFIX}/sys/dict/checkType?id=${params.id}&type=${params.type}`;
  return request(url);
}

// 获取详情
export async function getAllDict() {
  const url =`${API_PREFIX}/sys/dict/allType`;
  return request(url);
}
