import server from './api/api-services.js'
import { LoginModel, RegisterModel } from '../pages/static/login/login-model'
import { baseUrl } from './api/base-url'

export const LoginRequest = (model : LoginModel) => {
  return server({
    url: baseUrl + 'OnlineUser/OnlineUserLogin',
    method: 'POST',
    data: model,
    headers: {
      isLoading: false
    }
  })
}

export const RegisterRequest = (model : RegisterModel) => {
  return server({
    url: baseUrl + 'OnlineUser/OnlineUserRegister',
    method: 'POST',
    data: model,
    headers: {
      isLoading: false
    }
  })
}



export const RouterRequest = (id: number) => {
  return server({
    url: baseUrl + `RolePageMapping/GetPageByRoleId?id=${id}`,
    method: 'GET',
    // data: model,
    headers: {
      isLoading: false
    }
  })
}
