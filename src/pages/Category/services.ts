import { request } from "@umijs/max";


export const addApi = (data: any) => {
    return request('/categories/add', {
        method: 'POST',
        data: data,
    });
}