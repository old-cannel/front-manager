import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREFIX}/sys/role?size=${params.size?params.size:10}&current=${params.current}`
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/role/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/role/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/role`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/role/${params.id}`;
  return request(url);
}

export async function roleList() {
  const url =`${API_PREFIX}/sys/role/roleList`;
  return request(url);
}

// 角色下的菜单
export async function getRoleMenus(params) {
  const url =`${API_PREFIX}/sys/role/roleMenus/${params.id}`;
  return request(url);
}

// 获取菜单和操作
export async function getMenuAndOrganization() {
  const url =`${API_PREFIX}/sys/menu/getMenuAndOrganization`;
  return request(url);
}
