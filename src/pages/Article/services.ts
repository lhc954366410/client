import { request } from '@umijs/max';

export const getCategoriesApi = (data: any) => {
  return request<any>('/categories/selectList', {
    method: 'POST',
    data: data,
  });
};
