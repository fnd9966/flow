import React from 'react';
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Divider,
  Form,
  Card,
  AutoComplete,
  Select
} from 'antd';
// import styles from './style.less';

class ZzfTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value || [],
      loading: false,
      selectedRowKeys: [],
      dataSelect : ['text','time','date','checkbox'],
      columns:this.columns
    };
  }
   columns = [{
        title: 'column_key',
        dataIndex: 'column_key',
        key: 'column_key',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'column_key', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入key值..."
              />
            );
          }
          return text;
        },
        align: 'center'
      }, {
        title: 'column_name',
        dataIndex: 'column_name',
        key: 'column_name',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'column_name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder = '请输入name值...'
              />
            );
          }
          return text;
        },
        align: 'center'
      }, {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <AutoComplete
                value = {text}
                // style={{ width: 200 }}
                dataSource={this.state.dataSelect}
                onChange={e => this.handleFieldChange(e, 'type', record.key)}
              />
            );
          }
          return text;
        },
        align: 'center'
      }, {
        title: 'isEdit',
        dataIndex: 'isEdit',
        key: 'isEdit',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style = {{width:'100%'}} onChange={e => this.handleFieldChange(e, 'isEdit', record.key)} value={text}>
                <Option value='true'>true</Option>
                <Option value="false">false</Option>
              </Select>
            );
          }
          return text;
        },
        align: 'center'
      }, {
        title: 'isReq',
        dataIndex: 'isReq',
        key: 'isReq',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style = {{width:'100%'}} onChange={e => this.handleFieldChange(e, 'isReq', record.key)} value={text}>
                <Option value='true'>true</Option>
                <Option value="false">false</Option>
              </Select>
            );
          }
          return text;
        },
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width:150,
        fixed: 'right',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  
                    <a onClick={()=>this.remove(record.key)}>取消</a>
                  
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
        align: 'center'
      }]
  f = true
  flag = false
  basicColumn = ['column_key', 'column_name', 'editable', 'isEdit', 'isReq', 'key', 'type', 'isNew'];
  cmp = (x,y) => {
        // If both x and y are null or undefined and exactly the same 
    if ( x === y ) { 
     return true; 
    } 
     
    // If they are not strictly equal, they both need to be Objects 
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) { 
     return false; 
    } 
     
    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor. 
    if ( x.constructor !== y.constructor ) { 
     return false; 
    } 
      
    for ( var p in x ) { 
     //Inherited properties were tested using x.constructor === y.constructor
     if ( x.hasOwnProperty( p ) ) { 
     // Allows comparing x[ p ] and y[ p ] when set to undefined 
     if ( ! y.hasOwnProperty( p ) ) { 
      return false; 
     } 
     
     // If they have the same strict value or identity then they are equal 
     if ( x[ p ] === y[ p ] ) { 
      continue; 
     } 
     
     // Numbers, Strings, Functions, Booleans must be strictly equal 
     if ( typeof( x[ p ] ) !== "object" ) { 
      return false; 
     } 
     
     // Objects and Arrays must be tested recursively 
     if ( ! Object.equals( x[ p ], y[ p ] ) ) { 
      return false; 
     } 
     } 
    } 
     
    for ( p in y ) { 
     // allows x[ p ] to be set to undefined 
     if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) { 
     return false; 
     } 
    } 
    return true; 
  }
  removeArr = (arr,obj) => {
    let length = arr.length;
    for(let i = 0; i < length; i++) {
      // console.log(arr[i]);
      // debugger
      // console.log(this.cmp(arr[i],obj));
      if(arr[i] == obj) {
        if(i == 0) {
          arr.shift();
          return arr;
        }else if(i == length - 1) {
          arr.pop();
          return arr;
        }else {
          arr.splice(i,1);
          // console.log(1);
          return arr;
        }
      }
    }
    // console.log('obj',obj);

  }
  // componentDidMount() {
  //   console.log(this.state.data);
  //   this.setState();
  // }

  //判断元素是否在数组中
  isInArray = (arr, value) => {
    let i = arr.length;
    while (i--) {
      if(arr[i] === value) {
        return true
      }
    }
    return false
  }
  componentDidMount() {
    let another = [];
    if(this.state.data) {
        for (let i = 0, dLen = this.state.data.length; i < dLen; i++) {
          for (let key in this.state.data[i]) {
            if(!this.isInArray(this.basicColumn, key)) {
              another.push(key);
              this.basicColumn.push(key)
            }
          }
        }
        another.map(item => {
          this.renderNewObj(item)
        });
        this.setState({
          columns:this.state.columns
        })
      }
      // console.log(111);
      // this.setState();
      // this.setState({
      //   data:this.props.value
      // });
      this.setState();
  }
  typeToString = (data) => {
    if(data) {
      let type = Object.prototype.toString.call(data);
      if(type == '[object Object]'){
        return JSON.stringify(data);
      }else {
        return data.toString()
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if('value' in nextProps) {
      if(this.f) {
        for (let i = 0, vLen = nextProps.value.length; i < vLen; i++) {
          for (let key in nextProps.value[i]) {
            nextProps.value[i][key] = this.typeToString(nextProps.value[i][key])
          }
        }
        this.setState({
          data: nextProps.value
        });
        this.f= false;
      }
    }
    if('delValue' in nextProps) {
      if(nextProps.delValue) {
        let data = this.state.columns.filter((item) => {

          return item.title == nextProps.delValue
        });
        // console.log(data);
        let newColumns = this.removeArr(this.state.columns,data[0]);
        // console.log(newColumns);
        this.setState({
          columns:newColumns
        })
      }
        
    }
      if ('newValue' in nextProps) {
            if(nextProps.newValue) {
            let newObj = {
              title: nextProps.newValue,
              dataIndex: nextProps.newValue,
              key: nextProps.newValue,
              // width: '19%',
              render: (text, record) => {
                if (record.editable) {
                  return (
                    <Input
                      value={text}
                      autoFocus
                      onChange={e => this.handleFieldChange(e, nextProps.newValue, record.key)}
                      onKeyPress={e => this.handleKeyPress(e, record.key)}
                      placeholder="请输入key值..."
                    />
                  );
                }
                return text;
              },
              align: 'center'
            };
            this.state.columns.splice(-1,0,newObj);
              this.setState({
                columns:this.state.columns
              });
            }
      }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(this.props.value);
  //   console.log(nextProps.value)
  //   return this.props.value !== nextProps.value;
  // }
  // componentWillUpdata(nextProps, nextState) {
  //   this.setState({
  //     data:nextProps.value
  //   })
  // }
  renderNewObj = (newValue) => {
    let newObj = {
              title: newValue,
              dataIndex: newValue,
              key: newValue,
              width: '15%',
              render: (text, record) => {
                if (record.editable) {
                  return (
                    <Input
                      value={text}
                      autoFocus
                      onChange={e => this.handleFieldChange(e, newValue, record.key)}
                      onKeyPress={e => this.handleKeyPress(e, record.key)}
                      placeholder="请输入key值..."
                    />
                  );
                }
                return text;
              },
              align: 'center'
            };
    this.state.columns.splice(-1,0,newObj);
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};


  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item
    }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target
        };
      }
      target.editable = !target.editable;
      this.setState({
        data: newData
      });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({
      data: newData
    });
    this.props.onChange(this.state.data);
  }
  newMember = () => {
    const newData = (this.state.data ? this.state.data : []).map(item => ({ ...item
    }));
    newData.push({
      key: new Date().getTime(),
      column_key: '',
      column_name: '',
      type: '',
      isEdit: '',
      isReq: '',
      editable: true,
      isNew: true,
    });
    // this.index += 1;
    this.setState({
      data: newData
    });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    // console.log(e);
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    // console.log(target);
    if (target) {
      // console.log(e.target);
      // target[fieldName] = e.target.value || e;
      if(e.target) {
        target[fieldName] = e.target.value
      }else {
        target[fieldName] = e
      }
      this.setState({
        data: newData
      });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      // console.log(target.IP);
      if (!target.column_key || !target.column_name || !target.type) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
    // console.log(this.state.data)
    this.props.handleAttrData(this.state.data);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item
    }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({
      data: newData
    });
    this.clickedCancel = false;
  }
  render() {
    const {
      selectedRowKeys
    } = this.state;
    const {
      form,
    } = this.props;
    const {
      getFieldDecorator,
      validateFieldsAndScroll,
      getFieldsError
    } = form;
    // console.log(this.state.data);
    return (
      <div>
      <Table
          bordered = {true}
          scroll={{ x: 1000 }}
          loading={this.state.loading}
          columns={this.state.columns}
          pagination = {false}
          dataSource={this.state.data}
          footer={()=>{return (
            <Button
              style={{ width: '100%' }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
              
            >
              新增
            </Button>
            )}}
        />
      </div>

    );
  }
}
const TableForm = Form.create()(ZzfTable);
export default TableForm