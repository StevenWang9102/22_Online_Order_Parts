import React, {useEffect, useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import {Button, Checkbox, Form, InputNumber, Modal, Row} from 'antd'
import {SuborderCommonPresentation} from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-presentation'
import pdfGenerate from "../pdf-generate/pdfGenerate";
import { checkMachineUserName } from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'

export const PackagingPrintQrModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any}) => {
  const {visible, onCancel, data, machine} = props
  const [count, setCount] = useState<any>()
  const [isVisible, setIsVisible] = useState(false)
  const [barcodeOptions, setBarcodeOptions] = useState([])
  const [barcodeOptionsList, setBarcodeOptionsList] = useState([])
  const [barcodeCheckbox, setBarcodeCheckbox] = useState<any>()
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    checkMachineUserName(visible, machine, setIsVisible, onCancel)
  }, [props.visible])

  useEffect(() => {
    if (data?.suborderId) {
      console.log(data)
      const calcCount = data.receivedQuantity / (data.product?.packagingType?.quantity || 999999999)
      setCount(Math.floor(calcCount) + 1)
      getBarcodeFromApi()
    }
  }, [data])

  const getBarcodeFromApi = () => {
    if (data?.suborderId) {
      ApiRequest({
        url: 'Box/GetAllBox?suborderId=' + data.suborderId,
        method: 'get'
      }).then(res => {
        const responseData = res.data.data
        responseData.sort((a: any, b: any) => a.sequence - b.sequence)
        const barCodeArr: any = []
        const barcodeOptionsData = responseData.map((row: any) => {
          barCodeArr.push(row.barCode)
          return {
            value: row.barCode,
            label: row.barCode
          }
        })
        setBarcodeOptionsList(barCodeArr)
        setBarcodeOptions(barcodeOptionsData)
      })
    }
  }

  const onGenerate = () => {
    if (data.suborderId && count) {
      ApiRequest({
        url: 'Box/GenerateBarCode?suborderId=' + data.suborderId + '&count=' + count,
        method: 'post',
      }).then(res => {
        console.log(res)
        setCount(null)
        getBarcodeFromApi()
      })
    }
  }

  const onPrint = () => {
    console.log(barcodeCheckbox)
    // SweetAlertService.successMessage(barcodeCheckbox.join(', '))
    const product = data.product.productName
    const a = barcodeCheckbox.map((res:string)=>{
      return{
        barcode: res,
        productName: product
      }
    })
    console.log(a,'a')
    pdfGenerate(a)
  }

  const onChangeCount = (value: any) => setCount(value)

  const onChangeBarcodeCheckbox = (list: any) => {
    setBarcodeCheckbox(list)
    setIndeterminate(!!list.length && list.length < barcodeOptionsList.length)
    setCheckAll(list.length === barcodeOptionsList.length)
  }

  const onCheckAllChange = (e: any) => {
    setBarcodeCheckbox(e.target.checked ? barcodeOptionsList : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  return (
    <Modal destroyOnClose={true} title="打印条形码/Print QR" visible={isVisible} onCancel={onCancel} width={1000} footer={false}>
      <SuborderCommonPresentation data={data} />
      <Row>
        <Form validateMessages={{required: 'required'}} id="printQrModalForm">
          <br/>
          <Form.Item label="条形码数量/BarCode Stickers Count">
            <InputNumber value={count} onChange={onChangeCount} />
            <Button type="primary" disabled={!count} style={{marginLeft: '1rem'}} onClick={onGenerate}>生成/Generate new</Button>
          </Form.Item>
          <Form.Item label="已生成/Generated Barcode">
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              全选/Check all
            </Checkbox>
            <Checkbox.Group value={barcodeCheckbox} onChange={onChangeBarcodeCheckbox} options={barcodeOptions} />
            <Button type="primary" disabled={!barcodeCheckbox?.length} style={{margin: '1rem'}} onClick={onPrint}>打印/Print</Button>
          </Form.Item>
        </Form>
      </Row>
    </Modal>
  )
}
