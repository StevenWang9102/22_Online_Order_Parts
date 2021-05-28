import axios from './api-services.js'
import { allUrls, urlType } from './api-urls'
import { AxiosRequestConfig } from 'axios'
import { baseUrl } from './base-url'

axios.defaults.baseURL = baseUrl

const JadcupAxios = axios
const urlInfo = allUrls

const getRequestConfigFromProps = (props: ApiRequestPropsInterface) => {
  const url = getUrlFromProps(props)
  const method = getMethodFromProps(props)
  let isShowSpinner = true
  if ((props.type === urlType.Get || props.type === urlType.GetById || props.method === 'get') && !props.isShowSpinner) {
    isShowSpinner = false
  }
  const requestConfig: AxiosRequestConfig = {
    url: url,
    method: method,
    headers: {isLoading: isShowSpinner}
  }
  if (props.data) {
    requestConfig.data = props.data
  }
  return requestConfig
}

const getUrlFromProps = (props: ApiRequestPropsInterface) => {
  if (props.type === urlType.Get && props.getAllUrl) {
    return props.getAllUrl
  }
  if (props.url) {
    return props.url
  }
  let url
  if (props.urlInfoKey && props.type) {
    url = urlInfo[props.urlInfoKey][props.type]
    if (props.type === urlType.Delete || props.type === urlType.GetById) {
      url += '?id=' + (props.dataId || props.data[props.urlInfoKey + 'Id'])
    }
  }
  return url
}

const getMethodFromProps = (props: ApiRequestPropsInterface) => {
  if (props.method) {
    return props.method.toUpperCase()
  }
  const mappingMethod: any = {
    [urlType.Get]: 'get',
    [urlType.Create]: 'post',
    [urlType.Update]: 'put',
    [urlType.Delete]: 'delete',
  }
  return mappingMethod[props.type] || 'GET'
}

const handleCallBackFunction = async (props: ApiRequestPropsInterface, result: any) => {
  let callBackResult
  if (props.type === urlType.Get) {
    callBackResult = result
  }
  if ((props.type === urlType.Create || props.type === urlType.Update) && result) {
    // request getAll api function only when adding new row successfully
    const getUrl = props.getAllUrl || urlInfo[props.urlInfoKey][urlType.Get]
    callBackResult = await JadcupAxios.get(getUrl)
  }
  if (callBackResult) {
    props.callBackFunction(callBackResult.data.data)
  }
}

interface ApiRequestPropsInterface {
  urlInfoKey?: any
  type?: any
  url?: string
  getAllUrl?: string
  method?: string
  data?: any
  dataId?: number
  callBackFunction?: any,
  isShowSpinner?: boolean
}

export const ApiRequest = async (props: ApiRequestPropsInterface) => {
  const requestConfig = getRequestConfigFromProps(props)
  // console.log(props)
  // console.log(requestConfig)
  const result: any = await JadcupAxios(requestConfig)
  if (props.callBackFunction) {
    await handleCallBackFunction(props, result)
  }
  return result
}

export default JadcupAxios
