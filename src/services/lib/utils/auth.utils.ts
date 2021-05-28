import {setCookie, getCookie} from 'react-use-cookie'

export const authenticated = () => {
  const token = getCookie('token')
  if (token && token.length) {
    return true
  } else {
    return false
  }
}

export const getUserName = () => {
  return getCookie('userName')
}

export const loginInfo = (data:any, callback:any) => {
  console.log(data)
  setCookie('token', data.token, {days: 7})
  setCookie('userName', data.userName)
  setCookie('customerId', data.customerId)
  callback()
}

export const logout = (callback: any) => {
  callback()
  setCookie('token', '')
  setCookie('userName', '')
}
