import React      from 'react'
import {observer} from 'mobx-react'
import brace      from 'brace';
import AceEditor  from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';


const HTMLAceEditor = observer(({width, html, onChange}) => {
  const editorStyle = {
    position: "absolute", top: "0", left: "0", bottom: "0", right: "0"
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


export default HTMLAceEditor;