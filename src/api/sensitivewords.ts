import { get, post } from '@/utils/request'

export function querySensitiveWordsHitRecord<T>(currentPage: number, pageSize: number, startTime: string | null, endTime: string | null, searchText: string | null) {
  return get<T>({
    url: 'dashboard/sensitiveWords/hitRecord',
    data: {
      currentPage: currentPage,
      pageSize: pageSize,
      startTime: startTime,
      endTime: endTime,
      searchText: searchText,
    }
  })
}

export function querySensitiveWordsPage<T>(currentPage: number, pageSize: number, searchText: string | null) {
  return get<T>({
    url: 'dashboard/sensitiveWords/pageList',
    data: {
      currentPage: currentPage,
      pageSize: pageSize,
      searchText: searchText,
    }
  })
}

export function sensitiveWordCreate<T = any>(
    params: {
      id: number | null
      category: string
      word: string
    },
) {
  return post<T>({
    url: 'dashboard/sensitiveWords/add',
    data: params,
  })
}

export function sensitiveWordDelete<T = any>(id: number) {
  return post<T>({
    url: 'dashboard/sensitiveWords/delete',
    data: {
      id: id
    },
  })
}



export function sensitiveWordModify<T = any>(
    params: {
      id: number | null
      category: string
      word: string
    },
) {
  return post<T>({
    url: 'dashboard/sensitiveWords/modify',
    data: params,
  })
}

