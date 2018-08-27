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

class TestTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value || [],
      loading: false,
      dataSelect: ['get','put','post'],
      columns:this.columns
    };
  }
  columns = [{
      title: 'url',
      dataIndex: 'url',
      key: 'url',
      // width: '19%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'url', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入key值..."
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
      // width: '12%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <AutoComplete
              value = { text }
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
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      // width: '16%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'action', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入action..."
            />

          );
        }
        return text;
      },
      align: 'center'
    }, {
      title: 'params',
      dataIndex: 'params',
      key: 'params',
      // width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'params', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入xx:xxx..."
            />
          );
        }
        return text;
      },
      align: 'center'
    }, {
      title: '操作',
      key: 'action',
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
      align: 'center',
      width:150
    }]
  f = true
  basicColumn = ['key', 'url', 'type', 'action', 'params', 'editable', 'isNew']
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
              this.basicColumn.push(key);
            }
          }
        }
        // console.log(another);
        another.map(item => {
          this.renderNewObj(item)
        });
        this.setState({
          columns:this.state.columns
        })
      }
      this.setState()
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
        // console.log(nextProps.value);
        for (let i = 0, vLen = nextProps.value.length; i < vLen; i++) {
          for (let key in nextProps.value[i]) {
            nextProps.value[i][key] = this.typeToString(nextProps.value[i][key])
          }
        }
        this.setState({
          data:nextProps.value
        });
        this.f = false
      }
    }
    if('delApi' in nextProps) {
      if(nextProps.delApi) {
        let data = this.state.columns.filter((item) => {

          return item.title == nextProps.delApi
        });
        // console.log(data);
        let newColumns = this.removeArr(this.state.columns,data[0]);
        // console.log(newColumns);
        this.setState({
          columns:newColumns
        })
      }
        
    }
      if ('newApi' in nextProps) {
            if(nextProps.newApi) {
              let newObj = {
                title: nextProps.newApi,
                dataIndex: nextProps.newApi,
                key: nextProps.newApi,
                // width: '19%',
                render: (text, record) => {
                  if (record.editable) {
                    return (
                      <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, nextProps.newApi, record.key)}
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
              // console.log(nextProps.newApi)
              // nextProps.newApi.map(item => {
              //   this.renderNewObj(item)
              // })
              this.setState({
                columns:this.state.columns
              });
            }
      }
  }

  renderNewObj = (newApi) => {
    let newObj = {
                title: newApi,
                dataIndex: newApi,
                key: newApi,
                // width: '19%',
                render: (text, record) => {
                  if (record.editable) {
                    return (
                      <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, newApi, record.key)}
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
    const newData = (this.state.data ? this.state.data : []).map(item => ({ ...item
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
    const newData = (this.state.data ? this.state.data : []).filter(item => item.key !== key);
    this.setState({
      data: newData
    });
  }
  newMember = () => {
    const newData = (this.state.data ? this.state.data : []).map(item => ({ ...item
    }));
    newData.push({
      key: new Date().getTime(),
      url: '',
      type: '',
      action: '',
      params:'',
      editable: true,
      isNew: true,
    });
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
    const newData = (this.state.data ? this.state.data : []).map(item => ({ ...item }));
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
      if (!target.url || !target.type || !target.action) {
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
      // this.props.handleData(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
    this.props.handleApiData(this.state.data);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = (this.state.data ? this.state.data : []).map(item => ({ ...item
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
    // console.log(this.props.value)
    return (
      <div>
      <Table
          bordered = {true}
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
const ApiTable = Form.create()(TestTable);
export default ApiTable