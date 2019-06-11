import { request } from '@/utils/request';
import { API_PREFIX } from '@/services/api';

// 列表
export async function queryList(payload) {
  return request(`${API_PREFIX}/auto/completeList`, {
    method: 'POST',
    data: payload,
  });
}

// 删除
export async function tableDel(payload = {}) {
  return request(`${API_PREFIX}/auto/del/${payload.id}`);
}

// 数据库表信息
export async function tableInfo() {
  return request(`${API_PREFIX}/auto/tableList`);
}

// 列表
export async function tableColumnInfo(payload) {
  return request(`${API_PREFIX}/auto/tableColumnList`, {
    method: 'POST',
    data: payload,
  });
}

// 列表
export async function save(payload) {
  return request(`${API_PREFIX}/auto/tableInfoSave`, {
    method: 'POST',
    data: payload,
  });
}

// 列表
export async function checkRouter(payload) {
  return request(`${API_PREFIX}/auto/checkRouter`, {
    method: 'POST',
    data: payload,
  });
}
