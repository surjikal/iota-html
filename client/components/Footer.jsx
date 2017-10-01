import * as _ from 'lodash'
import React  from 'react'
import {Icon} from 'semantic-ui-react'


const Footer = ({style}) => {
  style = _.extend({
    paddingLeft:    "10px"
  , paddingRight:   "10px"
  , display:        "flex"
  , alignItems:     "center"
  , justifyContent: "space-between"
  , flexDirection:  "row"
  , background:     "white"
  , zIndex:         "9"
  , borderTop:      "1px solid #eee"
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
      <div>
        <a href="https://github.com/surjikal/iota-html" target="_blank">
          <Icon color='black' link name='github' size='big' />
        </a>
      </div>
      <div style={imageContainerStyle}>
        <span style={{margin:"0 20px"}}>Powered by the Tangle</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Iota_logo.png" style={imageStyle} />
      </div>
    </footer>
  )
}


export default Footer;