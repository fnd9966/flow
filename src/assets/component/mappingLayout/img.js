
import React from 'react'

class Img extends React.Component {
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
    /**
     * 图片选择
     */
    selectFile = e => {
        this.stop(e);
        let inp = this.refs.selectFile;
        if (!inp) return;
        inp.click();
    }
    /**
     * 切换图片
     */
    changeImg = () => {
        let inp = this.refs.selectFile;
        if (!inp) return;
        let files = inp.files;

        if (files.length > 0) {
            let _URL = window.URL || window.webkitURL,
                img = new Image();
            img.onload = () => {
                let w = img.width,
                    h = img.height,
                    i_canvas = document.createElement('canvas'),
                    i_ctx = i_canvas.getContext('2d');

                i_canvas.width = this.data.width = w;
                i_canvas.height = this.data.height = h;

                i_ctx.drawImage(img, 0, 0);
                this.data.img = i_canvas.toDataURL('image/png');
                this.setState();
            };

            img.src = _URL.createObjectURL(files[0]);
            
        } else {
            return
        }
        
    }
    render () {
        let {data, ind} = this.props;
        if (ind != this.key) {
            this.key = ind;
            this.data = Object.assign({},data,{});
        }
        let img = '',d = this.data;
        if (!!d.img) {
            let imgSty = {},k = d.width / d.height;
            if (k > 23 / 25) {  
                imgSty.width = 230;
                imgSty.height = 230 / k;
            } else {
                imgSty.height = 250;
                imgSty.width = 250 * k;
            }
            img = <img style = {imgSty} src = {d.img} />;
        }
        return <div className = 'popupBox imgAttr'>
            <div className = 'titleLine' >
                图片属性面板 <span onClick = {e => this.close(e)}>×</span>
            </div>
            <div className = 'popupL'>
                { img }
            </div>
            <div className = 'popupR'>
                <div className = 'inputLine'>
                    <span>宽度：</span>
                    <input placeholder = '图片宽度' valueLink={{value : this.data.width,requestChange: v => this.handleAttr(v,'width')}} />
                </div>
                <div className = 'inputLine'>
                    <span>高度：</span>
                    <input placeholder = '图片高度' valueLink={{value : this.data.height,requestChange: v => this.handleAttr(v,'height')}} />
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
                <div style = {{height: 10}}></div>
                <div className = 'inputLine'>
                    <span></span>
                    <input className = 'selectFile' onChange = {() => this.changeImg()} ref = 'selectFile' type = "file" accept=".png,.jpg" />
                    <div className = 'saveBtn' onClick = {e => this.close(e,true)}>保 存</div>
                    <div className = 'saveBtn' onClick = {e => this.selectFile(e)}>图片选择</div>
                </div>
            </div>
        </div>
    }
}

export default Img