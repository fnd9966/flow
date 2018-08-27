import React from 'react';

import {Form, Input, Col, Row, AutoComplete, Select, Button, Icon} from 'antd';
import WrappedAddFields from './addFields.js';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class ConfigInfo extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      expand: false,
	      addFieldFlag: false,
	      // isEdit:props.isEdit

	    };
	    // this.fieldData = props.fieldData;
	}
	dataSelect = ['text','time','file','check']
	keys = []
	key = 1
	flag = true
	reset = false
	componentDidMount() {
		const {form ,fieldData} = this.props;
		// console.log(this.props.fieldData);
		// const keys = form.getFieldValue('keys');
		// value.i = this.key;
		// this.keys.push(value);
		// this.key++;
		// form.setFieldsValue({
		// 	keys:this.keys
		// })
		// this.setState({
		// 	addFieldFlag: false
		// })
		// this.fieldData = fieldData;
	}
	// componentWillUpdate(nextProps, nextState) {
	// 	console.log(nextProps.isEdit);
	// 	if(nextProps.isEdit) {
	// 		this.setState({
	// 			isEdit:nextProps.isEdit
	// 		})
	// 	}
	// }
	fieldDataFromEdit = (fieldData) => {
		console.log(fieldData);
		const {form} = this.props;
		if(this.flag) {
			for (let i = 0, kLen = fieldData.keys.length; i < kLen; i++) {
				// fieldData.keys[i].i = this.key;
				this.key = fieldData.keys[i].i;
				this.keys.push(fieldData.keys[i]);
				this.key++;
			}
			form.setFieldsValue({
				keys:this.keys
			});
			this.flag = false;
		}
		
	}
	// componentWillReceiveProps(nextProps) {
	// 	// console.log(nextProps.fieldData);
	// 	// console.log(this.isEmptyObj({}));
	// 	// console.log(this.isEmptyObj(nextProps.fieldData));
	// 	// if(!this.isEmptyObj(nextProps.fieldData) && this.flag) {
	// 	// 	this.fieldData = nextProps.fieldData;
	// 	// 	this.flag = false
	// 	// }
		
	// 	// if(nextProps.handele==='edit'){
	// 	// 	this.fieldData = nextProps.fieldData;
	// 	// 	this.props.editData('','')
	// 	// }
	// 	// 
	// 	// if('fieldData' in nextProps && !!nextProps.fieldData) {
	// 	// 	const {form} = this.props;
	// 	// 	if(nextProps.fieldData.keys.length !== 0 && this.flag) {
	// 	// 		console.log(nextProps.fieldData.keys);
	// 	// 		for (let i = 0, kLen = nextProps.fieldData.keys.length; i < kLen; i++) {
	// 	// 			nextProps.fieldData.keys[i].i = this.key;
	// 	// 			this.keys.push(nextProps.fieldData.keys[i]);
	// 	// 			this.key++;
	// 	// 			form.setFieldsValue({
	// 	// 				keys:this.keys
	// 	// 			})
	// 	// 			this.flag = false
	// 	// 		}
	// 	// 	}
	// 	// }
		
		
	// }

	/**
	 * 展开或收起
	 * @author fnd
	 * @return {[type]} [description]
	 */
	toggle = () => {
	    const { expand } = this.state;
	    this.setState({ expand: !expand });
	}
	/**
	 * 置空
	 * @author fnd
	 * @return {[type]} [description]
	 */
	handleReset = () => {
		this.keys = [];
	    this.props.form.setFieldsValue({
			keys: this.keys
		});
		this.flag = true;
		this.reset = true;
	    this.props.form.resetFields();
	    //点击
	    this.props.reset(true);
	    if(this.isEdit) {
	    	this.props.resetFieldData(null, false);
	    	this.isEdit = false;
			this.setState();
	    }
	    
	}
	/**
	 * 移除新的字段
	 * @author fnd
	 * @param  {[type]} k [description]
	 * @return {[type]}   [description]
	 */
	remove = (k) => {
		const {form} =this.props;
		const keys = form.getFieldValue('keys');
		if(keys.length == 0) {
			return
		}
		this.keys = keys.filter(item => item.i !== k);
		form.setFieldsValue({
			keys: this.keys
		})
	}
	
	/**
	 * 添加事件
	 * @author fnd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleSubmit = (e) => {
		e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        // console.log('Received values of form: ', values);
	        setTimeout(() => {
	        	this.flag = true
	        },0);
	        // this.flag = true;
	        this.reset = false;
	        this.props.form.resetFields();
	        this.keys = [];
		    this.props.form.setFieldsValue({
				keys: this.keys
			});
	        if(this.isEdit) {
	        	this.props.editFieldData(values,false, true);
				this.isEdit = false;
				this.setState();
	        }else {
	        	this.props.addFieldData(values, true);
	        }
	        
	      }
	    });
	}
	/**
	 * 点击新增字段按钮事件
	 * @author fnd
	 * @return {[type]} [description]
	 */
	addField = () => {
		this.setState({
			addFieldFlag: true
		})
	}
	/**
	 * 新增字段的确定添加事件
	 * @author fnd
	 * @param  {[type]} value [description]
	 * @param  {[type]} flag  [description]
	 * @return {[type]}       [description]
	 */
	addFieldShowOrHidden = (value, flag) => {
		// console.log(value);
		const {form} = this.props;
		const keys = form.getFieldValue('keys');
		value.i = this.key;
		this.keys.push(value);
		this.key++;
		form.setFieldsValue({
			keys:this.keys
		})
		this.setState({
			addFieldFlag: false
		})
	}
	renderField = (keys) => {
		const {getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayoutWithOutLabel = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 8}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16}
			}
		}
		// console.log(keys);
		keys.map(item => {
			return (
				<FormItem
					{...formItemLayoutWithOutLabel}
					label = {item.name}
					key = {item.i}
				>
					{getFieldDecorator(item.key, {
						
					})(
						<Input style = {{width: '60%'}} ></Input>
					)}
					{keys.length > 0 ? (
			            <Icon
			              className="dynamic-delete-button"
			              type="minus-circle-o"
			              disabled={keys.length === 0}
			              onClick={() => this.remove(item.i)}
			            />
			          ) : null}
				</FormItem>
	    	)
		})
		
		
	}
	//判断对象是否为空
    isEmptyObj = (o) => {
        if(o) {
            return Object.keys(o).length == 0
        }
    }
    handleOnChange = () => {
    	
    }

	render() { 
		const {getFieldDecorator, getFieldValue } = this.props.form;
		const {fieldData} =this.props;
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 8}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16}
			}
		}
		const formItemLayoutWithOutLabel = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 8}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16}
			}
		}
		if (!!fieldData && fieldData.keys.length !== 0) {
			// console.log(11);
			this.fieldDataFromEdit(fieldData);
		}
		getFieldDecorator('keys', {initialValue: []});
		const keys = getFieldValue('keys');
		const formItems = keys.map(item => {
			// console.log(k);
			return (
				<FormItem
					{...formItemLayoutWithOutLabel}
					label = {item.name}
					key = {item.i}
				>
					{getFieldDecorator(item.key, {
						initialValue: !!fieldData && !!this.isEdit ? fieldData[item.key]: ''
					})(
						<Input style = {{width: '60%'}}></Input>
					)}
					{keys.length > 0 ? (
			            <Icon
			              className="dynamic-delete-button"
			              type="minus-circle-o"
			              disabled={keys.length === 0}
			              onClick={() => this.remove(item.i)}
			            />
			          ) : null}
				</FormItem>
	    	)
		});
		// console.log(this.state.isEdit);
		// console.log(this.props.isEdit);
		this.isEdit = this.props.isEdit;
		return (
			<div>
				<div className = 'addField'>
					{!this.state.addFieldFlag ? <Button type="primary" icon="plus" onClick = {this.addField}>新增字段</Button> : <WrappedAddFields addFieldShowOrHidden = {this.addFieldShowOrHidden}></WrappedAddFields>}
				</div>
				<Form onSubmit = {this.handleSubmit}>
					{this.state.expand ? <div>
						<FormItem
						{...formItemLayout}
						label = '控件标识'
					>
						{getFieldDecorator('column_key', {
							rules: [{
								required: true,
								message: '请输入key'
							}],
							initialValue:!!fieldData && !!this.isEdit ? fieldData.column_key : ''
						})(
							<Input onChange = {this.handleOnChange}></Input>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '控件名称'
					>
						{getFieldDecorator('column_name', {
							rules: [{
								required: true,
								message: '请输入控件名称'
							}],
							initialValue: !!fieldData && !!this.isEdit ? fieldData.column_name : ''
						})(
							<Input onChange = {this.handleOnChange}></Input>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '控件类型'
					>
						{getFieldDecorator('type', {
							rules: [{
								required: true,
								message: '请选择控件类型'
							}],
							initialValue: !!fieldData && !!this.isEdit ? fieldData.type : ''
						})(
							<AutoComplete
			                // value = {text}
			                // style={{ width: 200 }}
			                onChange = {this.handleOnChange}
			                dataSource={this.dataSelect}
			                // onChange={e => this.handleFieldChange(e, 'type', record.key)}
			              />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '是否可编辑'
					>
						{getFieldDecorator('isEdit', {
							// rules: [{
							// 	required: true,
							// 	message: '请输入控件名称'
							// }]
							initialValue: !!fieldData && !!this.isEdit ? fieldData.isEdit : ''
						})(
							<Select style = {{width:'100%'}} onChange = {this.handleOnChange}>
			                <Option value='true'>true</Option>
			                <Option value="false">false</Option>
			              </Select>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '控件isReq'
					>
						{getFieldDecorator('isReq', {
							// rules: [{
							// 	required: true,
							// 	message: '请输入控件名称'
							// }]
							initialValue: !!fieldData && !!this.isEdit ? fieldData.isReq :''
						})(
							<Select style = {{width:'100%'}} onChange = {this.handleOnChange}>
			                <Option value='true'>true</Option>
			                <Option value="false">false</Option>
			              </Select>
						)}
					</FormItem>
					{formItems}
					</div> : <div>
						<FormItem
						{...formItemLayout}
						label = '控件标识'
					>
						{getFieldDecorator('column_key', {
							rules: [{
								required: true,
								message: '请输入key'
							}],
							initialValue: !!fieldData && !!this.isEdit ? fieldData.column_key : ''
						})(
							<Input onChange = {this.handleOnChange}></Input>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '控件名称'
					>
						{getFieldDecorator('column_name', {
							rules: [{
								required: true,
								message: '请输入控件名称'
							}],
							initialValue: !!fieldData && !!this.isEdit ? fieldData.column_name : ''
						})(
							<Input onChange = {this.handleOnChange}></Input>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label = '控件类型'
					>
						{getFieldDecorator('type', {
							rules: [{
								required: true,
								message: '请选择控件类型'
							}],
							initialValue: !!fieldData && !!this.isEdit ? fieldData.type : ''
						})(
							<AutoComplete
							onChange = {this.handleOnChange}
			                // value = {text}
			                // style={{ width: 200 }}
			                dataSource={this.dataSelect}
			                // onChange={e => this.handleFieldChange(e, 'type', record.key)}
			              />
						)}
					</FormItem>
					</div>}
					
			        <Row>
			          <Col span={24} style={{ textAlign: 'right' }}>
			            {!!this.isEdit ? <Button type="primary" htmlType="submit">保存</Button> : <Button type="primary" htmlType="submit">添加</Button>}
			            {!!this.isEdit ? <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
			              放弃
			            </Button> : <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
			              置空
			            </Button>}
			            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
			              {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
			            </a>
			          </Col>
			        </Row>
				</Form>
			</div>
		)
	}
}
const WrapperConfigInfo = Form.create()(ConfigInfo);
export default WrapperConfigInfo