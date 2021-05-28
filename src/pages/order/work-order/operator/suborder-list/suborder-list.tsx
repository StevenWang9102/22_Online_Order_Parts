import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import {SuborderTakeModal} from './suborder-modal/suborder-take-modal'
import {SuborderCompleteModal} from './suborder-modal/suborder-complete-modal'
import SuborderCommonTable from './suborder-common-table'
import SuborderCommonMachineList from './suborder-common-machine-list'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'

const SuborderList:React.FC = () => {
  const myRef = useRef<any>(null)
  const [selectedMachine, setSelectedMachine] = useState<any>()
  const currentSelectedMachine: any = React.useRef()
  const [tableData, setTableData] = useState<any>([])
  const [selectRowData, setSelectRowData] = useState()
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [isTakeModalVisible, setIsTakeModalVisible] = useState(false)

  useEffect(() => {
    let isCancelled = false
    if (selectedMachine && !isCancelled) {
      currentSelectedMachine.current = selectedMachine
      setTableDataFromApi()
    }
    return () => {
      isCancelled = true
    }
  }, [selectedMachine])

  const setTableDataFromApi = () => {
    if (currentSelectedMachine) {
      ApiRequest({
        url: 'Suborder/GetSuborderByMachineId?id=' + currentSelectedMachine.current?.machineId,
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        setTableData(res.data.data)
        myRef.current.scrollIntoView({behavior: 'smooth'})
      })
    }
  }

  const togglePause = (subOrderId: any, isPause: boolean) => {
    ApiRequest({
      url: 'Suborder/' + (isPause ? 'Pause' : 'Unpause') + 'Suborder?id=' + subOrderId,
      method: 'put',
      isShowSpinner: true
    }).then(_ => {
      setTableDataFromApi()
    })
  }

  const getStatusButton = (rowData: any) => {
    if (rowData.suborderStatusId === 2) {
      return (
        <>
          <Button
            type='primary'
            onClick={() => commonShowModal(rowData, setIsCompleteModalVisible)}
            style={{width: 100, marginLeft: '1rem'}}
          > 完成/Comp </Button>
          <Button
            type='ghost'
            onClick={() => togglePause(rowData.suborderId, true)}
            style={{width: 100, marginTop: '1rem', marginLeft: '1rem'}}
          > 暂停/Pause </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 3) {
      return (
        <>
          <Button
            type='ghost'
            onClick={() => togglePause(rowData.suborderId, false)}
            style={{width: 100}}
          > 继续/Resu </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 1) {
      return (
        <>
          <Button
            style={{backgroundColor: '#10b00b', borderColor: '#10b00b', width: 100}}
            type='primary'
            onClick={() => commonShowModal(rowData, setIsTakeModalVisible)}
          > 取单/Take </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 4) {
      return <Button disabled={true} style={{width: 100}}> 取单/Take </Button>
    } else if (rowData.suborderStatusId === 10 || rowData.suborderStatusId === 9) {
      return rowData.completedDate ? (
        <div>
          {
            rowData.isSemiLast ? (
              <Button
                style={{backgroundColor: '#09a8e9', borderColor: '#09a8e9', width: 100}}
                type='primary'
                onClick={() => {
                  ApiRequest({
                    url: 'Box/GetAllBox?suborderId=' + rowData.suborderId,
                    method: 'get'
                  }).then((res: any) => {
                    SweetAlertService.successMessage(res.data.data[0].barCode)
                  })
                }}
              > 打印/Pr </Button>
            ) : null
          }
          <div style={{width: '9rem', textAlign: 'right'}}>({rowData.completedDate})</div>
        </div>
      ) : null
    }
  }

  const commonShowModal = (rowData: any, setIsModalVisible: any) => {
    setSelectRowData(rowData)
    setIsModalVisible(true)
  }

  const commonModalProps = (visible: any, setIsModalVisible: any) => ({
    visible: visible,
    onOk: () => {
      setTableDataFromApi()
      setIsModalVisible(false)
    },
    onCancel: () => setIsModalVisible(false),
    data: selectRowData,
    machine: selectedMachine,
  })

  return (
    <div>
      <SuborderCommonMachineList selectMachine={(data: any) => setSelectedMachine(data)} />
      <div ref={myRef} style={{marginBottom: '2rem'}}>&nbsp;</div>
      <SuborderCommonTable
        getStatusButton={getStatusButton}
        selectedMachine={selectedMachine}
        tableData={tableData}
      />
      <SuborderCompleteModal {...commonModalProps(isCompleteModalVisible, setIsCompleteModalVisible)} />
      <SuborderTakeModal {...commonModalProps(isTakeModalVisible, setIsTakeModalVisible)} />
    </div>
  )
}

export default SuborderList
