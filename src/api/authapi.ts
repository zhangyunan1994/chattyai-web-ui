import { get, post } from '@/utils/request'

export function authLogin<T>(username: string, password: string) {
  return post<T>({
    url: 'auth/login/withPassword',
    data: {
      username,
      password,
    },
  })
}

export function checkToken<T>() {
  return get<T>({
    url: 'auth/checkToken',
  })
}