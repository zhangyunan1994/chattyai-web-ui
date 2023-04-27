import {get, post} from "@/utils/request";

export function openaiPageList<T>(currentPage: number, pageSize: number) {
  return get<T>({
    url: 'dashboard/openai/key/pageList',
    data: {
      currentPage: currentPage,
      pageSize: pageSize,
    }
  })
}

export function openaiCreate<T = any>(
    params: {
      id: number | null
      accountId: string
      openaiKey: string
      status: number
      expiredTime: string
    },
) {
  return post<T>({
    url: 'dashboard/openai/key/add',
    data: params,
  })
}

export function openaiModify<T = any>(
    params: {
      id: number | null
      accountId: string
      openaiKey: string
      status: number
      expiredTime: string
    },
) {
  return post<T>({
    url: 'dashboard/openai/key/modify',
    data: params,
  })
}

export function openaiDelete<T = any>(id: number) {
  return post<T>({
    url: 'dashboard/openai/key/delete',
    data: {
      id: id
    },
  })
}
