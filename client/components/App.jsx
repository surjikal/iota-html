import React from 'react'
import {observer} from 'mobx-react'
import {observable} from "mobx"
import * as _ from 'lodash'

import { BrowserRouter, HashRouter, Route, Link, withRouter } from 'react-router-dom'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';


import {
  Button, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, Dimmer, Loader, Message
} from 'semantic-ui-react'

import IOTAUploadFormModel from './iota/IOTAUploadFormModel';
import IOTAUploadForm      from './iota/IOTAUploadForm';
import IOTAClient from '../lib/iota-client.js';

const client = new IOTAClient({
    host: "http://localhost"
,   port: 14500
})
console.log(client.config)

import SplitPane from 'react-split-pane'
import PanelGroup from 'react-panelgroup'
import Dock from 'react-dock'

class EditorModel {
  @observable html = ""
  @observable showPreview = true
}
const editorModel = new EditorModel()


const HTMLAceEditor = observer(({width, html, onChange}) => {
  const editorStyle = {
    position: "absolute"
  , top: "0", left: "0", bottom: "0", right: "0"
  }
  width = `${(width * 100)}%`
  return (
    <div style={{width:"100%", height:"100%", position:"relative"}}>
      <AceEditor
        mode="html"
        style={editorStyle}
        width={width}
        height="100%"
        theme="github"
        fontSize="11px"
        onChange={onChange}
        value={html}
        editorProps={{$blockScrolling: true}}
      />_
    </div>)
})



@observer
class HTMLEditor extends React.Component {
  @observable widths = {preview:0.5, editor:0.5}
  @observable html = ""

  render() {
    const self = this
    const style = _.extend({
      position:"relative"
    , width: "100%"
    , height: "100%"
    , overflow:"hidden"
    }, this.props.style)
    const onSizeChange = (width) => {
      self.widths = {preview: width, editor: (1 - width)}
    }
    const widths = self.props.showPreview? self.widths : {preview:0, editor:1}
    const dockStyle = {
      position: "absolute"
    , overflow: "hidden"
    , borderLeft: "1px solid #ccc"
    }
    const onChange = (html) => {
      self.html = html
      self.props.onChange(html)
    }
    return (
      <div style={style}>
          <div style={{height:"100%", width:"100%"}}>
            <HTMLAceEditor width={widths.editor} html={this.html} onChange={onChange} />
          </div>
          <div id="dock">
            <Dock dockStyle={dockStyle} position='right' dimMode='none' size={widths.preview} onSizeChange={onSizeChange} isVisible={this.props.showPreview}>
              <DynamicFullscreenHTML html={this.html} />
            </Dock>
          </div>
      </div>
    )
  }
}


class BundleViewerState {
  @observable html = null
  @observable error = null
  @observable bundle = null

  constructor(client) {
    this.client = client
  }

  setBundle(bundle) {
    client.getMessage(bundle)
    .then((message) => {
      this.html = message
    }).catch((error) => {
      console.log(error)
      this.error = error.message
    })
  }
}


const DynamicFullscreenHTML = observer(({html}) => {
  const style = {border:'none', width:'100%', height:'100%', position:"absolute", top:"0", left:"0", right:"0", bottom:"0"}
  return (<iframe style={style} srcDoc={html} />)
})


@observer
class BundleViewer extends React.Component {
  render() {
    const {html, error, bundle} = this.props.state
    if (error) return (<BundleViewerError style={this.props.style} error={error} />)
    return html? (<BundleViewerHTML style={this.props.style} html={html} />)
               : (<BundleViewerLoading style={this.props.style} bundle={bundle} />)
  }
}


class BundleViewerPath extends React.Component {
  render() {
    const bundle = this.props.match.params.bundle
    this.bundleViewer = new BundleViewerState(client)
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


const FormBundleURL = withRouter(({history, bundle}) => {
  const linkUrl = `/${bundle}`
  const displayUrl = `${window.location.origin}/${bundle}`
  const style = {wordBreak:"break-all"}
  return bundle? (<Link style={style} to={linkUrl}>{displayUrl}</Link>)
               : (<i style={{opacity:0.6}}>Hit submit to generate bundle url...</i>)
})


const Footer = ({style}) => {
  style = _.extend({
    borderTop:      "1px solid #000"
  , paddingLeft:    "10px"
  , paddingRight:   "10px"
  , display:        "flex"
  , alignItems:     "center"
  , justifyContent: "space-between"
  , flexDirection:  "row"
  , background:     "white"
  , zIndex:         "9"
  }, style)
  const imageStyle = {
    flex: "0"
  , objectFit:"contain"
  , maxHeight:"60%"
  , width:"100%"
  }
  const imageContainerStyle = {
    position: "relative"
  , display: "flex"
  , flexDirection: "row"
  , alignItems: "center"
  , justifyContent: "flex-end"
  , marginRight: "10px"
  , height: "100%"
  }
  return (
    <footer style={style}>
      <span>bacon</span>
      <div style={imageContainerStyle}>
        <span style={{margin:"0 20px"}}>Powered by the Tangle</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Iota_logo.png" style={imageStyle} />
      </div>
    </footer>
  )
}


const EditorHeader = observer(({style, onSave, editorModel}) => {
  style = _.extend({
    borderBottom:"1px solid #ccc"
  , paddingLeft: "10px"
  , paddingRight: "10px"
  , display: "flex"
  , alignItems: "center"
  , justifyContent: "space-between"
  , flexDirection: "row"
  , width: "100%"
  }, style)
  const toggleEditor = () => {
    editorModel.showPreview = !editorModel.showPreview
  }
  const previewButtonState = {
    text: editorModel.showPreview? "Show Preview" : "Hide Preview"
  , primary: editorModel.showPreview
  }
  const previewButton = editorModel.showPreview ?
    (<Button primary onClick={toggleEditor}>Toggle Preview Panel</Button>)
  : (<Button onClick={toggleEditor}>Toggle Preview Panel</Button>)
  return (
    <header style={style}>
      <Button primary onClick={onSave}>Upload to tangle...</Button>
      {previewButton}
    </header>
  )
})


@observer
class Editor extends React.Component {
  @observable editorModel = new EditorModel()

  render() {
    console.log("EDITOR MODEL:", editorModel)
    const self = this
    const style = {
      container: _.extend({
        position: "relative"
      }, this.props.style)
    , header: {
        position: "absolute",
        left:"0px", right:"0px", top:"0px", height:"50px"
      }
    , editor: {
        position: "absolute",
        left:"0px", right:"0px", bottom:"0px", top:"50px"
      }
    }
    const onChange = (html) => {
      self.html = html
    }
    const onSave = () => {
      self.props.onSave(self.html)
    }
    return (
      <div style={style.container}>
        <EditorHeader style={style.header} onSave={onSave} editorModel={editorModel} />
        <div style={style.editor}>
          <HTMLEditor onChange={onChange} showPreview={editorModel.showPreview} />
        </div>
      </div>
    )
  }
}


const UploadDimmer = observer(({active, bundle, status}) => {
  const subheader = bundle? (<FormBundleURL bundle={bundle} />)
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


const positionAbsolute = (props) => {
  return _.extend({position:"absolute"}, props || {})
}


@observer
class Home extends React.Component {

  @observable loading = false
  @observable status  = ""
  @observable bundle  = null

  onSave(html) {
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
    <DynamicFullscreenHTML html={html} />
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


const HomePath = () => {
  return (<Home />)
}

const Routes = () => {
  return (
    <div style={{height:"100%", width:"100%"}}>
      <Route path="/" exact component={HomePath} />
      <Route path="/:bundle" component={BundleViewerPath} />
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