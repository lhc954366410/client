// 运行时配置
import { message } from 'antd/es';
import type { RequestConfig } from 'umi';
import showError from './utils/showError';

export const request: RequestConfig = {
  timeout: 1000 * 60 * 60,
  // other axios options you want
  errorConfig: {
    errorHandler(response) {
      message.error(response.message);
    },
    errorThrower() {},
  },
  requestInterceptors: [
    (url, options) => {
      // console.log('request interceptor', url, options);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        authorizationtoken: user.token,
      };
      return { url: 'http://localhost:3000/api' + url, options };
    },
  ],
  responseInterceptors: [
    (response) => {
      //这里统一处理后端报错
      if (response.data.code !== 200) {
        showError(response.data);
      }

      return response;
    },
  ],
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};
