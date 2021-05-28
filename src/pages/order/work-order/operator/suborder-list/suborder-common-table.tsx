import React from 'react'
import CommonTable from '../../../../../components/common/common-table'
import ItipsForProduct from '../../../../../components/common/i-tips/product'

const SuborderCommonTable = (props: {isPackaging?: boolean, selectedMachine: any, tableData: any, getStatusButton: any}) => {
  const {isPackaging, selectedMachine, tableData, getStatusButton} = props

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        product: row.workOrder?.product,
        productId: row.workOrder?.product?.productId,
        productName: row.workOrder?.product?.productName,
        suborderStatusName: row.suborderStatus?.suborderStatusName,
        completedDate: row.completedDate && (new Date(row.completedDate + '.000Z')).toDateString(),
        requiredDate1: row.workOrder?.requiredDate,
        requiredDate: row.workOrder?.requiredDate && (new Date(row.workOrder?.requiredDate + '.000Z')).toLocaleDateString(),
      })
    })
    return renderData
  }

  return (
    <CommonTable
      title={
        (isPackaging ? '打包列表/Packaging' : '子工单列表/Suborder') +
        ' List ' +
        (selectedMachine ? `(Machine: ${selectedMachine.machineName})` : '')
      }
      initData={getRenderData(tableData)}
      column={[
        { title: '产品/Product', field: 'productName', render: (rowData: any) => <ItipsForProduct id={rowData.productId} label={rowData.productName} /> },
        { title: '需要日期/REQ Date', field: 'requiredDate1', render: (rowData: any) => rowData.requiredDate },
        { title: '原数量/Original Qty', field: 'orginalQuantity' },
        { title: '接受数量/Received Qty', field: 'receivedQuantity' },
        { title: '完成数量/Completed Qty', field: 'completedQuantity' },
        { title: '备注/Comments', field: 'comments' },
        {
          title: '状态/Status',
          sorting: false,
          defaultFilter: ['1', '2', '3'],
          lookup: { '-1': '挂起/Pending', 1: '等待/Await', 2: '进行/Proc', 3: '暂停/Pause', 4: '未准备好/NotReady', 9: '部分完成/PartlyComp', 10: '完成/Comp', 0: '取消/Canc' },
          customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.suborderStatusId?.toString()) : true,
          render: (rowData:any) => (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>{rowData.suborderStatusName}</div>
              <div style={{marginLeft: '1rem', textAlign: 'right'}}>{getStatusButton(rowData)}</div>
            </div>
          ),
        },
      ]}
    />
  )
}

export default SuborderCommonTable
