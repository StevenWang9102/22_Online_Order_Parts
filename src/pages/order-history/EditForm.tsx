import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, DatePicker, Tabs } from "antd";
import moment from 'moment'
import EditableTable from './EditableTable'
import { IOrderProduct, IUpdateOrderBody} from '../../interface/orderInterface'
import {setCookie, getCookie} from 'react-use-cookie'
import {
  UpdateOnlineOrder,
  FetchQuotationRequest,
} from "../../services/order-services";
import SweetAlertService from '../../services/lib/utils/sweet-alert-service'

const { TabPane } = Tabs;
const { TextArea } = Input;


const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};

const tailLayout1 = {
  wrapperCol: { offset: 10, span: 12 },
};

export const EditForm = (props: any) => {

  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('1')
  const [total, setTotal] = useState<any>(0);
  const [orderProductList, setProductList] = useState([]);
  const [quotationProductList, setAllProductList] = useState([]);
  const [tableDataSource, setTableSource] = useState([]);

  type SizeType = Parameters<typeof Form>[0]["size"];
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
  };

  useEffect(()=>{
    const customerId = getCookie('customerId')

    FetchQuotationRequest(customerId)
      .then((res) => {
        // alert("FetchQuotationRequest")
        console.log("FetchQuotationRequest,res=", res.data.data);
        const quotation = res.data.data;
        if (quotation.length !== 0) {
          console.log("FetchQuotationRequest,quotation=", quotation);
          console.log("FetchQuotationRequest,quotationItem=", quotation[0].quotationItem);

          const quotationItem = quotation[0].quotationItem || []
          var total = 0
          var product: any = []

          // 计算TOTAL
          quotationItem.forEach((each: any, index: number) => {
            if (each.productId) total = total + each.price
            product.push({
              key: index,
              ...each,
            })
          });

          console.log("FetchQuotationRequest,total=", total);
          console.log("FetchQuotationRequest,product=", product);

          setAllProductList(product);
        } else {
          setAllProductList([]) // refresh component.
        }
      })
      .catch((err) => { });
  },[])

  useEffect(() => {
    console.log('props.formData698', props.formData);
    
    if (props.formData.customerId) {
      form.setFieldsValue({
        customer: props.formData.customerId,
        staff: props.formData.employeeId,
        orderDate: moment(props.formData.createdAt),
        requiredDate: moment(props.formData.requiredDate),
        "order status": props.formData.orderStatus && props.formData.orderStatus.orderStatusName,
        total: props.formData.totalPrice,
        price: props.formData.priceInclgst,
        'contact name': props.formData.deliveryName,
        'delivery method': props.formData.deliveryMethod &&  props.formData.deliveryMethod.deliveryMethodId,
        'delivery city': props.formData.deliveryCity && props.formData.deliveryCity.cityId,
        'delivery address': props.formData.deliveryAddress,
        postCode: props.formData.postalCode,
        note: props.formData.comments,
      })
      setProductList(props.formData.orderProduct)
    }

    // 初始化总数 Total
    var total = 0
    const orderProductList = props.formData.orderProduct || []
    console.log('total5786,orderProductList', orderProductList);
    
    orderProductList.forEach(each=>{
      console.log('total5786,each', each);

      total = total + (each.price * each.quantity)
    })
    setTotal(total)
  }, [props.formData])


  const onUpdateClicked = () =>{
    const formValues = form.getFieldsValue()
    console.log("onUpdateClicked,formValues",formValues );
    console.log("onUpdateClicked,tableDataSource",tableDataSource );
    
    const orderProduct: IOrderProduct | any = []
    const flag: any = []

    tableDataSource.forEach((each: any)=>{
      console.log('tableDataSource,each', each);
      if(each.isChecked){
        if(each.minOrderQuantity < each.quantity){
          flag.push(true)
          orderProduct.push({
            "orderId": "string",
            "productId": each.productId,
            "quantity": parseInt(each.quantity),
            "unitPrice": 0,
            "price": parseFloat(each.price.slice(2)),
            "marginOfError": 0
          })
        } else {
          flag.push(false)
        }
      }
    })
    if(!flag.includes(false)){
      updateOrder(formValues, orderProduct)
    } else {
      SweetAlertService.errorMessage("Quantity should be larger than minimum quantity.")
    }
  }

  console.log('props.formData25',props.formData);
  
  const updateOrder = (formValues, orderProduct)=>{
    const customerId = parseInt(getCookie("customerId"))

    const newBody: IUpdateOrderBody = {
      "customerId": customerId,
      "orderId": props.formData.orderId,
      "totalPrice": total,
      "employeeId": 0, 
      "priceInclgst": total * 0.85,
      "deliveryName": formValues['contact name'] || '',
      "deliveryAddress": formValues['delivery address'],
      "postalCode": formValues.postCode || '',
      "orderDate": moment(),
      "requiredDate": moment().add(14, 'days'),
      "paid": props.formData.paid, 
      "orderSourceId": props.formData.orderSourceId,
      "comments": formValues.note || '',
      "deliveryAsap": 0,
      "orderStatusId": 2, 
      "deliveryCityId": formValues['delivery city'] || props.formData.deliveryCity.cityId,
      "deliveryMethodId": formValues['delivery method'] || props.formData.deliveryMethod.deliveryMethodId,
      "orderProduct": orderProduct,
      "orderOption": [
        {
          "optionId": 0,
          "quantity": 0,
          "unitPrice": 0,
          "price": 0
        }
      ]
    }

    console.log('PostOnlineOrder,props.formData=', props.formData)
    console.log('PostOnlineOrder,newBody=', newBody)
    
    // Request
    UpdateOnlineOrder(newBody)
    .then(res => {
      console.log('UpdateOnlineOrder,res=', res.data.data)
      props.setVisable(false)
      props.fetchAllOrders()
    }).catch(err => {
    })
  }

  return (
    <section style={{ padding: "20px 10px" }}>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout='horizontal'
        size={componentSize as SizeType}
      >

        <Tabs defaultActiveKey='1' activeKey={activeKey} onChange={(key) => setActiveKey(key)} centered>
          
          {/* -------------------------- Order --------------------------*/}
          <TabPane tab='Order Information' key='1'>
          
              {orderProductList.length === 0 ? <div style={{ color: 'grey', margin: "20px 0px" }}>No products</div> :
                <EditableTable
                  orderProductList={orderProductList}
                  quotationProductList={quotationProductList}
                  tableDataSource={tableDataSource}
                  setTableSource={setTableSource}
                  setTotal={setTotal}
                />}

            <Form.Item name="total" label='Total Price'>
              <div>$ {total.toFixed(2)}</div>
            </Form.Item>

            <Form.Item name="price" label='Price(Include gst)'>
              <div>$ {(total * 0.85).toFixed(2)}</div>
            </Form.Item>

            <Form.Item {...tailLayout1}>
              <Button
                type='primary'
                style={{width: 70}}
                onClick={()=> setActiveKey('2')}
              >
                Next
              </Button>
            </Form.Item>

          </TabPane>


          {/* -------------------------- Delivery --------------------------*/}
          <TabPane tab='Delivery' key='2'>

            <Form.Item name="contact name" label='Contact Name' >
              <Input />
            </Form.Item>

            <Form.Item name="delivery method" label='Delivery Method' rules={[{ required: true }]}>
              <Select
                defaultValue={props.formData.deliveryMethod && props.formData.deliveryMethod.deliveryMethodName}
>
                {props.deliverMethods.map((each: any) => (
                  <Select.Option
                    value={each.deliveryMethodId}>{each.deliveryMethodName}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="delivery city" label='Delivery City' rules={[{ required: true }]}>
              <Select
                defaultValue={props.formData.deliveryCity && props.formData.deliveryCity.cityName}
              >
                {props.cityList.map((each: any) => (
                  <Select.Option value={each.cityId}>{each.cityName}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="delivery address" label='Delivery Address' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="postCode" label='Postal Code'>
              <Input />
            </Form.Item>

            <Form.Item name="note" label='Note'>
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" onClick={()=>onUpdateClicked()} style={{marginRight: 10}}>
                Update
              </Button>
              <Button
                  // type='primary'
                  style={{width: 70}}
                  onClick={()=> setActiveKey('1')}
                >
                  Back
                </Button>
            </Form.Item>

          </TabPane>

        </Tabs>
      </Form>
    </section>
  )
}

export default EditForm
