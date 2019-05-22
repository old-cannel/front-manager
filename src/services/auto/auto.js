import request from '@/utils/request';
import Api  from '@/services/api';

const { pages, del, tableList,tableColumnList,add,check } = Api.auto;

//列表
export async function queryList(payload) {
  return request(pages, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

//删除
export async function tableDel(payload={}) {
  return request(`${del}${payload.id}`);
}

//数据库表信息
export async function tableInfo(payload) {
  return request(tableList);
}

//列表
export async function tableColumnInfo(payload) {
  return request(tableColumnList, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

//列表
export async function save(payload) {
  return request(add, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

//列表
export async function checkRouter(payload) {
  return request(check, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}
