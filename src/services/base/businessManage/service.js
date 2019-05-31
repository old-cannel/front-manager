import request from '@/utils/request';
import { API_PREX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREX}/base/businessManage?size=${params.size?params.size:10}&current=${params.current}`;
  return request(url, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREX}/base/businessManage/add`;
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREX}/base/businessManage/update`;
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREX}/base/businessManage`;
  return request(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREX}/base/businessManage/${params.id}`;
  return request(url);
}
