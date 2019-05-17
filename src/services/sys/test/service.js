import request from '@/utils/request';

const APIPREX = '/pipe-gallery';


// 分页
export async function queryList(params) {
  const url =`${APIPREX}/systest/list?size=${params.size}&current=${params.current}&limit=${params.limit?params.limit:10}`
  return request(url, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 保存
export async function save(params) {
  const url =`${APIPREX}/systest/save`
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 修改
export async function update(params) {
  const url =`${APIPREX}/systest/update`;
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 删除
export async function del(params) {
  const url =`${APIPREX}/systest/del`;
  return request(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });
}

// 获取详情
export async function get(params) {
  const url =`${APIPREX}/systest/get/${params.id}`;
  return request(url);
}
