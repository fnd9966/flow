import React from 'react'
import ReactDOM from 'react-dom'

class Content extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }
  componentDidMount=() => {
      T.on('alert',() => { alert('alert')})
      T.on('dc_data',(data) => {
          this.data = data.new;
          this.setState();
      })
  }
  data = '数据'
  render () {
    return (
      <div>
          {
              React.Children.map(this.props.children,(child,i) => <div>{child}</div>)
          }
          <div onClick = {() => this.props.clickEvent('数据')}>{this.data}</div>
      </div>
    )
  }
}

export default Content
