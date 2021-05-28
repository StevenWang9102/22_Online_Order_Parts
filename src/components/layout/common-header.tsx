import React, {useState} from 'react'
import { Menu, Button, Dropdown } from 'antd'
import { AppstoreOutlined, UserOutlined, DownOutlined , CalendarOutlined, CreditCardOutlined} from '@ant-design/icons'
import {logout} from '../../services/lib/utils/auth.utils'
import { Link, useHistory} from 'react-router-dom'
import { getUserName } from '../../services/lib/utils/auth.utils'
import './style.css'

const { SubMenu } = Menu

// Nav Bar
const routes = [
  {
    title: 'Order Online',
    drop: true,
    accessLevel: 1,
    icon: <CalendarOutlined />,
    path: '/order-online',
    inter: [
      {
        title: 'Order Online',
        path: '/order-online',
        accessLevel: 2,
      },
    ]
  },
  {
    title: 'Order History',
    drop: true,
    accessLevel: 1,
    icon: <CreditCardOutlined />,
    path: '/order-history',
    inter: [
      {
        title: 'Order History',
        path: '/order-history',
        accessLevel: 2,
      },
    ]
  },
]

function CommonHeader() {
  const history = useHistory()

  const profileMenu = (
    <Menu >
      <Menu.Item key="1" icon={<UserOutlined />} onClick={() => {
        logout(() => history.push('/'))
        sessionStorage.removeItem('token')
      }}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{display: 'flex', boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)', height: '3rem', marginBottom: '1.5rem', width: '100%', position: 'sticky', top: 0, zIndex: 20}}>
      <div style={{width: '20%', borderBottom: '1px solid #F7F7F7', textAlign: 'center', lineHeight: '47px', backgroundColor: 'white'}} onClick={() => history.push('/home')}>
        <img src="https://static.wixstatic.com/media/6f5302_d4fdbb80ae4446f695b333841f274373~mv2.png/v1/fill/w_310,h_84,al_c,q_85,usm_0.66_1.00_0.01/Logo.webp" style={{height: '40px', cursor: 'pointer'}} />
      </div>

      <div style={{width: '60%'}}>
      </div>

      <div style={{width: '20%', borderBottom: '1px solid #F7F7F7', lineHeight: '48px', backgroundColor: 'white'}}>
        <Dropdown overlay={profileMenu} >
          <Button style={{color: 'rgb(109,140,125)', width: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            Hi, {getUserName()}
            <DownOutlined/>
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default CommonHeader
