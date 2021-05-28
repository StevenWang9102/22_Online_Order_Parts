import React from 'react'
import './index.css'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Login from './pages/static/login/login'
// import LoginPage from './pages/static/login/login'
import OrderUpdate from './pages/order-update/OrderUpdate'
import OrderOnline from './pages/order-online/OrderOnline'
import OrderHistory from './pages/order-history/OrderHistory'
import { ProtectedRoute } from './services/routes/protected-route'
import Home from './pages/static/dashboard/sales-order-dashboard/sales-order-dashboard'
import unExitPage from './services/lib/404'

const App = () => {
  return (
    <Router>
      <Switch>
        {
          routes.map((route: any, index: number) => {
            return (
              <ProtectedRoute exact key={index} path={route.path} component={route.component} />
            )
          })
        }
        <ProtectedRoute exact path='*' component={unExitPage} />
      </Switch>
    </Router>
  )
}

const routes: any = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/home',
    component: OrderHistory
  },
  {
    path: '/order-online',
    component: OrderOnline
  },
  {
    path: '/order-history',
    component: OrderHistory
  },
  {
    path: '/update-order',
    component: OrderUpdate
  },
]

export default App
