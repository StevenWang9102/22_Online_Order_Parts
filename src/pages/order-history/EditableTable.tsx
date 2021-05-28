import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd';
import SweetAlertService from '../../services/lib/utils/sweet-alert-service'


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  console.log('EditableCell22,record', record);
  const [status, setErrorStatus]= useState("right")

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          validateStatus={status}
          help={ status == 'error' && "Should be more than minimum order quantity."}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <InputNumber onChange={(value)=>{
            console.log('InputNumber6578,value', value);
            console.log('InputNumber6578,record', record);
            if(record.minOrderQuantity > value) {
              setErrorStatus('error')
            } else {
              setErrorStatus('right')
            }
          }} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({
  orderProductList,
  tableDataSource,
  setTableSource,
  setTotal,
  quotationProductList,
}) => {

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [error, setErrors] = useState<any>({});
  const [mySelectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  // console.log('EditableTable356,mySelectedRowKeys', mySelectedRowKeys);
  console.log('EditableTable356,tableDataSource', tableDataSource);
  console.log('EditableTable356,dataSource', dataSource);

  useEffect(() => {
    // 初始化
    const temp = []
    const keys = [...mySelectedRowKeys]
    const orderProductIdArr = orderProductList.map(each=>each.productId)
    console.log('useEffect7897,quotationProductList', quotationProductList);
    console.log('useEffect7897,orderProductList', orderProductList);
    console.log('useEffect7897,orderProductIdArr', orderProductIdArr);


    // 循环，如果这个产品存在于产品中，则勾选
    quotationProductList.forEach((each, index) => {
    if(orderProductIdArr.includes(each.productId)) {
        const targetProductId = each.productId
        const targetProduct = orderProductList.filter(each=>each.productId == targetProductId)[0]

        keys.push(index)
        temp.push({
          isChecked: true,
          key: index,
          productId: each.productId,
          productName: each.product ? each.product.productName : "",
          price: `$ ${each.price}`,
          quantity: targetProduct.quantity,
          subtotal: each.price * 0,
          marginOfError: 0,
          unitPrice: 0,
          minOrderQuantity: each.product.minOrderQuantity
        })
      } else {
        temp.push({
          isChecked: false,
          key: index,
          productId: each.productId,
          productName: each.product ? each.product.productName : "",
          price: `$ ${each.price}`,
          quantity: 0,
          subtotal: each.price * 0,
          marginOfError: 0,
          unitPrice: 0,
          minOrderQuantity: each.product.minOrderQuantity
        })
      }
    })
    console.log('EditableTable,temp', temp);
    setTableSource(temp)
    setDataSource(temp)
    setSelectedRowKeys(uniqueArr(keys))
  }, [orderProductList])


  useEffect(() => {
    // 改变所选择行的状态标记 isCheck 
    console.log('useEffect342,mySelectedRowKeys', mySelectedRowKeys);
    console.log('useEffect342,tableDataSource', mySelectedRowKeys);
    if(tableDataSource.length !== 0){
      const temp = tableDataSource.map((each: any, index: any)=>{
        return {
          ...each,
          isChecked: mySelectedRowKeys.includes(index)
        }
      })
      console.log('useEffect342,temp', temp);
      setTableSource(temp)
      setDataSource(temp)
    }
  }, [mySelectedRowKeys])

  useEffect(() => {
    console.log('useEffect678,dataSource',dataSource);
    
     // 计算总金额
     var totalTemp = 0
     dataSource.forEach((each: any) =>{
       if(each.isChecked){
        const price = parseFloat(each.price.slice(2)) 
        const quantity = parseFloat(each.quantity) 
        totalTemp = totalTemp + price * quantity
       }
     })
     console.log('useEffect678,total123',totalTemp);
     
     setTotal(totalTemp)
  }, [dataSource])

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      width: '40%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '14%',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '10%',
      render: (text, record) => {
        // console.log('text543',text);
        
        return  (
          <Form.Item
              validateStatus= {error[record.key]}
              help={error[record.key] == "error" ? "Should be larger than minimum quantity." : <></>}
            >
              <InputNumber
                defaultValue={text}
                style={{width: 70}} 
                onChange={(value)=>{
                  onTableChanged(value, record, mySelectedRowKeys)
                  if(value < record.minOrderQuantity){
                    setErrors({
                      ...error,
                      [record.key]: 'error',
                    })
                  } else {
                    setErrors({
                      ...error,
                      [record.key]: 'ok',
                    })
                  }
                }}
              >
              </InputNumber>
            </Form.Item>
        ) 
      },
    },
    {
      title: 'Minimum quantity',
      dataIndex: 'minOrderQuantity',
      width: '10%',
      render: (text) => {
        return  (
          <span style={{color: 'gray'}}> {text} </span>
        ) 
      },
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      width: '10%',
    },
  ];


  const isEditing = (record: any) => record.key === editingKey;

  const onTableChanged = (value: any, record: any, mySelectedRowKeys: any) =>{
    console.log('onChange698,value',value);
    console.log('onChange698,record',record);
    console.log('onChange698,tableDataSource',tableDataSource);

    const newTableData = tableDataSource.map((each: any, index: number)=> {
      console.log('tableDataSource33,mySelectedRowKeys', mySelectedRowKeys);
      const isChecked = mySelectedRowKeys.includes(index)
      console.log('tableDataSource33,isChecked', isChecked);

      if(each.key == record.key){
        return {
          ...each,
          isChecked: isChecked,
          quantity: value,
          subtotal: (parseFloat(value) * parseFloat(each.price.slice(2))).toFixed(2),
        }
      } else {
        return {
          ...each,
          isChecked: isChecked,
        }
      }
    })

    console.log('onChange698,newTableData',newTableData);
    setTableSource(newTableData)
    setDataSource(newTableData)
  }


  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const uniqueArr = (arr) => {
    return Array.from(new Set(arr))
  }

  const rowSelection = {
    selectedRowKeys: mySelectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      const previousKeys = [...mySelectedRowKeys]
      const temp = uniqueArr(selectedRowKeys)
      setSelectedRowKeys(temp)
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  return (
    <Form form={form} component={false}>
      <Table
        style={{margin: "20px 0"}}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        components={{
          body: { cell: EditableCell},
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable