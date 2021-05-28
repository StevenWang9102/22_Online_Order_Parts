import { Button, Col, Row } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import React, { useEffect, useRef, useState } from 'react'
import {PackagingPrintQrModal} from './packaging-modal/packaging-print-qr-modal'
import {PackagingAssignPlateModal} from './packaging-modal/packaging-assign-plate-modal'
import {PackagingPlateManagementModal} from './packaging-modal/packaging-plate-management-modal'
import {SuborderCompleteModal} from '../suborder-list/suborder-modal/suborder-complete-modal'
import {SuborderTakeModal} from '../suborder-list/suborder-modal/suborder-take-modal'
import SuborderCommonTable from '../suborder-list/suborder-common-table'
import SuborderCommonMachineList from '../suborder-list/suborder-common-machine-list'

const PackagingList = () => {
  const myRef = useRef<any>(null)
  const [selectedMachine, setSelectedMachine] = useState<any>()
  const [tableData, setTableData] = useState<any>([])
  const [selectRowData, setSelectRowData] = useState<any>()
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [isPrintQrModalVisible, setIsPrintQrModalVisible] = useState(false)
  const [isAssignPlateModalVisible, setIsAssignPlateModalVisible] = useState(false)
  const [isTakeModalVisible, setIsTakeModalVisible] = useState(false)
  const [isPlateManagementModalVisible, setIsPlateManagementModalVisible] = useState(false)
  const [plateList, setPlateList] = useState([])

  useEffect(() => {
    setPackagePlateList()
  }, [])

  const setPackagePlateList = () => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate?package=1',
      method: 'get'
    }).then(res => {
      setPlateList(res.data.data)
    })
  }

  useEffect(() => {
    let isCancelled = false
    if (selectedMachine && !isCancelled) {
      setTableDataFromApi()
    }
    return () => {
      isCancelled = true
    }
  }, [selectedMachine])

  const setTableDataFromApi = () => {
    ApiRequest({
      url: 'Suborder/GetSuborderByMachineId?id=' + selectedMachine.machineId,
      method: 'get',
      isShowSpinner: true
    }).then(res => {
      setTableData(res.data.data)
      myRef.current.scrollIntoView({behavior: 'smooth'})
    })
  }

  const getStatusButton = (rowData: any) => {
    if (rowData.suborderStatusId === 2) {
      return (
        <>
          <Button
            type='primary'
            onClick={() => showPrintQrModal(rowData)}
            style={{width: 110, marginLeft: '1rem'}}
          > 打条形码/QR </Button>
          <Button
            type='primary'
            style={{width: 110, marginTop: '1rem', marginLeft: '1rem'}}
            onClick={() => showAssignPlateModal(rowData)}
          > 配托盘/Pallet </Button>
          <Button
            type='primary'
            style={{backgroundColor: '#10b00b', borderColor: '#10b00b', width: 110, marginTop: '1rem', marginLeft: '1rem'}}
            onClick={() => showCompleteModal(rowData)}
          > 完成/Comp </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 1) {
      return (
        <>
          <Button
            style={{backgroundColor: '#10b00b', borderColor: '#10b00b', width: 100}}
            type='primary'
            onClick={() => showTakeModal(rowData)}
          > 取单/Take </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 10) {
      return rowData.completedDate ? <div style={{width: '9rem', textAlign: 'right'}}>({rowData.completedDate})</div> : null
    }
  }

  const showCompleteModal = (rowData: any) => commonShowModal(rowData, setIsCompleteModalVisible)

  const showPrintQrModal = (rowData: any) => commonShowModal(rowData, setIsPrintQrModalVisible)

  const showAssignPlateModal = (rowData: any) => commonShowModal(rowData, setIsAssignPlateModalVisible)

  const showTakeModal = (rowData: any) => commonShowModal(rowData, setIsTakeModalVisible)

  const commonShowModal = (rowData: any, setIsModalVisible: any) => {
    setSelectRowData(null)
    setTimeout(() => {
      setSelectRowData(rowData)
    })
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
    isPackaging: true
  })

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col>
          <Button type="primary" onClick={() => setIsPlateManagementModalVisible(true)}>托盘管理/Pallet management</Button>
        </Col>
        <Col>
          {
            plateList.map((row: any, index: any) => <div key={index}>#{row.plateCode}</div>)
          }
        </Col>
      </Row>
      <SuborderCommonMachineList
        isPackaging={true}
        selectMachine={(data: any) => setSelectedMachine(data)}
      />
      <div ref={myRef} style={{marginBottom: '2rem'}}>&nbsp;</div>
      <SuborderCommonTable
        isPackaging={true}
        getStatusButton={getStatusButton}
        selectedMachine={selectedMachine}
        tableData={tableData}
      />
      <PackagingPlateManagementModal {...commonModalProps(isPlateManagementModalVisible, setIsPlateManagementModalVisible)} />
      <PackagingAssignPlateModal {...commonModalProps(isAssignPlateModalVisible, setIsAssignPlateModalVisible)} />
      <PackagingPrintQrModal {...commonModalProps(isPrintQrModalVisible, setIsPrintQrModalVisible)} />
      <SuborderCompleteModal {...commonModalProps(isCompleteModalVisible, setIsCompleteModalVisible)} />
      <SuborderTakeModal {...commonModalProps(isTakeModalVisible, setIsTakeModalVisible)} />
    </div>
  )
}

export default PackagingList
