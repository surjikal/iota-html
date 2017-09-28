import React        from 'react'
import {observer}   from 'mobx-react'
import {observable} from 'mobx'
import {withRouter} from 'react-router-dom'

import Iframe from './Iframe'
import Footer from './Footer'

import IOTAClient from '../lib/iota-client';


import {Button, Container, Grid, Dimmer, Loader}     from 'semantic-ui-react'

class BundleViewerState {
  @observable html = null
  @observable error = null
  @observable bundle = null

  constructor() {
    this.client = new IOTAClient({
        host: "http://iota.bitfinex.com"
    ,   port: 80
    })
  }

  setBundle(bundle) {
    this.client.getMessage(bundle)
    .then((message) => {
      this.html = message
    }).catch((error) => {
      console.log(error)
      this.error = error.message
    })
  }
}


class BundleViewerPath extends React.Component {
  render() {
    const bundle = this.props.match.params.bundle
    this.bundleViewer = new BundleViewerState()
    this.bundleViewer.setBundle(bundle)
    const state = this.bundleViewer
    return (
      <div style={{width:"100%", height:"100%", position:"relative"}}>
        <BundleViewer style={{position:"absolute", left:"0px", right:"0px", top:"0px", bottom:"50px"}} state={state} />
        <Footer style={{position:"absolute", left:"0px", right:"0px", height:"50px", bottom:"0px"}} />
      </div>
    )
  }
}


const BundleViewerLoading = ({bundle}) => {
  return (
    <Container text>
      <Dimmer active inverted style={{marginTop:"-100px"}}>
        <Loader inverted indeterminate>
          <h4 style={{marginTop:"0.8em"}}>Loading Bundle</h4>
          <pre>{bundle}</pre>
        </Loader>
      </Dimmer>
    </Container>
  )
}


const BundleViewerHTML = ({html, style}) => {
  return (
    <div style={style}>
    <Iframe html={html} />
    </div>
  )
}


const BundleViewerError = ({error}) => {
  return (
    <div style={{ position:"fixed", top:"0", left:"0", bottom:"0", right:"0", height: '100%' }}>
    <Grid
      textAlign='center'
      style={{ height: '100%' }}
      verticalAlign='middle'
    >
    <Grid.Column style={{ maxWidth: 450 }}>
    <Message negative>
      <Message.Header>Could not load bundle...</Message.Header>
      <pre>{error}</pre>
    </Message>
    </Grid.Column>
    </Grid>
    </div>
  )
}


@observer
class BundleViewer extends React.Component {
  render() {
    const {html, error, bundle} = this.props.state
    if (error) return (<BundleViewerError style={this.props.style} error={error} />)
    return html? (<BundleViewerHTML style={this.props.style} html={html} />)
               : (<BundleViewerLoading style={this.props.style} bundle={bundle} />)
  }
}


export default BundleViewerPath