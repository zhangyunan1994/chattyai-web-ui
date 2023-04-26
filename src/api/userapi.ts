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
      username: string,
      passwordHash: string,
      email: string,
      avatar: string,
      description: string,
    },
) {
  return post<T>({
    url: 'dashboard/user/add',
    data: params,
  })
}
