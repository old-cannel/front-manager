import request from '@/utils/request';

const API_PREX = `/api/newproject`;

export async function queryDict() {
  return request(`${API_PREX}/dict/list`);
}
