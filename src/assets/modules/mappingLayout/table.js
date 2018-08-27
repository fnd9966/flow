
import React from 'react'
import domtoimage from 'dom-to-image'

class Table extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            i: -1,
            j: -1,
            select: false,
            isSelect: false,
            x0: -1,
            y0: -1,
            x1: 0,
            y1: 0,
            menu: false,
            mL: 0,
            mT: 0
        }
    }
    key = -1;
    data = {
        
    }
    menu = [
        {text: '合并', key: 'merge', view: true},
        {text: '拆分', key: 'breakUp', view: true},
        {text: '新增行', key: 'addRow', view: true},
        {text: '新增列', key: 'addCol', view: true},
        {text: '删除行', key: 'deleteRow', view: true},
        {text: '删除列', key: 'deleteCol', view: true},
        {text: '设为表头', key: 'toTh', view: true},
        {text: '左对齐', key: 'algin_left', view: true},
        {text: '居中', key: 'algin_center', view: true},
        {text: '右对齐', key: 'algin_right', view: true}
    ]

    img = [];
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
    componentWillMount () {

    }
    componentDidMount () {
        this.refs.tableAttr.oncontextmenu = function (e) { return false;}   
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
    /**
     * 数字
     */
    toNum = v => {
        v = v.toString().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (v == '') v = 0;
        return v
    }
    /**
     * 关闭
     */
    close = (e,key) => {
        this.stop(e);
        this.data.x = this.toNum(this.data.x);
        this.data.y = this.toNum(this.data.y);
        let data = false;
        if (!!key) {
            let table = this.refs.table;
            if (this.data.table.length > 0 && this.data.table[0].length > 0 && !!table) this.data.img = domtoimage.toBlob(table); 
            console.log(this.data);
            data = this.data;
        }
        !!this.props.close && this.props.close(data);
    }
    /**
     * 对其方式
     */
    changeBasePoint = key => {
        this.data.basePoint = key;
        this.setState();
    }
    /**
     * 输入框更改属性
     */
    handleAttr = (newValue,key) => {
        this.data[key] = newValue;
        if (key == 'lineHeight') { this.data['height'] = this.data.table.length * this.toNum(newValue); }
        this.setState();
    }
    /**
     * 新建表格
     */
    newTable = e => {
        this.stop(e);
        let _table = [
            [
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1}
            ],
            [
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1}
            ],
            [
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1}
            ],
            [
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1},
                {text: '', row: 1, col: 1}
            ]
        ]
        this.data.table = _table;
        this.data.width = 400;
        this.data.height = _table.length * this.data.lineHeight;
        
        this.setState();
    }
    /**
     * 更改表格的值
     */
    handleTable = (v,i,j) => {
        this.data.table[i][j].text = v;
        this.setState();
    }
    /**
     * 聚焦
     */
    focus = (e,i,j) => {
        this.stop(e);
        let tr = this.refs.table.getElementsByTagName('tr'),trL = tr.length;
        for ( let n = 0; n < trL; ++n ) {
            let td = tr[n].getElementsByTagName('td'),tdL = td.length;
            for ( let m = 0; m < tdL; ++m ) {
                let inp = td[m].getElementsByTagName('input')[0],
                    spn = td[m].getElementsByTagName('span')[0];
                if (n == i && m == j) {
                    inp.style.display = 'inline-block';
                    spn.style.display = 'none';
                    inp.focus();
                } else {
                    inp.style.display = 'none';
                    spn.style.display = 'inline-block';
                }
            }
        }
    }
    /**
     * i j 记录
     */
    mouseIJ = [-1,-1];
    /**
     * 开始选择
     */
    startSelect = (e,i,j) => {
        this.stop(e);
        if (e.button != 0) {
            this.setState({
                menu: false
            })
            return
        }
        this.mouseIJ = [i,j];
        let td = this.data.table[i][j];
        this.setState({
            menu: false,
            select: true,
            isSelect: true,
            i: i,
            j: j,
            x0: i,
            y0: j,
            x1: i + td.row - 1,
            y1: j + td.col - 1
        })
    }
    /**
     * 鼠标移动选择
     */
    selection = (e,i,j) => {
        this.stop(e);
        if (!this.state.select) return;
        if (i == this.mouseIJ[0] && j == this.mouseIJ[1]) return;
        this.mouseIJ = [i,j]; 
        let p = this.calArea(Math.min(this.state.i,i), Math.min(this.state.j,j), Math.max(this.state.i,i), Math.max(this.state.j,j));
        this.setState(p)
    }
    /**
     * 结束选择
     */
    endSelect = e => {
        this.stop(e);
        this.setState({
            select: false
        })
    }
    /**
     * 区域计算
     */
    calArea = (x0,y0,x1,y1) => {
        for (let i = x0; i <= x1; ++i ) {
            for (let j = y0; j <= y1; ++j ) {
                let td = this.data.table[i][j];
                if (td.row + i - 1 > x1) {
                    x1 = td.row + i - 1;
                    this.calArea(x0,y0,x1,y1);
                } else if (td.col + j - 1 > y1) {
                    y1 = td.col + j - 1;
                    this.calArea(x0,y0,x1,y1);
                } else if (!!td.p && (td.p.i < x0 || td.p.j < y0)) {
                    x0 = Math.min(td.p.i,x0);
                    y0 = Math.min(td.p.j,y0);
                    this.calArea(x0,y0,x1,y1);
                } 
            }
        }
        return {
            x0,
            y0,
            x1,
            y1
        }
    }
    /**
     * 选中区域内
     */
    inner = (i,j) => {
        let di = this.state.x1 - this.state.x0,
            dj = this.state.y1 - this.state.y0,
            pi = i - this.state.x0,
            pj = j - this.state.y0;

        return di * pi >= 0 && Math.abs(di) >= Math.abs(pi) && dj * pj >= 0 && Math.abs(dj) >= Math.abs(pj)
    }
    /**
     * 打开右击菜单
     */
    openMenu = (e,i,j) => {
        this.stop(e);
        if (!!this.state.isSelect && this.inner(i,j)) {

            this.menu.map((item,i) => {
                let sta = true;
                switch (item.key) 
                {
                    case 'deleteRow': sta = (this.state.y1 - this.state.y0 + 1 == this.data.table[0].length) ? true : false; break;
                    case 'deleteCol': sta = (this.state.x1 - this.state.x0 + 1 == this.data.table.length) ? true : false; break;
                    default: break;
                }
                this.menu[i].view = sta;
            })
        } else {
            this.menu.map((item,i) => {
                this.menu[i].view = (item.key == 'addRow' || item.key == 'addCol') ? true : false;
            })
        }
        this.setState({
            menu: true,
            mL: e.pageX + 5,
            mT: e.pageY
        })
    }
    /**
     * 清除
     */
    clear = e => {
        this.stop(e);
        this.focus(e,-1,-1);
        this.setState({
            menu: false,
            i: -1,
            isSelect: false
        })
    }
    /**
     * 右击菜单
     */
    operation = (e,key) => {
        this.stop(e);
        let t = this.data.table,
            s = this.state;
        switch (key) 
        {
            case 'merge': 
                for (let m_i = s.x0; m_i <= s.x1; m_i++) {
                    for (let m_j = s.y0; m_j <= s.y1; m_j++) {
                        if (m_i == s.x0 && m_j == s.y0) {
                            t[m_i][m_j].p = false;
                            t[m_i][m_j].row = s.x1 - s.x0 + 1;
                            t[m_i][m_j].col = s.y1 - s.y0 + 1;
                        } else {
                            t[m_i][m_j].p = {i: s.x0, j: s.y0};
                            t[m_i][m_j].text = '';
                            t[m_i][m_j].row = 1;
                            t[m_i][m_j].col = 1;
                        }
                    }
                }
            break;
            case 'breakUp': 
                for (let b_i = s.x0; b_i <= s.x1; b_i++) {
                    for (let b_j = s.y0; b_j <= s.y1; b_j++) {
                        if (t[b_i][b_j].col > 1 || t[b_i][b_j].row > 1) {
                            for (let _r = 0; _r < t[b_i][b_j].row; _r++) {
                                for (let _c = 0; _c < t[b_i][b_j].col; _c++) {
                                    if (_r != 0 || _c != 0) {
                                        t[b_i + _r][b_j + _c].p = false;
                                        t[b_i + _r][b_j + _c].row = 1;
                                        t[b_i + _r][b_j + _c].col = 1;
                                    }
                                }
                            }
                        }
                        t[b_i][b_j].p = false;
                        t[b_i][b_j].row = 1;
                        t[b_i][b_j].col = 1;
                    }
                }
            break;
            case 'addRow': 
                let colLen = t[0].length,newRow = [];
                for (let rInd = 0; rInd < colLen; rInd++) {
                    newRow.push({text: '', row: 1, col: 1});
                }
                t.push(newRow);
                
            break;
            case 'addCol': 
                t.map((item,i) => {
                    t[i].push({text: '', row: 1, col: 1});
                })
            break;
            case 'deleteRow': 
                t.splice(s.x0,s.x1 - s.x0 + 1);
            break;
            case 'deleteCol': 
                t.map((item,i) => {
                    t[i].splice(s.y0, s.y1 - s.y0 + 1);
                })
            break;
            case 'toTh': 
                for (let n = s.x0; n <= s.x1; n++) {
                    for (let m = s.y0; m <= s.y1; m++) {
                        t[n][m].th = true;
                    }
                }
            break;
            case 'algin_left': 
            case 'algin_center': 
            case 'algin_right': 
                for (let i = 0, iL = t.length; i < iL; ++i) {
                    for (let j = 0, jL = t[i].length; j < jL; ++j) {
                        if (this.inner(i,j)) {
                            t[i][j].textAlign = key.split('_')[1];
                        }
                    }
                }
            break;
        }
        this.setState({
            menu: false
        });
    }
    render () {
        let {data, ind} = this.props;
        if (ind != this.key) {
            this.key = ind;
            this.data = Object.assign({},data,{});
        }
        let table = <table className = 'editTable' style = {{height: this.data.height,width: this.data.width}} ref = 'table'>
            {
                this.data.table.map((tr,i) => {
                    return <tr style = {{height: this.data.lineHeight}}>
                        {
                            tr.map((td,j) => {

                                if (!!td.p) return '';

                                let tdH = ((this.state.select || this.state.isSelect) && this.inner(i,j)) ? 'highLight' : '',
                                    tdC = (i == this.state.i && j == this.state.j) ? 'select' : '',
                                    tdT = !!td.th ? 'isTh' : '';

                                return <td style = {{textAlign: !td.textAlign ? 'left' : td.textAlign}} className = {tdC + ' ' + tdT + ' ' + tdH } rowSpan = {td.row} colSpan = {td.col} onClick = {e => this.focus(e,i,j)} onMouseDown = {e => this.startSelect(e,i,j)} onContextMenu = {e => this.openMenu(e,i,j)} onMouseMove = {e => this.selection(e,i,j)}>
                                    <span style = {{display: 'inline-block'}}>{ td.text }</span>
                                    <input style = {{display: 'none'}} valueLink={{value: td.text,requestChange: v => this.handleTable(v,i,j)}} />
                                </td>
                            })
                        }
                    </tr>
                })
            }   
        </table>
        let cMenu = this.state.menu ? <div className = 'tableMenu' style = {{left: this.state.mL, top: this.state.mT}}>
            {
                this.menu.map(item => {
                    if (!item.view) return;
                    return <div onMouseDown = {e => this.operation(e,item.key) } className = 'tableMenuItem'>{ item.text }</div>
                })
            }
        </div> : '';
        return <div className = 'popupBox tableAttr' ref = 'tableAttr' onMouseDown = {e => this.clear(e)}>
            <div className = 'titleLine' >
                表格属性面板 <span onClick = {e => this.close(e)}>×</span>
            </div>
            <div className = 'popupL' onMouseUp = {e => this.endSelect(e)}>
                { table }
                
            </div>
            <div className = 'popupR'>
                <div className = 'inputLine'>
                    <span>类型：</span>
                    <input value = '表格' disabled = "disabled"/>
                </div>
                <div className = 'inputLine'>
                    <span>行高：</span>
                    <input placeholder = '表格行高' valueLink={{value: this.data.lineHeight,requestChange: v => this.handleAttr(v,'lineHeight')}} />
                </div>
                <div className = 'inputLine'>
                    <span>宽度：</span>
                    <input placeholder = '表格宽度' valueLink={{value: this.data.width,requestChange: v => this.handleAttr(v,'width')}} />
                </div>
                <div className = 'inputLine'>
                    <span>高度：</span>
                    <input placeholder = '表格高度' disabled = 'disabled' valueLink={{value: this.data.height,requestChange: v => this.handleAttr(v,'height')}} />
                </div>
                <div className = 'inputLine'>
                    <span>x：</span>
                    <input placeholder = '水平方向偏移距离' valueLink={{value: this.data.x,requestChange: v => this.handleAttr(v,'x')}} />
                </div>
                <div className = 'inputLine'>
                    <span>y：</span>
                    <input placeholder = '垂直方向偏移距离' valueLink={{value: this.data.y,requestChange: v => this.handleAttr(v,'y')}} />
                </div>
                <div className = 'inputLine'>
                    <span>对齐方向：</span>
                    {
                        this.btn[this.data.target].map(v => <btn onClick = {e => this.changeBasePoint(v.key)} className = {this.data.basePoint == v.key ? 'active' : ''}>{v.name}</btn>)
                    }
                </div>
                <div style = {{height: 10}}></div>
                <div className = 'inputLine'>
                    <span></span>
                    <div className = 'saveBtn' onClick = {e => this.close(e,true)}>保 存</div>
                    <div className = 'saveBtn' onClick = {e => this.newTable(e)}>新 建</div>
                </div>
            </div>
            { cMenu }
        </div>
    }
}

export default Table