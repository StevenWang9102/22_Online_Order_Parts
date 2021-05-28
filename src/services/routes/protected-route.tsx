import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {authenticated} from '../lib/utils/auth.utils'
import CommonHeader from '../../components/layout/common-header'
import CommonFooter from '../../components/layout/common-footer'
import { BackTop } from 'antd'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ProtectedRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest }
      render={
        (props) => {
          if (rest.path === '/' && !authenticated()) {
            return (
              <Component {...props} />
            )
          }
          if (rest.path === '/' && authenticated()) {
            window.location.href = '/home'
          }
          if (authenticated()) {
            return (
              <div style={{display: 'flex', height: '100vh', flexDirection: 'column', width: '100%', minWidth: '1000px'}}>
                <CommonHeader />
                <div style={{flex: 1, margin: '0 auto'}}>
                  <div style={{minWidth: '1000px', minHeight: '720px', width: '95vw'}}>
                    <BackTop visibilityHeight={200} style={{right: '1rem', bottom: '7rem'}} />
                    <Component {...props} />
                  </div>
                </div>
                <CommonFooter />
              </div>
            )
          } else {
            return <Redirect to={
              {
                pathname: '/',
                state: {
                  from: props.location
                }
              }} />
          }
        }
      }
    />
  )
}
