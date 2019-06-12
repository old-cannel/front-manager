import request from '@/utils/request';

const API_PREFIX = `/api/newproject`;

export async function queryDict() {
  return request(`${API_PREFIX}/dict/list`);
}
