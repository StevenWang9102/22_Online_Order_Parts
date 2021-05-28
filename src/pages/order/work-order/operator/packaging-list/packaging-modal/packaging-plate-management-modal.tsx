import React, {useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import { Button, Modal } from 'antd'
import {urlKey} from '../../../../../../services/api/api-urls'
import CommonTablePage from '../../../../../../components/common/common-table-page'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'

export const PackagingPlateManagementModal = (props: {visible: any, onOk: any, onCancel: any}) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const {visible, onCancel} = props

  const onNewTemporaryPlate = () => {
    ApiRequest({
      url: 'Plate/AddTemporaryPlate',
      method: 'post',
      isShowSpinner: true
    }).then(_ => {
      ApiRequest({
        url: 'Plate/GetAllPlate',
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        setTriggerResetData(!triggerResetData)
      })
    })
  }

  return (
    <Modal destroyOnClose={true} title="托盘管理/Plate Management" visible={visible} onCancel={onCancel} width={1000} footer={false}>
      <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
        <Button
          type="primary"
          onClick={onNewTemporaryPlate}
          style={{marginRight: '2rem'}}
        > 新建临时托盘/New Temporary Plate</Button>
      </div>
      <CommonTablePage
        title={''}
        urlInfoKey={urlKey.AvailablePlate}
        triggerResetData={triggerResetData}
        actionButtons={[
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: '更改/Change',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              ApiRequest({
                url: 'Plate/UpdatePlatePackageState?plateId=' + rowData.plateId + '&package=' + (rowData.package ? 0 : 1),
                method: 'put'
              }).then(_ => {
                setTriggerResetData(!triggerResetData)
              })
            }
          },
          {
            icon: 'ghost', //Button attr of Ant design (danger, ghost)
            tooltip: '打印/Pr',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              console.log(rowData)
              if (rowData.plateTypeId === 2) {
                SweetAlertService.successMessage(rowData.plateCode)
              } else {
                SweetAlertService.errorMessage('Only temporary plate can be printed.')
              }
            }
          }
        ]}
        mappingRenderData={(data: any) => data.map((row: any) => ({...row, package: row.package ? 1 : 0}))}
        column={[
          {title: '托盘码/Plate Code', field: 'plateCode'},
          {title: '是否可供打包选择/For Package', field: 'package', lookup: {0: '否/No', 1: '是/Yes'}, defaultSort: 'desc'},
        ]}
        isNotEditable={true}
        isNotAddable={true}
        isNotDeletable={true}
      />
    </Modal>
  )
}
