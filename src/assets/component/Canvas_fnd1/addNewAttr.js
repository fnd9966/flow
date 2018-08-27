import React from 'react';
import { Button, Input } from 'antd';
import './css/addNewAttr.css';

class AddNewAttr extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			newFlag:false,
			option:[],
			delAttr:'',
			attr:''
		}
	}
	componentDidMount() {
	}
	componentWillUpdata(nextProps, nextState) {
		console.log(nextState);
		
	}
	componentDidUpdate() {
	}
	handleNew = () => {
		this.setState({
			newFlag:true
		})
	}
	handleOnChange = (e) => {
		this.setState({
			attr:e.target.value
		})
	}
	handleEnter = () => {
		this.refs.newAttr.input.value = '';
		this.props.handleNewData(this.state.attr);
		this.state.option.push(this.state.attr);
		this.setState({
			option:this.state.option,
		})
		// this.refs.newAttr.value = '';
		setTimeout(() => {
			this.props.handleNewData();
		},0);
		this.refs.newAttr.input.value = '';		
	}
	handleClose = () => {
		this.setState({
			newFlag:false
		})
	}
	remove = (arr,item) => {
		let res = [];
		for(let i = 0; i < arr.length; i++) {
			if(arr[i]!=item) {
				res.push(arr[i]);
			}
		}
		return res;
	}
	handleDel = () => {
		// console.log('addnewattr:',this.state.delAttr);
		this.props.handleDelData(this.state.delAttr);
		setTimeout(() => {
			let newOption = this.remove(this.state.option,this.state.delAttr);
			this.setState({
				option:newOption
			});
			this.props.handleDelData();
		},0)


	}
	handleOption = (e) => {
		this.setState({
			delAttr:e.target.value
		})
	}
	render() {
		// console.log(this.state.option);
		return (
			<div className = 'addNewAttr'>
				<div className = 'addNew'>
					<Button onClick = {() => this.handleNew()}>新增自定义字段</Button>
					{this.state.newFlag ? <span>
						<Input type="text" ref = 'newAttr' style = {{width:200,marginRight:10}} onChange = {this.handleOnChange} />
						<Button onClick = {() => this.handleEnter()}>确定</Button>
						<Button onClick = {() => this.handleClose()}>取消</Button>
					</span> : ''}
				</div>
				<div className = 'delDiv'>
					<select onChange = {this.handleOption} name="" id="" ref = 'select' className = 'selectDel'>
						<option value="">--请选择--</option>
						{this.state.option.map((item) => {
							return (
								<option value={item}>{item}</option>
							)
						})}
					</select>
					<Button onClick = {() => this.handleDel()}>删除新增自定义字段</Button>
				</div>
			</div>
		)
	}
}

export default AddNewAttr