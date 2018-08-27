import React from 'react';
import $ from 'jquery';
import './css/Home.css';

class SvgTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width:props.svgProperty.width || 800,
			height:props.svgProperty.height || 500,
			title:props.svgProperty.initLabelText || '流程图'
		}
	}
	editable = false;//在工作区是否可以编辑
	headHeight = 28;
	toolWidth = 31;
	nowType = 'cursor';//现在要绘制的对象类型

	componentDidMount() {
		this.nowType = 'cursor';
		
	}

	render() {
		console.log(this.props);
		return (
			// <div>hello world</div>
			<div style = {{width:this.state.width +'px',height:this.state.height + 'px', margin:'10px'}} id='demo' className='demo'>
				<div className='flow_head'>
					<label title={this.state.title} style={{backgroundColor:'#20a0ff'}}>{this.state.title}</label>
				</div>
				<div className='flow_tool'>
					<div style={{height:507 + 'px'}} className='flow_tool_div'>
						<a href="javascript:void(0);" type='cursor' className='flow_tool_btn' id='demo_btn_cursor' title='选择指针'>
							<i>1</i>
						</a>
						<a href="javascript:void(0);" type='direct' className='flow_tool_btn' id='demo_btn_direct' title='节点连线'>
							<i>2</i>
						</a>
						<a href="javascript:void(0);" type='cursor' className='flow_tool_btn' id='demo_btn_start' title='入口节点'>
							<i>3</i>
						</a>
						<a href="javascript:void(0);" type='cursor' className='flow_tool_btn' id='demo_btn_end' title='结束节点'>
							<i>4</i>
						</a>
						<a href="javascript:void(0);" type='cursor' className='flow_tool_btn' id='demo_btn_node' title='任务节点'>
							<i>5</i>
						</a>
					</div>
				</div>
				<div className='flow_work'>
					
				</div>
			</div>
		)
	}
}
export default SvgTest