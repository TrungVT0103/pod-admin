const ID_TOKEN_KEY = 'access_token'

export const getToken = () => {
  const cache = JSON.parse(localStorage.getItem('vma'))
  return cache.auth.access_token
}

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token)
}

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY)
}

export const getSystemDomain = () => {
  const cache = JSON.parse(localStorage.getItem('vma'))
  return cache.auth.systemDomain
}