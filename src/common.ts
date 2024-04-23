import axios from 'axios';
import dayjs from 'dayjs';

import { BACKEND_URL } from './constant';

const codeMessage: Record<number, string> = {
  400: '用户没有权限（令牌错误）',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export const initRequest = () => {
  const instance = axios.create({
    timeout: 30000,
    withCredentials: false,
    responseType: 'json',
    baseURL: BACKEND_URL,
    validateStatus: () => {
      return true;
    },
  });

  // 从url里面获取到tenantId和accessToken，并添加到请求头里面
  instance.interceptors.request.use(async config => {
    const searchParams = new URLSearchParams(window.location.search);
    const tenantId = searchParams.get('tenantId');
    const accessToken = searchParams.get('accessToken');
    const expireTime = searchParams.get('expireTime');
    const refreshToken = searchParams.get('refreshToken');
    const refreshUrl = searchParams.get('refreshUrl');

    config.headers['tenantId'] = tenantId;

    // token 过期之后，需要用 refreshToken 重新刷新
    if (expireTime && dayjs().isAfter(dayjs(new Date(expireTime)))) {
      const result = await fetch(`${refreshUrl}/admin-api/system/auth/refresh-token?refreshToken=${refreshToken}`, {
        method: 'post',
        headers: {
          'Tenant-Id': localStorage.getItem('tenantId') || '',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => res.json());

      if (result.data) {
        const { accessToken, refreshToken, expiresTime } = result.data;
        // 将新的 accessToken/refreshToken/expireTime 存储到 url 中
        searchParams.set('accessToken', accessToken);
        searchParams.set('refreshToken', refreshToken);
        searchParams.set('expireTime', expiresTime);
        window.location.search = searchParams.toString();

        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } else if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(async response => {
    const { status } = response;
    if (status === 200) {
      if (response.data.code === 401) {
        // token过期，需要重新登录
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const refreshUrl = searchParams.get('refreshUrl');

        const result = await fetch(`${refreshUrl}/admin-api/system/auth/refresh-token?refreshToken=${refreshToken}`, {
          method: 'post',
          headers: {
            'Tenant-Id': localStorage.getItem('tenantId') || '',
            Authorization: `Bearer ${accessToken}`,
          },
        }).then(res => res.json());

        if (result.data) {
          const { accessToken, refreshToken, expiresTime } = result.data;
          // 将新的 accessToken/refreshToken/expireTime 存储到 url 中
          searchParams.set('accessToken', accessToken);
          searchParams.set('refreshToken', refreshToken);
          searchParams.set('expireTime', expiresTime);
          window.location.search = searchParams.toString();
        }
      }
      return Promise.resolve(response);
    } else {
      const errorText = codeMessage[status] || response.statusText || '请求错误';
      throw new Error(JSON.stringify({ message: errorText }));
    }
  });

  return instance;
};
