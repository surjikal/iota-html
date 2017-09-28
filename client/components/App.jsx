import * as _       from 'lodash'
import React        from 'react'
import {observer}   from 'mobx-react'
import {observable} from 'mobx'

import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'

import Home   from './Home'
import Footer from './Footer'
import Viewer from './Viewer'


const Routes = () => {
  return (
    <div style={{height:"100%", width:"100%"}}>
      <Route path="/" exact component={Home} />
      <Route path="/:bundle" component={Viewer} />
    </div>
  )
}


const App = () => {
  return (
    <div style={{height:"100%", width:"100%"}}>
      <Routes />
    </div>
  )
}


export default () => {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}