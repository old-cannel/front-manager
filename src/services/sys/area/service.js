import {request} from '@/utils/request';
import { API_PREFIX } from '@/services/api';


// 分页
export async function queryList(params) {
  const url =`${API_PREFIX}/sys/area?size=${params.size?params.size:10}&current=${params.current}`
  return request(url, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${API_PREFIX}/sys/area/add`
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${API_PREFIX}/sys/area/update`;
  return request(url, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${API_PREFIX}/sys/area`;
  return request(url, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${API_PREFIX}/sys/area/${params.id}`;
  return request(url);
}


export async function listTree() {
  const url =`${API_PREFIX}/sys/area/listTree`;
  return request(url);
}

export async function listTreeHasCounty() {
  const url =`${API_PREFIX}/sys/area/listTreeHasCounty`;
  return request(url);
}

// 获取详情
export async function checkCode(params) {
  const url =`${API_PREFIX}/sys/area/checkCode?code=${params.code}&id=${params.id}`;
  return request(url);
}

// 获取详情
export async function getAreaByType(params) {
  const url =`${API_PREFIX}/sys/area/getAreaByType?type=${params.type}&code=${params.code}`;
  return request(url);
}

// 根据区域id 获取对于上级所有id
export async function getAreaFullIdById(params) {
  const url =`${API_PREFIX}/sys/areaCommon/getFullId?areaId=${params.areaId}`;
  return request(url);
}
