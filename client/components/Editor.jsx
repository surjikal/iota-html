
import * as _       from 'lodash'
import React        from 'react'
import {observer}   from 'mobx-react'
import {observable} from 'mobx'
import Dock         from 'react-dock'
import {Button}     from 'semantic-ui-react'

import HTMLAceEditor from './HTMLAceEditor'
import Iframe from './Iframe'


class EditorModel {
  @observable html = ""
  @observable showPreview = true
}


const EditorHeader = observer(({style, onSave, editorModel}) => {
  style = _.extend({
    paddingLeft: "10px"
  , paddingRight: "10px"
  , display: "flex"
  , alignItems: "center"
  , justifyContent: "space-between"
  , flexDirection: "row"
  , width: "100%"
  , borderBottom: "1px solid #eee"
  }, style)
  const toggleEditor = () => {
    editorModel.showPreview = !editorModel.showPreview
  }
  const previewButtonState = {
    text: editorModel.showPreview? "Show Preview" : "Hide Preview"
  , primary: editorModel.showPreview
  }
  const previewButton = editorModel.showPreview ?
    (<Button size='tiny' basic primary onClick={toggleEditor}>Toggle Preview Panel</Button>)
  : (<Button size='tiny' basic onClick={toggleEditor}>Toggle Preview Panel</Button>)
  return (
    <header style={style}>
      <Button size='tiny' primary onClick={onSave}>Upload to tangle...</Button>
      {previewButton}
    </header>
  )
})


@observer
class HTMLEditor extends React.Component {
  @observable widths = {preview:0.5, editor:0.5}
  @observable html = ""

  render() {
    const self = this
    const style = _.extend({
      position: "relative"
    , overflow: "hidden"
    , width:    "100%"
    , height:   "100%"
    , minWidth: "20px"
    }, this.props.style)
    const widths = self.props.showPreview? self.widths : {preview:0, editor:1}
    const dockStyle = {
      position: "absolute"
    , overflow: "hidden"
    , borderLeft: "1px solid #ccc"
    }
    const onSizeChange = (width) => {
      self.widths = {preview: width, editor: (1 - width)}
    }
    const onChange = (html) => {
      self.html = html
      self.props.onChange(html)
    }
    const dockStyleStr = `
    #dock {
      width: 0px; height: 0px; top: 0px; left: 0px; z-index: 99999999;
    }
    #dock > div {
      position: static !important;
    }
    #dock > div > div {
        box-shadow: none !important;
        border-left: none !important;
        min-width: 50px !important;
    }
    #dock > div > div > div:first-child {
        left: 0px !important;
        opacity: 1 !important;
        width: 7px !important;
        background: #eee;
    }
    #dock > div > div > div:first-child:hover,
    #dock > div > div > div:first-child:active {
        background: #ddd;
    }
    #dock > div > div > div:last-child {
        margin-left: 10px;
        position: relative;
    }`
    return (
      <div style={style}>
          <div style={{height:"100%", width:"100%"}}>
            <HTMLAceEditor width={widths.editor} html={this.html} onChange={onChange} />
          </div>
          <div id="dock">
            <style>{dockStyleStr}</style>
            <Dock dockStyle={dockStyle} position='right' dimMode='none' size={widths.preview} onSizeChange={onSizeChange} isVisible={this.props.showPreview}>
              <Iframe html={this.html} />
            </Dock>
          </div>
      </div>
    )
  }
}



@observer
class Editor extends React.Component {
  @observable editorModel = new EditorModel()

  render() {
    const editorModel = this.editorModel
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


export default Editor;
