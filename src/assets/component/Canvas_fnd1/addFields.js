import React from 'react';
import {Form, Input, Button} from 'antd';
import './css/addFiels.css';
const FormItem = Form.Item;

class AddFieldData extends React.Component {
	componentDidMount() {
    // To disabled submit button at the beginning.
	    this.props.form.validateFields();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
	      if (!err) {
	        // console.log('Received values of form: ', values);
	        this.props.addFieldShowOrHidden(values, false);
	      }
	    });

	}
	
	hasErrors = (fieldsError) => {
	  return Object.keys(fieldsError).some(field => fieldsError[field]);
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

	    // Only show error after a field is touched.
	    const keyError = isFieldTouched('key') && getFieldError('key');
	    const nameError = isFieldTouched('name') && getFieldError('name');
		return (
			<Form layout = 'inline' onSubmit = {this.handleSubmit}>
				{/*<FormItem>
					<Button icon = 'plus'></Button>
				</FormItem>*/}
				<FormItem
					validateStatus = {keyError ? 'error' : ''}
					help = {keyError ||''}
					style = {{width: '30%'}}
				>
					{getFieldDecorator('key', {
						rules: [{
							required: true,
							message: '请输入字段key'
						}]
					})(
						<Input></Input>
					)}
				</FormItem>
				<FormItem
					validateStatus = {nameError ? 'error' : ''}
					help = {nameError || ''}
					style = {{width: '42%'}}
				>
					{getFieldDecorator('name', {
						rules: [{
							required: true,
							message: '请输入字段名'
						}]
					})(
						<Input></Input>
					)}
				</FormItem>
				<FormItem style = {{width:'20%'}}>
					<Button type = 'primary' htmlType = 'submit' disabled = {this.hasErrors(getFieldsError())}>确定</Button>
				</FormItem>
			</Form>
		)
	}
}
const WrappedAddFields = Form.create()(AddFieldData);
export default WrappedAddFields