import * as _     from 'lodash'
import React      from 'react'
import {observer} from 'mobx-react'
import brace      from 'brace';
import AceEditor  from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';


const HTMLAceEditor = observer(({style, width, html, onChange}) => {
  const editorStyle = {
    position: "absolute", top: "0", left: "0", bottom: "0", right: "0"
  }
  style = _.extend({
      width: "100%"
    , height: "100%"
    , position: "relative"
  }, style)
  const state = {
        showPrintMargin: false
    ,   showGutter: false
    ,   highlightActiveLine: false
  }
  return (
    <div style={style}>
      <AceEditor
        mode="html"
        style={editorStyle}
        width={width}
        showGutter={state.showGutter}
        showPrintMargin={state.showPrintMargin}
        highlightActiveLine={state.highlightActiveLine}
        height="100%"
        theme="github"
        fontSize="11px"
        onChange={onChange}
        value={html}
        editorProps={{$blockScrolling: true}}
      />_
    </div>)
})


export default HTMLAceEditor;