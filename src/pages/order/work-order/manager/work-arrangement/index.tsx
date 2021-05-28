import React, {useEffect, useState} from 'react'
import {Button, Card, Col, DatePicker, Divider, Form, Row} from 'antd'
import {Table} from 'antd'
import moment from 'moment'
import ISelectForNormal from '../../../../../components/common/iSelectForNormal'
import swal from '../../../../../services/lib/utils/sweet-alert-service'
import CommonMachineCard from '../../../../../components/common/common-machine-card'
import {
  deleteArrangementRequest,
  getDateRequest,
  getEmployeeRequest,
  getMachineRequest, getWeekRequest,
  postArrangementRequest, updateArrangementRequest
} from '../../../../../services/work-arrangement-services'

interface machine2{
  machineId: number,
  machineName: string,
  machineTypeId: number,
  picture: string
}
const WorkArrangement:React.FC = (props) => {

  const [Date, setDate] = useState<any>(moment())
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [userSelect, setUserSelect] = useState<any>([])
  const [allMachines, setAllMachines] = useState<any>([])
  const [arrangeData, setArrangeData] = useState<any>([])
  const [newUser, setNewUser] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'))

  useEffect(() => {
    getEmployeeRequest()
        .then((res) => {
              console.log(res.data.data, 'getDataFromApi')
              const users = dataTransfer(res.data.data, 'users')
              setUserSelect(users)
            }
        )
    getMachineRequest()
        .then((res) => {
          // console.log(res.data.data,'machine')
          const machines = dataTransfer(res.data.data, 'machines')
          setAllMachines(machines)
          getArrangementData(selectedDate, machines)
        })
  }, [])

  const weekday = (day:number,selectedDay?:string,) => {
    return moment(selectedDay).day(day).format('YYYY-MM-DD')
  }

  const getArrangementData = (date:any, machines:any) => {
    // getDateRequest(date).then(res => {
    //     console.log(res.data.data,'连接的数据') //这一天所有机器的工作安排
    //     const tableData = mergeData(machines, res.data.data)
    //     console.log(tableData,'tableData')
    //     setArrangeData(tableData)
    //
    //     // machines.map((res:any) =>console.log(res,'机器'))
    // })
    // console.log(date,'1111')
    getWeekRequest(weekday(1,date),weekday(7,date))
        .then( (res:any)=>{
          // console.log(res.data.data,'week')
          //   console.log(res.data.data,date,'2222')
          // weekDayFilter(res.data.data)
          const tableData = mergeTest(machines, res.data.data, date)
          // console.log(tableData,'tableDataInWeek')
          setArrangeData(tableData)
        })
  }

  const mergeTest = (machines:any, allMachinesOperateTime:any, selectedDay:string) =>{
    const newArray:any = []

    // console.log(machines,'machines')
    // console.log(allMachinesOperateTime,'second')
    if(allMachinesOperateTime.length === 0){
      machines.forEach((res:any) => {
        // console.log(res,'res')
        newArray.push({
          machine: res,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        })
      })
    }else {
      machines.forEach((res:any) => {
        const obj:any = {
          machine: res,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        }
        for (let i = 0; i < allMachinesOperateTime.length; i++) {
          // console.log(res.name,allMachinesOperateTime[i])
          if (res.id === allMachinesOperateTime[i].machine.machineId) {
            // console.log('i')
            // console.log(res.name,allMachinesOperateTime[i],weekday(1,selectedDay),selectedDay)
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(1,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(1,selectedDay),selectedDay)
              // console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(1,selectedDay))
              obj.monday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId
              }
            }
            // else{
            //     obj.monday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(2,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(2,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(2,selectedDay))
              obj.tuesday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
              }
            }
            // else{
            //     obj.tuesday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(3,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(3,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(3,selectedDay))
              obj.wednesday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
              }
            }
            // else{
            //     obj.wednesday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(4,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(4,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(4,selectedDay))
              obj.thursday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId
              }
            }
            // else{
            //     obj.thursday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(5,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(5,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(5,selectedDay))
              obj.friday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId
              }
            }
            // else{
            //     obj.friday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(6,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(6,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(6,selectedDay))
              obj.saturday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId
              }
            }
            // else{
            //     obj.saturday = null
            // }
            if(allMachinesOperateTime[i].workingDate.slice(0,10) === weekday(7,selectedDay)){
              // console.log(res.name,allMachinesOperateTime[i],weekday(7,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(7,selectedDay))
              obj.sunday = {
                user:{
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId
              }
            }
            // else{
            //     obj.sunday = null
            // }
          }
        }
        newArray.push(obj)
      })}
    return newArray
  }

  const selectHandler = (data:any, dateString:string) => {
    setSelectedDate(dateString)
    getArrangementData(dateString, allMachines)
  }

  const dataTransfer = (data:any, filter: string) => {
    const newArray:any = []
    if (filter === 'machines') {
      data.map((res:machine2) => {
        newArray.push({
              id: res.machineId,
              img: res.picture,
              name: res.machineName,
              type_id: res.machineTypeId
            }
        )
      })
    }

    if (filter === 'users') {
      // console.log(data,'user')
      data.map((res:any) => {
        // console.log(res)
        newArray.push({
          id: res.employeeId,
          name: res.firstName + ' ' + res.lastName
        })
      })
    }
    // console.log(newArray)
    return newArray
  }


  const onchange = (data: any, rowData:any,days:any,selectedDay:any) => {
    // const finalData = Object.assign({}, rowData.machine)
    const finalData:any = {machine:rowData.machine,user:rowData[days],selectedDay:selectedDay,day:days}
    finalData.user = {
      id: data.value,
      name: data.children
    }
    if(rowData[days]?.arrangeId){
      // console.log('good',rowData[days])
      finalData.arrangeId = rowData[days].arrangeId
    }

    // console.log(rowData[days],'这一天有没有arrange')
    // console.log(days,'days')
    // console.log(data, rowData,'select 得到的数据')
    // console.log(rowData, merge, 'select 得到的数据2')
    // console.log(finalData, 'complete')
    const copyNewUser = [...newUser]
    // const a = copyNewUser.map((res:any) => {
    //   return res.machine.id
    // }).indexOf(finalData.machine.id)
    // const b = copyNewUser.map((res:any) => {
    //         return res.selectedDay
    // }).indexOf(finalData.selectedDay)
    const c = copyNewUser.findIndex((element:any) => element.machine.id === finalData.machine.id && element.selectedDay === finalData.selectedDay)
    if (c !== -1) {
      copyNewUser[c] = finalData
      setNewUser(copyNewUser)
    } else {
      setNewUser((prevState:any) => [...prevState, finalData])
    }
    // console.log(a,'判断')
    //   console.log(b,'判断arrangId')
    //   console.log(c, 'findindex')
    // console.log(finalData)
    // console.log(copyNewUser,'copyNewUser')

  }

  const columns = [
    {
      title: 'Name',
      dataIndex: ['machine', 'name'],
      key: 'name',
      width: 200
    },
    {
      title: 'MonDay',
      // dataIndex: 'monday',
      key: 'monday',
      render: (text:any, record:any) => {
        // console.log(text,'得到的数据')
        // console.log(text.monday)
        // console.log(Object.keys(text)[1],'lll')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal  date={weekday(1,selectedDate)} title={Object.keys(text)[1]} defaultValue={text.monday?.user?.id} location={text} placeholder={text.monday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.monday?.user?.name? text.monday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'TuesDay',
      // dataIndex: 'tuesday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(2,selectedDate)} title={Object.keys(text)[2]} defaultValue={text.tuesday?.user?.id} location={text} placeholder={text.tuesday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.tuesday?.user?.name? text.tuesday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'Wednesday',
      // dataIndex: 'wednesday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(3,selectedDate)} title={Object.keys(text)[3]} defaultValue={text.wednesday?.user?.id} location={text} placeholder={text.wednesday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.wednesday?.user?.name? text.wednesday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'Thursday',
      // dataIndex: 'thursday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(4,selectedDate)} title={Object.keys(text)[4]} defaultValue={text.thursday?.user?.id} location={text} placeholder={text.thursday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.thursday?.user?.name? text.thursday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'Friday',
      // dataIndex: 'friday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(5,selectedDate)} title={Object.keys(text)[5]} defaultValue={text.friday?.user?.id} location={text} placeholder={text.friday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.friday?.user?.name? text.friday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'Saturday',
      // dataIndex: 'saturday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(6,selectedDate)} title={Object.keys(text)[6]} defaultValue={text.saturday?.user?.id} location={text} placeholder={text.saturday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.saturday?.user?.name? text.saturday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
    {
      title: 'Sunday',
      // dataIndex: 'sunday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
            <>
              {isEdit ?
                  <ISelectForNormal date={weekday(7,selectedDate)} title={Object.keys(text)[7]} defaultValue={text.sunday?.user?.id} location={text} placeholder={text.sunday?.user?.name} data={userSelect} onChange={onchange}/>
                  :
                  <>{text.sunday?.user?.name? text.sunday?.user?.name:'None'}</>
              }
            </>
        )
      }
    },
  ]

  const submitHandler2 = async () => {
    const postData:any = []
    const updateData:any = []
    const deleteData:number[] = []
    const updateToTable = [...arrangeData]
    // console.log(updateToTable,'updateToTable')
    // console.log(newUser,'操作过后添加的user')
    newUser.forEach((res:any) => {
      // console.log(res)

      //modifyData找到得是newUser里每个所对应的在column里的eindex
      const modifyData = updateToTable.findIndex((res1:any) => res1.machine === res.machine)
      // console.log(updateToTable[modifyData],'updateToTable[modifyData]')
      // updateToTable[modifyData] = res

      // console.log(updateToTable[modifyData][res.day],res.day)
      if (updateToTable[modifyData][res.day] === null) {
        console.log(res,'post')
        const obj = {
          machineId: res.machine.id,
          operator: res.user.id,
          workingDate: res.selectedDay,
        }
        postData.push(obj)
      } else {
        if (res.user.id === null) {
          console.log(res,'delete')
          deleteData.push(res.arrangeId)
        } else {
          console.log(res,'put')
          const obj = {
            machineId: res.machine.id,
            operator: res.user.id,
            workingDate: res.selectedDay,
            arrangementId: res.arrangeId
          }
          updateData.push(obj)
        }

      }
      // console.log(updateToTable,'modifyData')

    })

    const result = await swal.confirmMessage()
    if (result) {
      if (postData.length !== 0) {
        // console.log(postData,'post')
        postArrangementRequest(postData).then(res => console.log(res, 'post成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      if (updateData.length !== 0) {
        // console.log(updateData,'put')
        updateArrangementRequest(updateData).then(res => console.log(res, 'put成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      if (deleteData.length !== 0) {
        // console.log(deleteData,'delete')
        deleteArrangementRequest(deleteData).then(res => console.log(res, 'delete成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      // setArrangeData(updateToTable)
    }
    setIsEdit(false)
    setNewUser([])
  }
  return (
      <div>
        <Row>
          <Col span={24}>
            <h1 style={{margin:0}}>Work Arrangement</h1>
            <Row style={{padding: '1rem 0'}}>
              <Col span={8}>
                <DatePicker onChange={selectHandler} defaultValue={moment(Date, 'YYYY-MM-DD')} style={{width: '100%'}} />
              </Col>
            </Row>
            <Row>
              <div style={{display: 'flex', justifyContent: 'flex-start', margin: '0 0 1rem 0'}}>
                {!isEdit && <Button type="primary" style={{float: 'right'}} onClick={() => setIsEdit(true)}>Edit</Button>}
                <div style={{float: 'right'}}>
                  {isEdit && <Button type="primary" onClick={submitHandler2}>Submit</Button>}&nbsp;
                  {isEdit && <Button onClick={()=>setIsEdit(false)}>Cancel</Button>}
                </div>
              </div>
              <div style={{width: '100%'}}>
                <Table columns={columns} dataSource={arrangeData} pagination={false} />
              </div>
            </Row>
          </Col>
        </Row>
      </div>
  )
}

export default WorkArrangement
