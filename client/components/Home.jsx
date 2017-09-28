
import * as _                         from 'lodash'
import React                          from 'react'
import {observer}                     from 'mobx-react'
import {observable}                   from 'mobx'
import {withRouter, Link}             from 'react-router-dom'
import {Button, Header, Icon, Dimmer} from 'semantic-ui-react'

import Editor from './Editor'
import Footer from './Footer'
import IOTAClient from '../lib/iota-client';



const UploadDimmer = observer(({active, bundle, status}) => {
  const subheader = bundle? (<BundleURL bundle={bundle} />)
                          : (status)
  return (
    <Dimmer
      active={active}
      page>
      <Header as='h2' icon inverted>
        <Icon name='heart' />
        Uploading to tangle...
        <Header.Subheader><br />{subheader}</Header.Subheader>
      </Header>
    </Dimmer>
  )
})



const BundleURL = withRouter(({history, bundle}) => {
  const linkUrl = `/${bundle}`
  const displayUrl = `${window.location.origin}/${bundle}`
  const style = {wordBreak:"break-all"}
  return bundle? (<Link style={style} to={linkUrl}>{displayUrl}</Link>)
               : (<i style={{opacity:0.6}}>Hit submit to generate bundle url...</i>)
})



@observer
class Home extends React.Component {

  @observable loading = false
  @observable status  = ""
  @observable bundle  = null

  onSave(html) {
    const client = new IOTAClient({
        host: "http://node-iota.surjikal.io"
    ,   port: 14500
    })
    const self = this
    console.log("Submit:")
    console.log(html)
    self.loading = true
    const handlers = {
      onMessage: (x) => {
        console.log("on message:", x)
        self.status = x
      }
    }
    self.bundle = null
    client.sendMessage(html, handlers).then((bundle) => {
      self.bundle = bundle
    })
  }

  render() {
    return (
      <div style={{height:"100%", width:"100%"}}>
        <UploadDimmer active={this.loading} status={this.status} bundle={this.bundle} />
        <Editor style={{position:"absolute", left:"0px", right:"0px", bottom:"50px", top:"0px"}} onSave={this.onSave.bind(this)} />
        <Footer style={{position:"absolute", left:"0px", right:"0px", bottom:"0px", height:"50px"}} />
      </div>
    )
  }
}


export default Home;