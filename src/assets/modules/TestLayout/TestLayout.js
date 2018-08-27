import React from 'react'
import ReactDOM from 'react-dom'
// import TableTest from '../../component/Table_fnd1/Table_fnd1'
import SvgTest from '../../component/Test_fnd/Home.js'
import './css/style.css'


class TestLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  
  }
  property = {
    width:1200,
    height:540,
    // headBtns:["new","open","save","undo","redo","reload"],//如果haveHead=true，则定义HEAD区的按钮
    // haveHead:true
    toolBtns:["cursor","direct","start round mix","end round","task"],
    haveTool:true,
    initLabelText:''
  }
  remark = {
    cursor:"选择指针",
    direct:"结点连线",
    start:"入口结点",
    end:"结束结点",
    task:"任务结点",
    node:"自动结点",
  }
  componentDidMount=() => {
     // new Table()
  }
  render () {
    return (
      <SvgTest svgProperty={this.property} remark={this.remark}></SvgTest>
      
    )
  }
}

export default TestLayout
