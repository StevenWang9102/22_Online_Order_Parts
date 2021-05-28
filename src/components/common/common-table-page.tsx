import React, { useEffect, useState } from 'react'
import CommonTable from './common-table'
import { ApiRequest } from '../../services/api/api'

export interface CommonTablePagePropsInterface {
  urlInfoKey?: string
  getAllUrl?: string
  title?: string
  column?: any
  isNotDeletable?: boolean
  isNotEditable?: boolean
  isNotAddable?: boolean
  actionButtons?: any
  addRowButtonName?: string
  mappingUpdateData?: any
  mappingRenderData?: any
  restRequestOptions?: any
  triggerResetData?: any
  notAllowUpdate?: boolean
  setRowData?: any
  rowData?: any
  addQuotation?: boolean
  isShowSpinnerOnInit?: boolean
  isEnableSelect?: boolean
  onSelectionChange?: any
}

export const CommonTablePage = (props: CommonTablePagePropsInterface) => {
  // For adding more options defined in api.ts with special purpose, like self-defined getAllUrl
  const restRequestOptionsFromProps = props.restRequestOptions || {}
  const urlInfoKey = props.urlInfoKey
  const [data, setData] = useState()
  const [column, setColumn] = useState(props.column)
  const [title, setTitle] = useState(props.title)

  useEffect(() => {
    let isCancelled = false
    if (!isCancelled) {
      getAll()
    }
    return () => {
      isCancelled = true
    }
  }, [props.triggerResetData, props.getAllUrl])

  const getAll = () => {
    const requestOptionsForGET: any = {
      type: 'get',
      isShowSpinner: true
    }
    if (props.getAllUrl) {
      requestOptionsForGET.getAllUrl = props.getAllUrl
    }
    request(requestOptionsForGET)
  }

  const setTableData = async (data: any) => {
    data = props.mappingRenderData ? (await props.mappingRenderData(data)) : data
    setData(data)
  }

  const updateData = async (newData: any[], dataDetail: any, type: string) => {
    // For mapping from table data to api request data
    dataDetail = props.mappingUpdateData ? (await props.mappingUpdateData(dataDetail, type)) : dataDetail
    if (dataDetail === 'resolve') {
      return Promise.resolve()
    }
    if (dataDetail) {
      return await request({type, data: dataDetail})
    } else {
      return Promise.reject()
    }
  }

  const request = (requestProps: any) => {
    return ApiRequest({
      urlInfoKey: urlInfoKey,
      callBackFunction: setTableData,
      ...requestProps,
      ...restRequestOptionsFromProps
    })
  }

  const editable = () => {
    return !(
      props.isNotDeletable && props.isNotEditable &&
      props.isNotAddable && (
        !props.actionButtons ||
        !props.actionButtons.filter((row: any) => !row.isFreeAction).length ||
        props.isEnableSelect
      )
    )
  }

  return (
    <div>
      <CommonTable
        title={title}
        column={column}
        initData={data}
        editable={editable()}
        updateData={updateData}
        isNotDeletable={props.isNotDeletable}
        isNotEditable={props.isNotEditable}
        isNotAddable={props.isNotAddable}
        actionButtons={props.actionButtons}
        addRowButtonName={props.addRowButtonName}
        notAllowUpdate={props.notAllowUpdate}
        setTableData= {setTableData}
        isEnableSelect={props.isEnableSelect}
        onSelectionChange={props.onSelectionChange}
      />
    </div>
  )
}

export default CommonTablePage
