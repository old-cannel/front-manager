import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREFIX}/sys/log?size=${params.size?params.size:10}&current=${params.current}`
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/log/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/log/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/log`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/log/${params.id}`;
  return request(url);
}
