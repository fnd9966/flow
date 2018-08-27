import React from 'react';
import './css/flowForm.less';
import { Form, Input, Button, InputNumber } from 'antd';

const FormItem = Form.Item;

class FlowForm extends React.Component {
	constructor(props) {
		super(props);
		// console.log
		this.state = {
			flow_id:'',
			flow_name:'',
			sys_name:'',
			code:'',
			pjcd:'',
			orderid:'',
			code_fmt:'',
			flag:false, //判断是否是已有加载的
		}
	}
	/**
	 * 判断对象是否为空
	 * @author fnd
	 * @return {[type]} [description]
	 */
	objIsEmpty = (obj) => {
		if(obj) {
			// console.log(obj)
			return JSON.stringify(obj) == "{}" ? true : false
		}
	}
	componentDidMount() {
		// console.log(this.props.value);
		let value = this.props.value;
		if(value && !this.objIsEmpty(value)) {
			this.setState({
				flow_name:value.flow_name,
				flow_id:value.flow_id,
				sys_name:value.sys_name,
				code:value.code,
				pjcd:value.pjcd,
				orderid:value.orderid,
				code_fmt:value.code_fmt,
				design:value.design,
				flag:true
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if('value' in nextProps) {
			if(nextProps.value) {
				this.setState({
				flow_name:nextProps.value.flow_name,
				flow_id:nextProps.value.flow_id,
				sys_name:nextProps.value.sys_name,
				code:nextProps.value.code,
				pjcd:nextProps.value.pjcd,
				orderid:nextProps.value.orderid,
				code_fmt:nextProps.value.code_fmt,
				design:nextProps.value.design
			})
			}
			
			
		}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err,value) => {
			if(!err) {
				// console.log(value);
				this.props.handleData(value,true);
				if(value) {
					this.props.handleClose(false);
				}
			}
		});
		// this.props.handleClose(false);
	}
	handleClose = () => {
		// console.log(this.state.flag)
		if(this.state.flag) {
			this.props.handleData(this.props.value,true);
		}else {
			this.props.handleData(null,false);
		}
		this.props.handleClose(false);
		// this.props.handleData(null,false);
	}

	//自定义校验flowid是否存在
	idExist = (rule, value, callback) => {
		const allId = this.props.idData;
		if(value && allId.includes(value) && !this.props.disableFlowId) {
			callback('flow_id 已存在！')
		}else {
			callback()
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol:{
				span:8
			},
			wrapperCol:{
				span:12
			}
		};
		const btnLayout = {
			wrapperCol:{
				span:16,
				offset:8
			}
		}
		return (
			<div className = 'modalForm'>
				<div className = 'modalFlowLayout'>
					<div className = 'modalName'>流程图配置<span className = 'btnClose' onClick = {() => this.handleClose()}>×</span></div>
					<div className = 'modalContent'>
						<Form onSubmit = {this.handleSubmit}>
							<FormItem label = '流程名称' {...formItemLayout}>
								{getFieldDecorator('flow_name', {
									rules:[{
										required:true,
										message:'请输入流程图名称...'
									}],
									initialValue:this.state.flow_name
								})(
									<Input></Input>
								)}
							</FormItem>
							{this.props.disableFlowId ? <FormItem label = '流程类型id' {...formItemLayout}>
								{getFieldDecorator('flow_id', {
									rules:[{
										required:true,
										message:'请输入流程图id...'
									}],
									initialValue:this.state.flow_id
								})(
									<InputNumber min = {1} disabled = {this.props.disableFlowId}></InputNumber>
								)}
							</FormItem> : ''}
							<FormItem label = '流程所属的项目系统' {...formItemLayout}>
								{getFieldDecorator('sys_name', {
									initialValue:this.state.sys_name
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem label = '编码' {...formItemLayout}>
								{getFieldDecorator('code', {
									initialValue:this.state.code
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem label = '工程编码' {...formItemLayout}>
								{getFieldDecorator('pjcd', {
									initialValue:this.state.pjcd
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem label = '流程描述' {...formItemLayout}>
								{getFieldDecorator('design', {
									initialValue:this.state.design
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem label = '流程编码格式' {...formItemLayout}>
								{getFieldDecorator('code_fmt', {
									initialValue:this.state.code_fmt
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem label = '流程顺序' {...formItemLayout}>
								{getFieldDecorator('orderid', {
									initialValue:this.state.orderid
								})(
									<Input></Input>
								)}
							</FormItem>
							<FormItem {...btnLayout}>
					          <Button type="primary" htmlType="submit">保存</Button>
					        </FormItem>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}

const WrapperFlowForm = Form.create()(FlowForm);

export default WrapperFlowForm