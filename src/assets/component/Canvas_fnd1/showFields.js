import React from 'react';
import {Divider ,notification, Button, Popconfirm} from 'antd';
import './css/showFields.css';
class ShowFields extends React.Component {
	constructor(props){
        super(props)
        this.state = {
            editFlag: true,
            value: props.value
        }
    }
	// value = []
	_i = -1
	_h = 0
	componentDidMount() {
		this.height = document.getElementById('config').offsetHeight;

	}
	// componentWillReceiveProps(nextProps) {
	// 	if('value' in nextProps) {
	// 		this.value = nextProps.value;
	// 	}
	// } 
	openNotification = () => {
	  this.notificationFlag = true;
	  notification.open({
	  	message: '警告',
	    description: '请先保存修改或放弃修改！',
	    onClose: this.close,
	  });
	}
	close = () => {
		this.notificationFlag = false;
		// this.props.isQuitEdit(false);
	}

	/**
	 * 修改字段
	 * @author fnd
	 * @return {[type]} [description]
	 */
	edit = (data, index, flag) => {
		// console.log(data);
		if(this.state.editFlag) {
			this.props.editData(data,index,flag);
			this.setState({
				editFlag: false
			})
		}else {
			if(!this.notificationFlag) {
				this.openNotification();
			}
			
		}
		
	}
	/**
	 * 删除控件
	 * @author fnd
	 * @return {[type]} [description]
	 */
	deleteField = data => {
		// console.log(data)
		this.props.deleteFieldData(data);
	}
	changeEditFlag = (flag) => {
		this.setState({
			editFlag:flag
		})
	}
	/**
	 * 改变动态改变iframe的高度
	 * @author fnd
	 * @return {[type]} [description]
	 */
	changeHeight = () => {
		// let height = document.getElementById('config').offsetHeight;
		console.log(this.height);
		this.setState({
			height: this.height
		})
	}
	// _refresh = (flag, value) => {
	// 	// console.log(flag);
	// 	console.log(value)
	// 	this.setState({
	// 		editFlag: flag,
	// 		value: value
	// 	});
	// 	// this.value = value;
	// }
	render() {
		let {i, h, quitEdit, value} = this.props;
		// console.log(value);
		// console.log(this._i, i);
		if (this._i != i) {
			this._i = i;
			this.changeEditFlag(quitEdit);
		}
		// console.log(this._h, h)
		// if(this._h != h) {
		// 	this._h = h;
		// 	this.changeHeight()
		// }
		return (
			<div>
				<div className = 'pcAndAppHead'>
					<div className = 'pc'>pc</div>
					<div className = 'app'>app</div>
					<div className = 'edit'>
						<span>
					      <a href="javascript:;" onClick = {() => this.edit()}>操作</a>
					    </span>
					</div>
				</div>
				<ul className = 'fieldBox' style = {{height: this.height}}>
					{this.state.value ? this.state.value.map((item, index) => {
						return (
							<li className = 'liBox'>
								<div className = 'pc'>
									<iframe className = 'iframe' scrolling="auto" src={`http://192.168.118.226:9018/webapi2/web/app/attributeView_PC.html?type=${item.type}&column_name=${item.column_name}`} frameborder="0"></iframe>
								</div>
								<div className = 'app'>
									<iframe className = 'iframe' scrolling = 'auto' src={`http://192.168.118.226:9018/webapi2/web/app/attributeView_APP.html?type=${item.type}&column_name=${item.column_name}`} frameborder="0"></iframe>
								</div>
								<div className = 'edit'>
									<span>
								      <a href="javascript:;" onClick = {() => this.edit(item, index, true)}>修改</a>
								      <Divider type="vertical" />
								      <Popconfirm title="是否要移除此行？" onConfirm={() => this.deleteField(index)}>
						                <a>移除</a>
						              </Popconfirm>

								      {/*<a href="javascript:;" onClick = {() => this.deleteField(index)}>移除</a>*/}
								    </span>
								</div>
							</li> 
						)
					}) : ''}
				</ul>
			</div>
		)
	}
}
export default ShowFields