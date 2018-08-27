import React from 'react';
// import './css/form_fnd.less';
// import AttrTable from './attrTable.js';
import { AutoComplete, InputNumber, Col, Row, Form, Input, Button } from 'antd';
import './css/config.css';
import TableForm from './zzfTable.js';
import ApiTable from './apiTable.js';
import AddNewAttr from './addNewAttr.js';

const FormItem = Form.Item;
class ConfigModalForm extends React.Component {
	constructor(props){
        super(props)
        this.state = {
            nodeName:props.nodeName,
            newAttr:'',
            delAttr:'',
            delApi:'',
            newApi:''
        }
    }
    attr = [];
    api = [];
    handleClose = () => {
        this.props.showOrHidden(false);
    }
    handleSaveClose = () => {
        this.props.showOrHidden(false);
        // console.log(this.state.nodeName);
        this.props.modifyText(this.state.nodeName);
        this.props.modifyId(this.refs.nodeId.value);
        let data = {
            attr:this.attr,
            api:this.api
        };
        this.props.handleSaveData(data);
    }
    handleInput = (e) => {
        // let value = this.refs.nodeName.value;
        this.setState({
            nodeName:e.target.value
        })
        // this.props.handleNodeName(value)
    }
    handleDataApi = (data) => {
        this.api = data;
        // console.log(data);
    }
    handleDataAttr = (data) => {
        this.attr = data;
        // console.log(data);
    }
    handleNewData = (value) => {
        this.setState({
            newAttr:value
        })
    }
    handleDelData = (value) => {
        // console.log('handledeldata',value)
        this.setState({
            delAttr:value
        })
    }
    handleDelDataApi = (value) => {
        this.setState({
            delApi:value
        })
    }
    handleNewDataApi = (value) => {
        this.setState({
            newApi:value
        })
    }
    handleSelected = (value) => {
        // console.log(value);
        this.type = value;
    }
    handleSaveNode = (e) => {
        // console.log('savenide');
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
        // console.log(nodes);

    }
    handleAttrData = (value) => {
        this.attrData = value
    }
    handleApiData = (value) => {
        this.apiData = value;
    }
    render() {
        const dataSource = ['task','desition'];
        const { getFieldDecorator } = this.props.form;
    	return (
            <div>
                <div className = 'modalMask'></div>
                <div className = 'modalLayout'>
                    <div className = 'modalName'>{`${this.state.nodeName}节点表单配置`} <span className = 'btnClose' onClick = {() => this.handleClose()}>×</span></div>
                    <div className = 'modalContent'>
                        <div className = 'modalMain'>
                            {/*编辑节点名称*/}
                            <div className = 'editNodeName card'>
                                <div className = 'card_head'>
                                    <div className = 'card_head_wrapper'>
                                        <div className = 'card_head_title'>节点信息基本配置</div>
                                    </div>
                                </div>
                                <div className = 'card_body'>
                                    <Form onSubmit = {this.handleSaveNode}>
                                        <Row gutter = {24}>
                                            <Col span = {8}>
                                                <FormItem label = 'node_name'>
                                                    {getFieldDecorator('node_name', {
                                                        rules:[{
                                                            required:true,
                                                            message:'input node_name...'
                                                        }],
                                                        initialValue:this.props.nodeName
                                                    })(<Input onChange = {this.handleInput}></Input>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <FormItem label = 'type'>
                                                    {getFieldDecorator('type', {
                                                        rules:[{
                                                            required:true,
                                                            message:'input type...'
                                                        }]
                                                    })(<AutoComplete style = {{width:'100%'}} dataSource = {dataSource} onChange = {this.handleSelected}></AutoComplete>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <FormItem label = 'exec_role'>
                                                    {getFieldDecorator('exec_role', {
                                                        rules:[{
                                                            required:true,
                                                            message:'input exec_role...'
                                                        }]
                                                    })(<Input></Input>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <FormItem label = 'index_id'>
                                                    {getFieldDecorator('index_id', {
                                                        rules:[{
                                                            required:true,
                                                            message:'input index_id...'
                                                        }]
                                                    })(<Input></Input>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <Button className = 'btnSaveNode' htmlType = 'submit'>保存</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                            <div className = 'editAttrTable card'>
                                <div className = 'card_head'>
                                    <div className = 'card_head_wrapper'>
                                        <div className = 'card_head_title'>attribute字段配置</div>
                                    </div>
                                </div>
                                <div className = 'card_body'>
                                    <AddNewAttr handleNewData = {this.handleNewData} handleDelData = {this.handleDelData}></AddNewAttr>
                                    <TableForm handleAttrData = {this.handleAttrData} onChange = {this.handleDataAttr} delValue = {this.state.delAttr} newValue = {this.state.newAttr}></TableForm>
                                </div>
                                
                            </div>
                            
                            <div className = 'editApiTable card'>
                                <div className = 'card_head'>
                                    <div className = 'card_head_wrapper'>
                                        <div className = 'card_head_title'>api字段配置</div>
                                    </div>
                                </div>
                                <div className = 'card_body'>
                                    <AddNewAttr handleNewData = {this.handleNewDataApi} handleDelData = {this.handleDelDataApi}></AddNewAttr>
                                    <ApiTable handleApiData = {this.handleApiData} onChange = {this.handleDataApi} delApi = {this.state.delApi} newApi = {this.state.newApi}></ApiTable>
                                </div>
                                
                            </div>
                            <div className = 'submitDiv' onClick = {() => this.handleSaveClose()}>
                                保存
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
}
const ConfigModalTest = Form.create()(ConfigModalForm)
export default ConfigModalTest