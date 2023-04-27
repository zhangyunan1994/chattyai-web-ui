import { get, post } from '@/utils/request'

export function queryChatHistoryRecord<T>(currentPage: number, pageSize: number, startTime: string | null, endTime: string | null, searchText: string | null) {
  return get<T>({
    url: 'dashboard/chat/pageList',
    data: {
      currentPage: currentPage,
      pageSize: pageSize,
      startTime: startTime,
      endTime: endTime,
      searchText: searchText,
    }
  })
}
