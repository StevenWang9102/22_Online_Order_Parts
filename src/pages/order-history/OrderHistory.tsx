import React, { useEffect, useState } from 'react'
import EditForm from './EditForm'
import { Table, Tag, Button, Modal, Form } from 'antd';
import OrderOnline from "../order-online/OrderOnline";
import { sort } from 'fast-sort';
import { setCookie, getCookie } from 'react-use-cookie'
import moment from 'moment'
import {
  FetchOrdersRequest,
  FetchOrdersByIdRequest,
  FetchAllCustomersRequest,
  FetchOneCustomerRequest,
  FetchAllEmployeeRequest,
  FetchAllCityRequest,
  FetchDeliverMethods,
} from '../../services/order-services'

export const OrderHistory = () => {

  const [source, setSource] = useState([])
  const [visiable, setVisable] = useState(false)
  const [createVisable, setCreateVisable] = useState(false)
  const [formData, setFormData] = useState({})
  const [customersList, setCustomers] = useState([]);
  const [loginedUserInfo, setLoginedUserInfo] = useState({});
  const [emplyeeList, setEmployees] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [deliverMethods, setDeliverMethod] = useState([]);
  const [activeKey, setActiveKey] = useState('1')
  const [form] = Form.useForm();

  // console.log('source67',source);
  
  useEffect(() => {
    requestInitials()
  }, [])

  useEffect(() => {
    if(createVisable){
      setActiveKey('1')
      form.resetFields()
    }
  }, [createVisable]);

  const columns = [
    {
      title: 'Order No.',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: '5%'
    },

    {
      title: 'Order At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },

    {
      title: 'Order Product',
      dataIndex: 'orderProduct',
      key: 'orderProduct',
      width: "20%",

      render: (item: any) => {
        // console.log('orderProduct6,item', item);

        return (
          <>
            {item.map((tag: any, index: number) => {
              // console.log('item,tag', tag);

              let color = ""
              if (index % 3 === 0) color = 'blue'
              else if (index % 3 === 1) color = 'green'
              else color = 'orange'

              return (
                <div style={{margin: '3px 0'}}>
                  <Tag color={color} key={tag}>
                    {`${tag.product.productName} ( $${tag.price} × ${tag.quantity})`}
                  </Tag>
                </div>
              );
            })}
          </>
        )
      }
    },
    
    {
      title: 'Price(Include Gst)',
      dataIndex: 'priceInclgst',
      key: 'priceInclgst',
      render: (text: any) => {
        return <span style={{ color: "black" }}>{`$ ${text}`}</span>
      },
    },
    

    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: any) => {
        return <span style={{ color: "blue", fontWeight: 550 }}>{`$ ${text}`}</span>
      },
    },

    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: '16%',
      render: (text: any, record: any) => {
        // console.log('orderStatus687689, text',text);
        
        var myText = ''
        var color = 'black'

        if(text=='Online') myText = 'Online ordered'
        else if (record.deliveryDate) {
          color = 'green'
          myText = `${text}, will be delivered at ${moment(record.deliveryDate).format("DD/MM/YYYY")}`
        }
        else if (text == 'Paid') {
          color = 'green'
          myText = `Paid, will be delivered at ${moment(record.deliveryDate).format("DD/MM/YYYY")}`
        }
        else if (text == 'Approved') {
          color = 'green'
          myText = `Approved`
        }
        else {
          myText = text
        }

        return <span style={{ fontWeight: 550, color: color }}>
          {myText}
          </span>
      },
    },

    {
      title: 'Address',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
    },

    {
      title: 'Actions',
      dataIndex: 'orderEditable',
      key: 'orderEditable',
      render: (text: any, record: any) => {

        // console.log('orderEditable,record', record);
        if(record.orderStatus =="Online") {
          return text && <Button
          type='primary'
          style={{ width: 60 }}
          size='small'
          onClick={() => { onEditClick(record) }}
        >Edit</Button>
        } 
        
      },
    },
  ];

  const onEditClick = (record: any) => {
    console.log('onEditClick,record', record);
    const id = record.orderId

    FetchOrdersByIdRequest(id)
      .then(res => {
        console.log('FetchOrdersByIdRequest,res=', res.data.data)
        const data = res.data.data.filter((each: any) => each.orderId === id)[0]
        console.log('FetchOrdersByIdRequest,data=', data)
        setFormData(data)
      }).catch(err => {
      })
    setVisable(true)
  }

  const fetchAllOrders = ()=>{
    FetchOrdersRequest()
    .then(res => {
      const targetCustomerId = getCookie('customerId')
      try {
        console.log('FetchOrdersRequest,res=', res.data.data)
        console.log('FetchOrdersRequest,targetCustomerId=', targetCustomerId)

        const data = res.data.data
        var temp: any = []

        data.forEach((each: any) => {
          const isOnlineOrder = each.orderSourceId == 1
          const flag = each.customerId.toString() == targetCustomerId && isOnlineOrder

          if (flag) {
            temp.push({
              customer: each.customer.company,
              createdAt: moment(each.createdAt).format('DD/MM/YYYY HH:mm'),
              deliveryAddress: each.deliveryAddress && each.deliveryCity &&`${each.deliveryAddress}, ${each.deliveryCity.cityName}`,
              deliveryMethod: each.deliveryMethod && each.deliveryMethod.deliveryMethodName,
              employee: each.employee ? each.employee.userName : '',
              totalPrice: each.totalPrice,
              priceInclgst: each.priceInclgst,
              deliveryDate: each.deliveryDate,
              orderNo: each.orderNo,
              orderId: each.orderId,
              orderProduct: each.orderProduct,
              orderStatus: each.orderStatus && each.orderStatus.orderStatusName,
              orderEditable: each.orderStatus && (each.orderStatus.orderStatusName === 'Dispatched' ? false : true),
            })
          }
        })
        console.log('FetchOrdersRequest87,temp', temp);
        const sorted = sort(temp).desc((each:any) => each.orderNo);
        setSource(sorted)
      } catch {
        alert('error')
      }

    }).catch(err => {
    })
  }
  

  const requestInitials = () => {
    fetchAllOrders()

    FetchAllCustomersRequest()
      .then((res) => {
        console.log("FetchAllCustomersRequest,res=", res.data.data);
        setCustomers(res.data.data);
      })
      .catch((err) => { });

    const customerId = parseInt(getCookie('customerId'))
    FetchOneCustomerRequest(customerId)
      .then((res) => {
        console.log("FetchOneCustomerRequest,res=", res.data.data);
        setLoginedUserInfo(res.data.data);
      })
      .catch((err) => { });

    FetchAllEmployeeRequest()
      .then((res) => {
        console.log("FetchAllEmployeeRequest,res=", res.data.data);
        setEmployees(res.data.data);
      })
      .catch((err) => { });


    FetchAllCityRequest()
      .then((res) => {
        console.log("FetchAllCityRequest,res=", res.data.data);
        setCityList(res.data.data);
      })
      .catch((err) => { });

    FetchDeliverMethods()
      .then((res) => {
        console.log("FetchDeliverMethods,res=", res.data.data);
        setDeliverMethod(res.data.data);
      })
      .catch((err) => { });
  }

  return (
    <section style={{ padding: 0 }}>
      <Button
        type='primary'
        onClick={() => setCreateVisable(true)}
        style={{ margin: '20px 0', float: 'right' }}
      > Create an order</Button>

      <Table 
        columns={columns} 
        dataSource={source} 
      />

    {/* ------------------------- Create order form ------------------------- */}
      <Modal
        width={750}
        visible={createVisable}
        footer={false}
        destroyOnClose={true}
        onCancel={() => {
          setCreateVisable(false)
        }}
      >
        <OrderOnline
          form={form}
          createVisable={createVisable}
          setFormValues={(values: any)=> form.setFieldsValue(values)}
          activeKey={activeKey}
          loginedUserInfo={loginedUserInfo}
          setActiveKey={setActiveKey}
          fetchAllOrders={fetchAllOrders}
          setCreateVisable={setCreateVisable}
        />
      </Modal>

      {/* ------------------------- Edit order form ------------------------- */}
      <Modal
        width={800}
        visible={visiable}
        footer={false}
        destroyOnClose={true}
        onCancel={() => {
          setVisable(false)
        }}
      >
        <EditForm
          formData={formData}
          cityList={cityList}
          customersList={customersList}
          deliverMethods={deliverMethods}
          emplyeeList={emplyeeList}
          setVisable={setVisable}
          fetchAllOrders={fetchAllOrders}
        />
      </Modal>
    </section>
  )
}

export default OrderHistory
