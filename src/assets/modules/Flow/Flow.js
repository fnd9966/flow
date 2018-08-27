import React from 'react';

class Flow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	config = {
		height:document.documentElement.clientHeight || document.body.clientHeight,
		width: document.documentElement.clientWidth || document.body.clientWidth
	}
	componentWillMount() {
		
	}

	componentDidMount() {

	}
	
	/*关闭编辑面板*/
	closeEdit = () => {
		console.log('关闭');
	}

	render() {
		let c = this.config;
		return (
			<div className = 'flowLayout' style = {{ height: c.height, width: c.width }}>
				<div className = 'flow_title'>
				编辑 <span onClick = {() => this.closeEdit()}>×</span>
				</div>
				
			</div>
		)
	}
}

export default Flow

