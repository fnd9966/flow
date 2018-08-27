import React from 'react'
import HotTable from 'react-handsontable'
import domtoimage from 'dom-to-image'
// import FileSaver from 'file-saver'
import './css/Table_fnd1.less'

class TableTest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  key = -1;
  data = {}
  tableData = [];
  btn = {
        c: [
            {name: '左上', key: 'a'},
            {name: '右上', key: 'b'},
            {name: '右下', key: 'c'},
            {name: '左下', key: 'd'}
        ],
        t: [
            {name: '居左', key: 'da'},
            {name: '居右', key: 'bc'},
        ],
        b: [
            {name: '居左', key: 'da'},
            {name: '居右', key: 'bc'},
        ],
        l: [
            {name: '居上', key: 'ab'},
            {name: '居下', key: 'cd'},
        ],
        r: [
            {name: '居上', key: 'ab'},
            {name: '居下', key: 'cd'},
        ]
    }
  settings = {
        mergeCells:true,
        autoWrapRow:false,
        manualRowResize:false,
        manualColumnResize:false,
        afterSetCellMeta:function(row,col,key,val) {
          console.log('cell meta changed',row,col,key,val);
        },
        contextMenu: {
            items: {
                'mergeCells':{ name: '合并单元格' , },
                'row_above': { name: '上方添加一行', },
                'row_below': { name: '下方添加一行', },
                'col_left': { name: '左侧添加一列', },
                'col_right': { name: '右侧添加一列', },
                'remove_row': { name: '移除此行', },
                'remove_col': { name: '移除此列', },
                'copy': { name: '复制', },
                'cut': { name: '剪切', },

                'make_read_only': { name: '禁止编辑选中项', },
                'alignment': {

                    
                 },
                'undo': { name: '还原上次操作', },
                'redo': { name: '重复上次动作', },
                'css_style':{ name:'设置该行为表头',
                  callback: function(e) {
                     let coords = this.getSelectedRange();
                    // console.log(document.getElementsByClassName('htCore')[0]);
                     for(let row = coords.from.row;row<=coords.to.row;row++) {
                      for(let col = coords.from.col;col<=coords.to.col;col++) {
                       
                        document.getElementsByClassName('htCore')[0].lastChild.childNodes[row].childNodes[col].className +=' biaotou';
                     
                        this.setCellMeta(row,col,'className','biaotou');
                      }
                      // let row = document.getElementsByClassName('htCore')[0].lastChild.childNodes[row], len = row.childNodes.length;
                      // for( let n = 0; n < len; ++n ) {
                      //   row.childNodes[n].className +=' biaotou';
                      //   this.setCellMeta(row,n,'className','biaotou');
                      // }
                        
                     }
                  }
                }
            }
        },   
      }
  componentDidMount=() => {
     // new Table()
  }

     /**
     * 数字
     */
    toNum = v => {
        v = v.toString().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (v == '') v = 0;
        return v
    } 
    /**
     * stop
     */
    stop = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (e.cancelBubble) {
            e.cancelBubble = true;
        }
    }
    close = (e,key) => {
        this.stop(e);
        
        let  hot_table = this.refs.hottable;
        let rowL = document.getElementsByClassName('htCore')[0].lastChild.childNodes.length;
        let colL = document.getElementsByClassName('htCore')[0].lastChild.childNodes[0].childNodes.length;
        let tArray = new Array();
        for(let i = 0;i<rowL;i++) {
          tArray[i] = new Array();
          for(let j = 0;j<colL;j++) {
            let d = document.getElementsByClassName('htCore')[0].lastChild.childNodes[i].childNodes[j];
            tArray[i][j]={text:d.innerHTML,style_table:d.style.display, class_table:d.className,rowspan:d.getAttribute('rowspan'),colspan:d.getAttribute('colspan')}
          }
        }
        //表格转成图片对象
        let tableToImg = domtoimage.toBlob(document.getElementsByClassName('htCore')[0]);
        
        this.data.table = tArray;
        this.data.tableObj =  tableToImg;
        this.data.x = this.toNum(this.data.x);
        this.data.y = this.toNum(this.data.y);
        this.data.width = this.toNum(this.data.width);
        this.data.height = this.toNum(this.data.height);

        let data = !!key ? this.data : false;
        !!this.props.close && this.props.close(data);
    }
  //对齐方向
  changeBasePoint = key => {
        this.data.basePoint = key;
        //this.setState();
    }
    //x,y
    handleAttr = (newValue,key) => {
        this.data[key] = newValue;
        this.setState();
    }
    //表格宽高变化
    handleTableChange = (newValue,key) => {
      this.data[key] = newValue;
      if(key == 'width') {
        document.getElementsByClassName('htCore')[0].style.width=newValue+'px';
        // document.getElementsByClassName('wtHider')[0].style.width =newValue+'px';
        // console.log(document.getElementsByClassName('wtHider')[0]);
      } 
      if(key == 'height') document.getElementsByClassName('htCore')[0].style.height=newValue+'px';
      this.setState();
    }

//新建
  handleNewTable = () => {
   this.tableData=[[' ',' ',' ',' ',' '],[' ',' ',' ',' ',' '],[' ',' ',' ',' ',' '],[' ',' ',' ',' ',' ']];
   this.setState();
  }
  /* 定时器*/
  timer = null;
  render () {
    const {modalVisible,fieldValue} = this.state;
    let {data, ind} = this.props;
    
    if(ind != this.key) {
      //如果inx不等于-1,说明有传值进来,需要对值进行处理
      this.key = ind;
      this.data = Object.assign({},data,{});
      let _d = this.data;
      if(!!_d) {
          
          if(_d.width || _d.height) {
            setTimeout(() => {
              document.getElementsByClassName('htCore')[0].style.width=_d.width+'px';
              document.getElementsByClassName('htCore')[0].style.height=_d.height+'px';
            })
          }

        //----------
           let get_table = _d.table;
          // console.log(_d);
      
          let get_data = new Array();
          for(let m = 0;m<get_table.length;m++) {
            get_data[m] = new Array();
            for(let n = 0;n<get_table[m].length;n++ ) {
              // console.log(get_table[m][n]);
              get_data[m][n]=get_table[m][n].text;
              (function(m,n) {
                  setTimeout(() => {
                  document.getElementsByClassName('htCore')[0].firstChild.childNodes[n].style.width = `${100/get_table[m].length}%`
                },0);
                })(m,n);
              

              
              if(get_table[m][n].class_table) {

                (function(m,n) {
                  setTimeout(() => {
                    // console.log(this);
                    document.getElementsByClassName('htCore')[0].lastChild.childNodes[m].childNodes[n].className+=' ' + get_table[m][n].class_table},0)
                    // hot.hotInstance.setCellMeta(m,n,'className',get_table[m][n].style);

                })(m,n)

                clearInterval(this.timer);
                this.timer = setInterval(() => {
                  if (!this.refs) return;
                 let hot = this.refs.hottable;
                 if(!!hot) {
                   clearInterval(this.timer);
                   this.timer = null;
                   (function(m,n) {
                   setTimeout(() => {
                    hot.hotInstance.setCellMeta(m,n,'className',get_table[m][n].class_table);
                   },0)
                  })(m,n);
                 }
                },100);
                
                
              }
              if(get_table[m][n].style_table) {
                (function(m,n) {
                  setTimeout(() => {
                    document.getElementsByClassName('htCore')[0].lastChild.childNodes[m].childNodes[n].setAttribute('style',`display:${get_table[m][n].style_table}`);
                  })
                })(m,n)
              }
              
              if(get_table[m][n].colspan||get_table[m][n].rowspan) {
                (function(m,n) {
                  setTimeout(() => {

                    document.getElementsByClassName('htCore')[0].lastChild.childNodes[m].childNodes[n].setAttribute('colspan',get_table[m][n].colspan);
                    document.getElementsByClassName('htCore')[0].lastChild.childNodes[m].childNodes[n].setAttribute('rowspan',get_table[m][n].rowspan);

                  },0)
                })(m,n)
               
              }

              
              
            }
          }
          console.log(get_data);
        //----------
        this.tableData = get_data;
        // console.log(this);
      }

    }
    //{ target: 'c', type: 'compass', basePoint: 'b', x: 40, y: 40, img: ''}
    return (
      <div className = 'popupBox tableAttr' ref = 'attrTableEdit'>
          <div className='tableTitle'>
            表格
            <span onClick={(e) => this.close(e)}>×</span>
          </div>
          
            <div  className='popupLeft'>
              <HotTable root='hot' ref='hottable' data={this.tableData} settings={this.settings}></HotTable>
            </div>
            <div className = 'popupRight'>
                <div className = 'inputLine'>
                    <span>类型：</span>
                    <input value = '表格' disabled = "disabled"/>
                </div>
                <div className = 'inputLine'>
                    <span>宽度：</span>
                    <input ref='width' valueLink={{value:this.data.width,requestChange:v => this.handleTableChange(v,'width')}} type="text"/>
                </div>
                <div className = 'inputLine'>
                    <span>高度：</span>
                    <input ref='height' valueLink={{value:this.data.height,requestChange:v => this.handleTableChange(v,'height')}} type="text"/>
                </div>
                <div className = 'inputLine'>
                    <span>x：</span>
                    <input placeholder = '水平方向偏移距离' valueLink={{value : this.data.x,requestChange: v => this.handleAttr(v,'x')}} />
                </div>
                <div className = 'inputLine'>
                    <span>y：</span>
                    <input placeholder = '垂直方向偏移距离' valueLink={{value : this.data.y,requestChange: v => this.handleAttr(v,'y')}} />
                </div>
                <div className = 'inputLine'>
                    <span>对齐方向：</span>
                    {
                        this.btn[this.data.target].map(v => <btn onClick = {e => this.changeBasePoint(v.key)} className = {this.data.basePoint == v.key ? 'active' : ''}>{v.name}</btn>)
                    }
                </div>
                <div style = {{height: 20}}></div>
                <div className = 'inputLine'>
                    <div className = 'saveBtn' onClick = {e => this.close(e,true)}>保 存</div>
                    <div className = 'saveBtn' onClick = {e => this.handleNewTable()}>新 建</div>
                    
                </div>
            </div>
      </div>
    )
  }
}

export default TableTest
