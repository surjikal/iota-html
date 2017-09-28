import React      from 'react'
import {observer} from 'mobx-react'


const Iframe = observer(({html}) => {
  const style = {
    border:'none', width:'100%', height:'100%',
    position:"absolute", top:"0", left:"0", right:"0", bottom:"0"
  }
  return (<iframe style={style} srcDoc={html} />)
})

export default Iframe;