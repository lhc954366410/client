import { request } from "@umijs/max";


export const addApi = (data: any) => {
    return request('/categories/add', {
        method: 'POST',
        data: data,
    });
}

export const selectListApi = (data:any) =>{
    return request<any>('/categories/selectList', {
      method: 'POST',
      data: data,
    });
  }

  export const deleteApi = (id:number) =>{
    return request<any>('/categories/delete', {
      method: 'POST',
      data: {
        id
      },
    });
  }
  export const updateApi = (data: any) => {
    return request('/categories/update', {
        method: 'POST',
        data: data,
    });
}