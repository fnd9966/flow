
import React from 'react'
import './css/mappingLayout.less'
import { toolData, layout, _anchor } from './d'
import Tool from './tool'
import Layout from './layout'
import Title from './title'
import Scale from './scale'
import Legend from './legend'
import Img from './img'
import Table from './table'

// import Ta from './Table_fnd1'

// let TableTest

class MappingLayout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            detail: false
        }
    }
    detailData = false; // 属性内容
    toolIndex = 1;  // 数字更改 刷新工具条
    layoutIndex = 1; // 数字更改 刷新视图
    detailIndex = 1; // 数字更改 刷新属性
    tool = []; // 工具
    lay = {}; // 视图数据
    config = {
        height: document.documentElement.clientHeight || document.body.clientHeight,
        width: document.documentElement.clientWidth || document.body.clientWidth
    }
    componentWillMount () {
        this.initLayout(this.newSpace(layout),this.newSpace(toolData));
    }
    componentDidMount () {

        // 添加表格模块
        // require.ensure([], ()=>{ 
        //     TableTest = require('./Table_fnd1').default; 
        // },'Table_fnd1') 

        this.getData();
    }
    /**
     * 获取数据
     */
    getData = () => {
     
    }
    /**
     * 数组、对象
     */
    isArray = obj => Object.prototype.toString.call(obj) === '[object Array]';
    isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';
    /**
     * 新对象
     */
    newSpace = (d) => {
        if (this.isArray(d)) {
            if (d.length == 0 || d.length > 0 && !this.isArray(d[0]) && !this.isObject(d[0])) {
                return Object.assign([],d,[])
            } else {
                return d.map(item => this.newSpace(item));
            }
        } else if (this.isObject(d)) {
            let nd = new Object();
            for (let p in d) {
                nd[p] = this.newSpace(d[p]);
            }
            return nd
        } else {
            let a = d;
            return a
        }
    }
    /**
     * 更新工具、视图
     */
    _setState (d) {
        ++this.toolIndex;
        ++this.layoutIndex;
        if (!!d) { this.setState(d)}
        else { this.setState()}
    }
    /**
     * 关闭编辑面板
     */
    closeEdit = () => {
        console.log('关闭')
    }
    /**
     * 工具点击
     */
    toolClick = (d) => {
        switch (d.p) 
        {
            case 'tp': 
            case 'bg': 
                let imgAnchor = this.newSpace(_anchor[['img','table'][['tp','bg'].indexOf(d.p)]]);
                this.detailData = {
                    data: imgAnchor,
                    i: this.lay.anchor.length
                }
                this.lay.anchor.push(imgAnchor);
                this._setState({detail: true});
            break;
            // case 'bg': 
            //     // if (!TableTest) return;
            //     let bgAnchor = this.newSpace(_anchor['']);
            //     this.detailData = {
            //         data: bgAnchor,
            //         i: this.lay.anchor.length
            //     }
            //     this.lay.anchor.push(bgAnchor);
            //     this._setState({detail: true});
            // break;
            case 'bc': 
                
            break;
            case 'bcdmb': break;
            case 'layout': 
                this.initLayout(this.newSpace(d.data), this.newSpace(this.tool));
                this._setState();
            break;
            case 'st_t':
            case 'st_r':
            case 'st_b':
            case 'st_l': 
                let _st_i = 'trbl'.indexOf(d.p.split('_')[1]);
                this.lay.view[_st_i] = !this.lay.view[_st_i];
                this.tool = this.buildTool(this.tool, this.lay);
                this._setState();
            break;
            case 'cr_title':
            case 'cr_compass':
            case 'cr_scale': 
            case 'cr_legend':
                let _anchorType = d.p.split('_')[1];
                if (d.state) {
                    let anchorI = -1;
                    this.lay.anchor.map((item,i) => {
                        if (item.type == _anchorType) anchorI = i;
                    })
                    if (anchorI > -1) this.lay.anchor.splice(anchorI,1);
                    this.tool = this.buildTool(this.tool, this.lay)
                    this._setState();
                } else {
                    let newAnchor = this.newSpace(_anchor[_anchorType]),
                        _layI = 'trbl'.indexOf(newAnchor.target);
                    if (_layI > -1) this.lay.view[_layI] = true;
                    this.detailData = {
                        data: newAnchor,
                        i: this.lay.anchor.length
                    }
                    this.lay.anchor.push(newAnchor);
                    this.tool = this.buildTool(this.tool, this.lay)
                    this._setState({detail: true});
                }
            break;
            default: break;
        }
    }
    /**
     * 初始化模板
     */
    initLayout = (d,t) => {
        this.lay = Object.assign({},d,{height: this.config.height - 80, width: this.config.width});
        this.tool = this.buildTool(t, this.lay)
    }
    /**
     * 构建tool属性
     */
    buildTool = (t,v) => {
        t[1].children
        v.view.map((item,i) => {
            t[1].children[i].state = item ? true : false;
        })
        t[2].children.map((item,i) => t[2].children[i].state = false)   
        v.anchor.map(item => {
            let i = ['title','compass','scale','legend'].indexOf(item.type);
            if (i > -1) t[2].children[i].state = true;
        })
        return t
    }
    /**
     * 打开属性面板
     */
    openDetail = (data,i) => {
        this.detailData = {
            i: i,
            data: Object.assign({},data,{})
        }
        ++this.detailIndex;
        this.setState({
            detail: true
        })
    }
    /**
     * 关闭属性面板
     */
    resetAnchor = data => {
        if (!!data) {
            this.lay.anchor[this.detailData.i] = this.newSpace(data);
            ++this.layoutIndex;
        } 
        this.detailData = false;
        this.setState({detail: false})
    }
    /**
     * 更改锚点
     */
    changeAnchor = (data) => {
        this.lay.anchor = data;
        this.tool = this.buildTool(this.tool, this.lay);
        this.setState();
    }
    render () {
        const c = this.config;
        let overBox = '',_detail = '';
        if (this.state.detail && !!this.detailData && !!this.detailData.data) {
            switch (this.detailData.data.type) 
            {
                case 'title': 
                    _detail = <Title close = {data => this.resetAnchor(data)} ind = {this.detailIndex} data = {this.detailData.data} />; 
                break;
                case 'scale': 
                    _detail = <Scale title = '比例尺' close = {data => this.resetAnchor(data)} ind = {this.detailIndex} data = {this.detailData.data} />; 
                break;
                case 'compass': 
                    _detail = <Scale title = '指北针' close = {data => this.resetAnchor(data)} ind = {this.detailIndex} data = {this.detailData.data} />; 
                break;
                case 'legend': 
                    _detail = <Legend close = {data => this.resetAnchor(data)} ind = {this.detailIndex} data = {this.detailData.data} />; 
                break;
                case 'img': 
                    _detail = <Img close = {data => this.resetAnchor(data)} ind = {this.detailIndex} data = {this.detailData.data} />; 
                break;
                case 'table':
                    _detail = <Table close = {data => this.resetAnchor(data)} data = {this.detailData.data} ind = {this.detailIndex} />
                    // _detail = <Tt data = {this.detailData.data} ind = {this.detailIndex} />
                    // if (!!TableTest) { _detail = <TableTest data = {this.detailData.data} close = {data => this.resetAnchor(data)} ind = {this.detailIndex} /> }
                break;

                default: break;
            }
            overBox = <div className = 'overBox'>
                { _detail }
            </div>
        }

        return <div className = 'mappingLayout' style = {{height: c.height, width: c.width}}>
            <div className = 'titleLine' >
                编辑 <span onClick = {() => this.closeEdit()}>×</span>
            </div>
            <Tool config = { this.tool } ind = {this.toolIndex} click = {t => this.toolClick(t)}/>
            <Layout config = { this.lay } ind = {this.layoutIndex} changeAnchor = {data => this.changeAnchor(data)} dbClick = {(data,i) => this.openDetail(data,i)} />
            { overBox }
            {/* <Ta ind = '1' data = {{ target: 'c', type: 'table', basePoint: 'c', x: 40, y: 40,width:500,height:0, lineHeight: 40, table:[[]]}} /> */}
        </div>
    }
}   

export default MappingLayout