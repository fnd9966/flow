
import React from 'react'
import { compassList, scaleList} from './dataConfig'

class Scale extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    key = -1;
    data = {
        
    }
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
        let data = !!key ? this.data : false;
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
        this.setState();
    }
    /**
     * 图片
     */
    changeImg = name => {
        this.data.img = name;
        this.setState();
    }
    render () {
        let {data, ind, title} = this.props;
        if (ind != this.key) {
            this.key = ind;
            this.data = Object.assign({},data,{});
            let _d = this.data;
            if (!!_d) {
                if (_d.type == 'scale') {
                    this.img = scaleList;
                } else if (_d.type == 'compass') {
                    this.img = compassList;
                } else { 
                    this.img = [];
                }
            }
            if (!_d.img && this.img.length > 0) { this.data.img = this.img[0].name; }
        }

        return <div className = 'popupBox scaleAttr'>
            <div className = 'titleLine' >
                {title}属性面板 <span onClick = {e => this.close(e)}>×</span>
            </div>
            <div className = 'popupL'>
                {
                    this.img.map(item => {
                        let ICN = item.name == this.data.img ? 'active' : '';
                        return <img onClick = {e => this.changeImg(item.name)} className = {ICN} src = {'./assets/mappingLayout/img/' + item.name + '.png'} />
                    })
                }
            </div>
            <div className = 'popupR'>
                <div className = 'inputLine'>
                    <span>类型：</span>
                    <input value = {title} disabled = "disabled"/>
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
                </div>
            </div>
        </div>
    }
}

export default Scale