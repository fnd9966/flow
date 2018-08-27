import React from 'react'
import ReactDOM from 'react-dom'
// import FndTest from '../../component/FndTest/FndTest'
import MappingLayout from '../../component/mappingLayout/mappingLayout'
// import './css/style.css'


class FndTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {   
      
    }
  }
  componentDidMount=() => {
     // new Table()
  }
  data = [['funidan','funidan','funidan','funidan'],['funidan','funidan','funidan','funidan']]
  render () {
    return (
      <MappingLayout></MappingLayout>
    )
  }
}

export default FndTable
