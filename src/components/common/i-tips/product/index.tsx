import React, { useState } from 'react'
import { Image, Popover } from 'antd'
import { ApiRequest } from '../../../../services/api/api'
import getImage from '../../common-form/common-image'

interface Iprops{
    id:number,
    label:string,
}

const ItipsForProduct: React.FC<Iprops> = (props) => {
  const [visible, setVisible] = useState(false)
  const [getData, setGetData] = useState<any>({})

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
    props.id && ApiRequest({
      url: 'Product/GetProductById?id=' + props.id,
      method: 'get',
      isShowSpinner: false
    }).then(res => {
      setGetData(res.data.data)
    }).catch(reason => {
      setGetData({productName: 'Inactive product'})
  })
  }

  const getRowRender = (name: string, rowData: any) => (
    <div style={{wordWrap: 'break-word', display: 'flex'}}>
      <div style={{minWidth: '50px'}}>
        <strong>{name}:</strong>
      </div>
      <div>
        <span style={{wordBreak: 'break-all'}}>&nbsp;&nbsp;{rowData}</span>
      </div>
    </div>
  )


  const content = (
    <div style={{width: '250px'}}>
      {getRowRender('customer', getData?.customer&&getData.customer.company)}
      {getRowRender('Description', getData?.description)}
      {getRowRender('MinOrderQty', getData?.minOrderQuantity)}
      {getRowRender('MarginOfError', getData?.marginOfError)}
      {getRowRender('ProductMsl', getData?.productMsl)}
      {getRowRender('SemiMsl', getData?.semiMsl)}
      {getImage(getData?.images)}
    </div>
  )

  return (
    <Popover
      content={content}
      placement="right"
      title={<h4 style={{textAlign: 'center'}}>{getData?.productName || 'Product'}</h4>}
      trigger="hover"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <a><b><i>{props.label}</i></b></a>
    </Popover>
  )
}

export default ItipsForProduct
