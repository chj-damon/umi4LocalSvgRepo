import { isEmpty } from 'lodash-es';

import { initRequest } from '@/common';

export const fetchData = async (url: string, params = {}) => {
  const request = initRequest();
  request.defaults.headers.common['Content-Type'] = 'application/json';

  const { data: result } = await request({
    method: isEmpty(params) ? 'get' : 'post',
    url,
    data: params,
    // params: { goods: '红牛' }
  });

  if (result) {
    if (!result.success && result.code !== 20000) {
      throw new Error(JSON.stringify(result));
    } else {
      return result.data;
    }
  } else {
    throw new Error(JSON.stringify({ message: '接口未响应' }));
  }
};
