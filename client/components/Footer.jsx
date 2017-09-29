import * as _ from 'lodash'
import React  from 'react'


const Footer = ({style}) => {
  style = _.extend({
    paddingLeft:    "10px"
  , paddingRight:   "10px"
  , display:        "flex"
  , alignItems:     "center"
  , justifyContent: "space-between"
  , flexDirection:  "row"
  , background:     "white"
  , zIndex:         "99999999999999"
  , boxShadow:      "0px -20px 100px 30px white"
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


export default Footer;