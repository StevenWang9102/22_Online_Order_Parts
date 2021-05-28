import server from './api/api-services.js'
import {LoginModel} from '../pages/static/login/login-model'
import { baseUrl } from './api/base-url'

export const FetchOrdersRequest = () => {
  return server({
    url: baseUrl + 'OrderFromCustomer/GetOrdersFromCustomer',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchOrdersByIdRequest = (id: number) => {
  return server({
    url: baseUrl + `OrderFromCustomer/GetOrdersFromCustomer?id=${id}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchAllCustomersRequest = () => {
  return server({
    url: baseUrl + 'Customer/GetAllCustomer',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchOneCustomerRequest = (id: number) => {
  return server({
    url: baseUrl + `Customer/GetCustomerById?id=${id}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchAllOrderStatusRequest = () => {
  return server({
    url: baseUrl + 'OrderStatus/GetAllOrderStatus',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const PostOnlineOrder = (data: any) => {
  return server({
    url: baseUrl + 'OrderFromCustomer/AddOrders',
    method: 'POST',
    data: data
  })
}

export const UpdateOnlineOrder = (data: any) => {
  return server({
    url: baseUrl + 'OrderFromCustomer/UpdateWebOrder',
    method: 'PUT',
    data: data
  })
}

export const FetchQuotationRequest = (id: any) => {
  return server({
    url: baseUrl + `Quotation/GetQuotationByCustomerId?id=${id}&draft=0`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}


export const FetchAllEmployeeRequest = () => {
  return server({
    url: baseUrl + 'Employee/GetAllEmployee',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const  FetchAllCityRequest= () => {
  return server({
    url: baseUrl + 'City/GetAllCity',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const  FetchDeliverMethods= () => {
  return server({
    url: baseUrl + 'DeliveryMethod/GetAllDeliveryMethod',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const  UpdateUserPassword= (body: any) => {
  return server({
    url: baseUrl + 'OnlineUser/ChangeOnlineUserPassword',
    method: 'PUT',
    data: body,
    headers: {
      isLoading: false
    }
  })
}
