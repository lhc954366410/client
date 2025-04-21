// 运行时配置
import type { RequestConfig } from 'umi';

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler(){
    },
    errorThrower(){
    }
  },
  requestInterceptors: [(url, options )=>{
    // console.log('request interceptor', url, options);
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    }    
    return { url:'http://localhost:3000' + url, options }

  }],
  responseInterceptors: [
    (response) => {
      // console.log('response interceptor', response);
      if (response.status === 200) {
        return response;
      }
      throw new Error('请求失败');
    }
  ]
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
