import React from 'react';
import { AutoComplete, InputNumber, Col, Row, Form, Input, Button, message } from 'antd';
import './css/config.css';
import ApiTable from './apiTable.js';
import AddNewAttr from './addNewAttr.js';
import WrapperConfigInfo from './config.js';
import ShowFields from './showFields.js';

const FormItem = Form.Item;
class ConfigModalForm extends React.Component {
    constructor(props){
        super(props)
        console.log(props.data)
        this.state = {
            nodeName:props.nodeName,
            newAttr:'',
            delAttr:'',
            delApi:'',
            newApi:'',
            basicNode:{
                node_name:props.data ? props.data.node_name : '',
                node_type:props.data ? props.data.node_type : '',
                exec_role:props.data ? props.data.exec_role : '',
                index_id:props.data ? props.data.index_id : ''
            },
            basicSave:true,//节点基本信息配置是否保存
            fieldData:props.data ? props.data.attribute : [],
            apiData:props.data ? props.data.api : [], //节点接口参数配置
            nowEidtData:null,
            editFlag: false,
            isQuitEdit: false,
            quitEdit: true
        }
        
    }
    attr = [];
    api = [];
    newApi = [];
    newAttr = [];
    fieldData = [];
    dataFlag = true
    _i = 0
    _j = 0
    _a = 0
    _h = -1
    // setHandel = (str) => {
    //     this.handele =  
    // }
    handleClose = () => {
        this.props.showOrHidden(false);
    }
    //保存关闭 
    handleSaveClose = () => {
        this.props.modifyText(this.state.nodeName);
        
        let nodeInfo = this.state.basicNode;

        nodeInfo.attribute = this.state.fieldData;
        // nodeInfo.attribute = this.isArray(this.attr) ? this.attr: JSON.parse(this.props.data.attribute);
        nodeInfo.api = this.state.apiData;
        // console.log(nodeInfo);
        // console.log(this.state.apiData)

        if(!this.state.basicSave) {
            message.warning('节点的基本信息还未保存，请保存！');
            this.props.showOrHidden(true);
        }else {
            this.props.showOrHidden(false);
            this.props.handleSaveData(nodeInfo);
        }
    }
    /**
     * node_name变化时，改变弹出框的名称以及基本设置未保存
     * @author fnd
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleInput = (e) => {
        // let value = this.refs.nodeName.value;
        this.setState({
            nodeName:e.target.value,
            basicSave:false
        })
        // this.props.handleNodeName(value)
    }
    handleDataApi = (data) => {
        this.api = data;
    }
    handleDataAttr = (data) => {
        this.attr = data;

    }
    handleNewData = (value) => {
        this.setState({
            newAttr:value
        })
    }
    handleDelData = (value) => {
        this.setState({
            delAttr:value
        });
        this.remove(value,this.newAttr);
    }
    handleDelDataApi = (value) => {
        this.setState({
            delApi:value
        });
        this.remove(value,this.newApi);
    }
    handleNewDataApi = (value) => {
        this.setState({
            newApi:value
        });
    }
    //删除数组中的某个元素
    indexOF = (value, arr) => {
        for (let i = 0, aLen = arr.length; i < aLen; i++) {
            if(arr[i] == value) return i;
            return -1;
        }
    }
    remove = (value, arr) => {
        let index = this.indexOF(value, arr);
        if(index > -1) {
            arr.splice(index,1);
        }
    }
    handleSelected = (value) => {
        // console.log(value);
        this.type = value;
        this.setState({
            basicSave:false
        })
    }
    handleChange = () => {
        this.setState({
            basicSave:false
        })
    }
    handleSaveNode = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.setState({
                basicNode:values,
                basicSave:true
            });
          }
        });

    }
    handleAttrData = (value) => {
        this.attrData = value
    }
    /**
     * 保存接口参数配置
     * @author fnd
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    handleApiData = (value) => {
        // this.apiData = value;
        this.setState({
            apiData:value
        })
    }
    //判断是否是数组类型
    isArray = (o) => {
        return Object.prototype.toString.call(o)=='[object Array]';
    }
    //判断对象是否为空
    isEmptyObj = (o) => {
        if(o) {
            return Object.keys(o).length == 0
        }else {
            return true
        } 
    }
    /**
     * 保存配置
     * @author fnd
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    addFieldData = (value, quitEdit) => {
        this.state.fieldData.push(value);
        // console.log(this.fieldData);
        this._i++;
        this.setState({
            fieldData: this.state.fieldData,
            nowEidtData: null,
            quitEdit: quitEdit
        });

    }
    /**
     * 修改配置
     * @author fnd
     * @param  {[type]} value [description]
     * @param  {[type]} flag  [description]
     * @return {[type]}       [description]
     */
    editFieldData = (value, flag, isQuitEdit) => {
        // this.idx = index;
        // console.log(value, flag);
        this._i++;
        this.state.fieldData[this.idx] = value;
        this.setState({
            editFlag: flag,
            fieldData: this.state.fieldData,
            quitEdit: isQuitEdit
        })
    }
    /**
     * 修改字段
     * @author fnd
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    editData = (data,index, flag) => {
        // console.log(flag);
        this.idx = index;
        this.setState({
            nowEidtData: data,
            editFlag: flag
        });
    }
    /**
     * 放弃字段配置
     * data:值
     * flag:是否改变按钮的字
     */
    resetFieldData = (data, flag) => {
        this.setState({
            nowEidtData: data,
            editFlag: flag
        })
    }
    /**
     * 删除某个控件
     * @author fnd
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    deleteFieldData = (index) => {
        // console.log(index);
        this.state.fieldData.splice(index,1);
        this.setState({
            fieldData: this.state.fieldData
        })
    }
    /**
     * 修改当前节点的字段配置
     */
    changeFieldData = (data) => {
        // console.log(data);
        this.setState({
            fieldData: data
        })
    }
    /**
     * 放弃控件编辑
     * @author fnd
     * @param  {[type]} quitEdit [description]
     * @return {[type]}          [description]
     */
    handleReset = (quitEdit) => {
        this._i++;
        this.setState({
            quitEdit: quitEdit
        })
    }
    changeIframeHeight = () => {
        this._h++;
        this.setState()
    }
    /**
     * 初始化控件值
     * @author fnd
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    // initFieldData = (data) => {
    //     this.setState({
    //         fieldData: data
    //     })
    // }
    /**
     * 初始化节点接口参数配置
     * @author fnd
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    // initApiData = (data) => {
    //     this.setState({
    //         apiData: data
    //     })
    // }
    render() {
        const dataSource = ['task','desition'];
        const { getFieldDecorator } = this.props.form;
        let {i, data} = this.props;
        // console.log(this.state.fieldData)
        // console.log(this._i, i)
        // console.log(data);
        // if(data && data.attribute) {
        //     if(this._j != i) {
        //         this._j = i;
        //         // this._i++;
        //         this.initFieldData(data.attribute);
        //     }
        // }
        // if(data && data.api) {
        //     if(this._a != i) {
        //         this._a = i;
        //         this.initApiData(data.api);
        //     }
        // }
        
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
                                                <FormItem label = '节点名称'>
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
                                                <FormItem label = '节点类型'>
                                                    {getFieldDecorator('node_type', {
                                                     initialValue:this.props.data ? this.props.data.node_type : ''
                                                    })(<AutoComplete style = {{width:'100%'}} dataSource = {dataSource} onChange = {this.handleSelected}></AutoComplete>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <FormItem label = '执行者角色'>
                                                    {getFieldDecorator('exec_role', {
                                                      initialValue: this.props.data ? this.props.data.exec_role : ''
                                                    })(<Input onChange = {this.handleChange}></Input>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <FormItem label = '执行顺序'>
                                                    {getFieldDecorator('index_id', {
                                                      initialValue: this.props.data ? this.props.data.index_id : ''
                                                    })(<InputNumber onChange = {this.handleChange}></InputNumber>)}
                                                </FormItem>
                                            </Col>
                                            <Col span = {8}>
                                                <Button className = 'btnSaveNode' htmlType = 'submit' type = {this.state.basicSave ? 'default' : 'primary'}>保存</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                            <div className = 'editAttrTable card'>
                                <div className = 'card_head'>
                                    <div className = 'card_head_wrapper'>
                                        <div className = 'card_head_title'>节点补充说明配置</div>
                                    </div>
                                </div>
                                <div className = 'card_body'>
                                    {/*<AddNewAttr handleNewData = {this.handleNewData} handleDelData = {this.handleDelData}></AddNewAttr>
                                    <TableForm value = {this.props.data ? (this.isArray(this.props.data.attribute) ? this.props.data.attribute : (this.isEmptyObj(this.props.data.attribute) ? [] : (typeof(this.props.data.attribute) ? eval(this.props.data.attribute) : JSON.parse(this.props.data.attribute)))): []} handleAttrData = {this.handleAttrData} onChange = {this.handleDataAttr} delValue = {this.state.delAttr} newValue = {this.state.newAttr}></TableForm>*/}
                                    <Row gutter = {24}>
                                        <Col span = {8}  id = 'config'>
                                            <WrapperConfigInfo changeIframeHeight = {this.changeIframeHeight} reset = {this.handleReset} resetFieldData = {this.resetFieldData} editFieldData = {this.editFieldData} addFieldData = {this.addFieldData} isEdit = {this.state.editFlag} editData = {this.editData} handele={this.handele} fieldData = {this.isEmptyObj(this.state.nowEidtData) ? null : this.state.nowEidtData } ></WrapperConfigInfo>
                                        </Col>
                                        <Col span = {16}>
                                            <ShowFields h = {this._h} i = {this._i} quitEdit = {this.state.quitEdit} value = {this.state.fieldData ? this.state.fieldData :[]} editData = {this.editData} deleteFieldData = {this.deleteFieldData}></ShowFields>
                                        </Col>
                                    </Row>
                                </div>
                                
                            </div>
                            
                            <div className = 'editApiTable card'>
                                <div className = 'card_head'>
                                    <div className = 'card_head_wrapper'>
                                        <div className = 'card_head_title'>节点接口参数配置</div>
                                    </div>
                                </div>
                                <div className = 'card_body'>
                                    <AddNewAttr handleNewData = {this.handleNewDataApi} handleDelData = {this.handleDelDataApi}></AddNewAttr>
                                    <ApiTable  value = {this.state.apiData} handleApiData = {this.handleApiData} onChange = {this.handleDataApi} delApi = {this.state.delApi} newApi = {this.state.newApi}></ApiTable>
                                    {/*<ApiTable value = {this.state.apiData}></ApiTable>*/}
                                </div>
                                
                            </div>
                            <div className = 'submitDiv' onClick = {() => this.handleSaveClose()}>
                                提交
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const ConfigModal = Form.create()(ConfigModalForm)
export default ConfigModal