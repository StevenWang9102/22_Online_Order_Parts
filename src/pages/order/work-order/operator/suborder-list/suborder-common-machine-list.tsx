import { Col, Row } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import React, { useEffect, useState } from 'react'
import CommonMachineCard from '../../../../../components/common/common-machine-card'
import { getCurrentDateString } from '../../../../../services/helpers'

const SuborderCommonMachineList = (props: {selectMachine: any, isPackaging?: boolean}) => {
  const [machineList, setMachineList] = useState<any>([])

  useEffect(() => {
    const currentDate = getCurrentDateString()
    ApiRequest({
      url: 'WorkingArrangement/GetAllWorkingArrangement?workingDate=' + currentDate,
      method: 'get',
      isShowSpinner: true
    }).then(res => {
      const data = res.data.data
        .map((row: any) => ({...row.machine, operatorNavigation: row.operatorNavigation}))
        .filter((row: any) => (props.isPackaging ? row.machineTypeId === 4 : row.machineTypeId !== 4))
      setMachineList(data)
    })
  }, [])

  return (
    <Row gutter={[16, 16]}>
      {
        machineList.map((row: any, index: number) => {
          return (
            <Col key={index} className="gutter-row" xxl={3} lg={4} md={6} sm={8}>
              <div onClick={() => props.selectMachine(row)}>
                <CommonMachineCard img={row.picture} machine={row.machineName} operator={row.operatorNavigation?.firstName +  ' ' + row.operatorNavigation?.lastName} />
              </div>
            </Col>
          )
        })
      }
    </Row>
  )
}

export default SuborderCommonMachineList
