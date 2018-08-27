
import React from 'react'
import { ECHILD } from 'constants';

const _TH_ = 130
const _RW_ = 230
const dx   = 20
const dy   = 20
const _T_  = 'layoutTop'
const _B_  = 'layoutBottom'
const _R_  = 'layoutRight'
const _L_  = 'layoutLeft'
const _C_  = 'layoutCenter'
const _a_  = ['top', 'left']
const _b_  = ['top', 'right']
const _c_  = ['bottom', 'right']
const _d_  = ['bottom', 'left']


class Layout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cM: false,
            cM_x: 0,
            cM_y: 0,
            cD: false,
            cD_x: 0,
            cD_y: 0
        }
    }
    highLight = ['','','','','']; // |top|right|bottom|left|center    a|b|c|d|ab|bc|cd|da
    key = -1;
    config = {
        view: [true,true,true,true],
        anchor: [],
        height: 500,
        width: 800
    }
    target
    stop = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (e.cancelBubble) {
            e.cancelBubble = true;
        }
    }
    componentWillMount () {
        
    }
    componentDidMount () {
        this.refs.layoutBox.oncontextmenu = function (e) { return false;}   
    }
    /**
     * 双击更改
     */
    dbClick = (e,data,i) => {
        this.stop(e);
        !!this.props.dbClick && this.props.dbClick(data,i)
    }
    /**
     * 右击打开操作按钮
     */
    openMenu = (e,data,i) => {
        this.target = {
            data: data,
            i: i
        }
        this.stop(e);
        this.setState({
            cM: true,
            cM_x: e.pageX + 5,
            eM_y: e.pageY
        })
    }
    /**
     * 清除
     */
    clear = e => {
        this.stop(e);
        !!this.state.cM && this.setState({cM: false})
    }
    /**
     * 删除
     */
    deleteAnchor = e => {
        this.stop(e);
        if (!!this.target && this.target.data == this.config.anchor[this.target.i]) {
            this.config.anchor.splice(this.target.i,1);
            !!this.props.changeAnchor && this.props.changeAnchor(this.config.anchor);
            this.target = false;
        }
        this.setState({cM: false})
    }
    /**
     * 开启拖动
     */
    startDrag = (e,data,i) => {
        this.stop(e);
        if (data.type == 'title') return;
        this.target = {
            state: true,
            data: data,
            i: i,
            dx: e.target.offsetLeft + e.target.parentNode.offsetLeft - e.pageX,
            dy: e.target.offsetTop + e.target.parentNode.offsetTop - e.pageY
        }
        this.setState({
            cD: false,
            cD_x: e.pageX + this.target.dx,
            cD_y: e.pageY + this.target.dy
        })
    }
    /**
     * 拖动
     */
    anchorMove = e => {
        this.stop(e);
        if ( !this.target || !!this.target && !this.target.state ) return;
        this.calcHL(e);
        if (!this.state.cD && Math.pow(e.pageX + this.target.dx - this.state.cD_x,2) + Math.pow(e.pageY + this.target.dy - this.state.cD_y,2) < 16) return;
        this.setState({
            cD: true,
            cD_x: e.pageX + this.target.dx,
            cD_y: e.pageY + this.target.dy
        })
    }
    /**
     * 拖拽结束
     */
    anchorMoveEnd = e => {
        this.stop(e);
        if ( !this.target || !!this.target && !this.target.state ) return;
        let target,basePoint,d = this.target.data;
        this.highLight.map((item,i) => {
            if (item != '') {
                target = 'trblc'.charAt(i);
                basePoint = item;
            }
        })
        if (!!target && basePoint && (d.target != target || d.target == target && d.basePoint != basePoint)) {
            d.target = target;
            d.basePoint = basePoint;
            this.config.anchor.push(d);
            this.config.anchor.splice(this.target.i,1);
            !!this.props.changeAnchor && this.props.changeAnchor(this.config.anchor);
        }
        this.target = false;
        this.highLight = ['','','','',''];
        this.setState({
            cD: false
        })
    }
    /*
     * 拖动位置计算
     */
    calcHL = e => {
        let boxs = this.refs.layoutBox.getElementsByClassName('layoutPart'),
            len = boxs.length,
            x = e.pageX,
            y = e.pageY,
            highLight = ['','','','',''];
        for (let i = 0; i < len; i++) {
            let key = boxs[i].getAttribute('dir'),
                l = boxs[i].offsetLeft,
                t = boxs[i].offsetTop,
                w = boxs[i].offsetWidth,
                h = boxs[i].offsetHeight,
                m = 0,
                n = '',
                r = 0,
                c = 0;
            if (l < x && l + w > x && t < y && t + h > y && key != _T_) {
                m = [_T_,_R_,_B_,_L_,_C_].indexOf(key);
                r = Math.floor(Math.abs(y / (t + h / 2)));
                c = Math.floor(Math.abs(x / (l + w / 2)));

                if (key == _R_ || key == _L_) n = ['ab','cd'][r];
                else if (key == _B_) n = ['da','bc'][c];
                else if (key == _C_) n = 'abdc'.charAt( r * 2 + c);

                highLight[m] = n;
                this.highLight = highLight;

                return
            }
        }
    }
    render () {
        let {config, ind} = this.props;
        if (this.key !== ind) {
            this.key = ind;
            this.config = config;
        }
        let cf = this.config,
            build = (cN, height, width, target, hl) => {
                let tI = {
                    a: {i: 0, increment: 'top', base: _a_, top: dx, left: dy},
                    b: {i: 0, increment: 'top', base: _b_, top: dx, right: dy},
                    c: {i: 0, increment: 'bottom', base: _c_, bottom: dx, right: dy},
                    d: {i: 0, increment: 'bottom', base: _d_, bottom: dx, left: dy},
                    e: {i: 0, increment: 'left', base: _a_, top: height / 2 - 20, left: width / 2 - 20},
                    ab: {i: 0, increment: 'top', base: _a_, top: dx, left: width / 2 - 20},
                    bc: {i: 0, increment: 'right', base: _b_, top: height / 2 - 20, right: dy},
                    cd: {i: 0, increment: 'bottom', base: _d_, bottom: dx, left: width / 2 - 20},
                    da: {i: 0, increment: 'left', base: _a_, top: height / 2 - 20, left: dy}
                }
                return <div className = {'layoutPart ' + cN} dir = {cN} style = {{height: height, width: width}}>
                    <div className = {hl}></div>
                    {
                        cf.anchor.map((item,i) => {
                            if (item.target == target) {
                                let sty = {}, it = tI[item.basePoint];
                                it.base.map(k => {
                                    sty[k] = it[k] + (k == it.increment ? it.i * 50 : 0);
                                });
                                let img = <img  draggable = "false" onMouseDown = {e => this.startDrag(e,item,i)} style = {sty} onContextMenu = {e => this.openMenu(e,item,i)} onDoubleClick = {e => this.dbClick(e,item,i)} src = {'./assets/mappingLayout/' + item.type + '.png'}/>;
                                ++tI[item.basePoint].i;
                                return img
                            }
                        })
                    }
                </div>
            },
            _h = cf.height - (cf.view[0] ? _TH_ + 10 : 0) - (cf.view[2] ? _TH_ + 10 : 0) - 20,
            _w = cf.width - (cf.view[1] ? _RW_ + 10 : 0) - (cf.view[3] ? _RW_ + 10 : 0) - 20,
            _t = cf.view[0] ? build(_T_, _TH_, cf.width - 20, 't', this.highLight[0]) : '',
            _b = cf.view[2] ? build(_B_, _TH_, cf.width - 20, 'b', this.highLight[2]) : '',
            _r = cf.view[1] ? build(_R_, _h, _RW_, 'r', this.highLight[1]) : '',
            _l = cf.view[3] ? build(_L_, _h, _RW_, 'l', this.highLight[3]) : '',
            _c = build(_C_, _h, _w, 'c', this.highLight[4]);
        
        let dragImg = (this.state.cD && !!this.target.state) ? <img  draggable = "false" style = {{left: this.state.cD_x, top: this.state.cD_y}} className = 'dragImg' src = {'./assets/mappingLayout/' + this.target.data.type + '.png'}  /> : '';

        return <div className = 'layoutBox' onMouseMove = {e => this.anchorMove(e)} onMouseUp = {e => this.anchorMoveEnd(e)} onClick = {e => this.clear(e)} ref = 'layoutBox' onContextMenu = {e => false} style = {{height: cf.height, width: cf.width}}>
            { _t } { _l } { _c } { _r } { _b } 
            <div className = 'contextMenu' style = {{display: this.state.cM ? 'block' : 'none', left: this.state.cM_x, top: this.state.eM_y}}>
                <div onClick = {e => this.deleteAnchor(e)}>删除</div>
            </div>
            { dragImg }
        </div>
    }
}

export default Layout