import request from '@/utils/request';
import { API_PREX } from '@/services/api';

// 获取数据
export async function getData() {
  const url = `${API_PREX}/homepage/getData`;
  return request(url);
}

// 获取表格
export async function getTable() {
  const url = `${API_PREX}/homepage/getTable`;
  return request(url);
}
