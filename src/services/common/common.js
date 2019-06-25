import {request} from '@/utils/request';
import {API_PREFIX} from '@/services/api'

export async function queryDict() {
  return request(`${API_PREFIX}/dictCommon/list`);
}


