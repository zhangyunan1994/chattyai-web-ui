import {get, post} from "@/utils/request";

export function userPageList<T>(currentPage: number, pageSize: number) {
  return get<T>({
    url: 'dashboard/user/pageList',
    data: {
      currentPage: currentPage,
      pageSize: pageSize,
    }
  })
}

export function userCreate<T = any>(
    params: {
      id: number | null
      nickname: string
      username: string
      passwordHash: string
      email: string
      avatar: string
      status: number
      description: string,
    },
) {
  return post<T>({
    url: 'dashboard/user/add',
    data: params,
  })
}

export function userModify<T = any>(
    params: {
      id: number | null
      nickname: string
      username: string
      passwordHash: string
      email: string
      avatar: string
      status: number
      description: string,
    },
) {
  return post<T>({
    url: 'dashboard/user/modify',
    data: params,
  })
}
