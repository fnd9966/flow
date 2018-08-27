import React from 'react'
import ReactDOM from 'react-dom'

class Test extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }
  theme = 'default';
  config = {
      height : 100,
      width : 100
  }
  componentWillMount = () => {
      if(this.props.theme !== undefined) this.theme = this.props.theme; 
      if(this.props.config !== undefined) this.config = Object.assign(this.config,this.props.config);
  }
  componentDidMount=() => {

  }

  render () {
    let {data} = this.props;
    return (
      <div className = {'Test ' + this.theme} style = {{height : this.config.height,width : this.config.width,backgroundColor:'#aa0'}}>
            {data}
      </div>
    )
  }
}

export default Test
