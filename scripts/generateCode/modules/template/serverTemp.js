import request from '@/utils/request';

const APIPREX = '/pipe-gallery';


//分页
export async function queryList(params) {
  const url =#{QUERYLISTURL}
  return request(url, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//保存
export async function save(params) {
  const url =#{SAVEURL}
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

//修改
export async function update(params) {
  const url =#{UPDATEURL};
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

//删除
export async function del(params) {
  const url =#{DELETEURL};
  return request(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });
}

//获取详情
export async function get(params) {
  const url =#{GETURL};
  return request(url);
}