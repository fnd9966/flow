import React from 'react';
import './css/Canvas.less';
// import Canvas_fnd from '../../component/Canvas_fnd/Canvas_fnd.js';
import Canvas_fnd from '../../component/Canvas_fnd1/Canvas_fnd.js';

class Canvas extends React.Component {
	constructor(props) {
		super(props);

		this.state = {

		}
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
	//画布的宽度 高度

	render() {
		return (
			
			<Canvas_fnd></Canvas_fnd>
			
		)
	}
}
export default Canvas