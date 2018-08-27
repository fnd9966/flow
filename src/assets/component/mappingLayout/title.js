
import React from 'react'

class Title extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            color: false
        }
    }
    key = -1;
    data = {
        text: '', 
        textAlign: 'left',
        fontSize: 70,
        color: '#ffffff'
    }
    btn = [
        {name: '居左', key: 'left'},
        {name: '居中', key: 'center'},
        {name: '居右', key: 'right'}
    ]
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
        this.data.fontSize = this.toNum(this.data.fontSize);
        let data = !!key ? this.data : false;
        !!this.props.close && this.props.close(data);
    }
    /**
     * 标题赋值
     */
    handleText = (newValue,key) => {
        this.data[key] = newValue;
        this.setState();
    }
    /**
     * 对齐方式
     */
    changeTextAlign = key => {
        this.data.textAlign = key;
        this.setState();
    }
    /**
     * 打开颜色选择 
     */
    openColorSelect = e => {
        this.stop(e);
        this.setState({
            color: this.data.color
        })
    }
    /**
     * 选择颜色
     */
    changeColor = (e,rgb,key) => {
        if (!!key) {
            this.data.color = rgb;
            this.setState({color: false})
        } else {
            this.setState({color: rgb});
        }
    }
    render () {
        let {data, ind} = this.props,color = '';
        if (ind != this.key) {
            this.key = ind;
            this.data = Object.assign({},data,{});
        }
        if (!!this.state.color) {
            let firstColC = ['000000','333333','666666','999999','CCCCCC','FFFFFF','FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF'];
            let _colorTable = <table className = "colorTable">
                    {
                        firstColC.map((item,i) => {
                            let tdC = [];
                            for (let j = 0; j < 20; j++ ) {
                                let rgb;
                                if (j == 0) { rgb = item;} 
                                else if (j == 1) { rgb = firstColC[0];}
                                else {
                                    let cChar = '0369CF',
                                        r = cChar.charAt(Math.floor(i / 6) * 3 + Math.floor((j - 2) / 6)),
                                        g = cChar.charAt(Math.floor((j - 2) % 6)),
                                        b = cChar.charAt(Math.floor(i % 6));
                                        rgb = r + r + g + g + b + b;
                                }
                                rgb = '#' + rgb;
                                tdC.push(<td style = {{ backgroundColor: rgb}} onMouseOver = {e => this.changeColor(e,rgb)} onClick = {e => this.changeColor(e,rgb,true)}></td>)
                            }
                            return <tr>
                                {
                                    tdC.map(c => c)
                                }
                            </tr>
                        })
                    }
                </table>
            color = <div className = "colorPanel" >
                    <div className = "colorPanelT">
                        <i style = {{backgroundColor: this.state.color}}></i>
                        <input disabled="disabled" value = {this.state.color.substr(1)} />
                    </div>
                    <div style = {{padding: 5}}>{_colorTable}</div>
                </div>
        }

        return <div className = 'popupBox titleAttr'>
            <div className = 'titleLine' >
                标题属性面板 <span onClick = {e => this.close(e)}>×</span>
            </div>
            <div className = 'inputLine'>
                <span>标题：</span>
                <input placeholder = '标题' valueLink={{value : this.data.text,requestChange: v => this.handleText(v,'text')}} />
            </div>
            <div className = 'inputLine'>
                <span>字体大小：</span>
                <input placeholder = '字号' valueLink={{value : this.data.fontSize,requestChange: v => this.handleText(v,'fontSize')}} />
            </div>
            <div className = 'inputLine'>
                <span>字体颜色：</span>
                <div className = 'colorSelect' onClick = {e => this.openColorSelect(e)}><i style = {{backgroundColor: this.data.color}}></i></div>
            </div>
            <div className = 'inputLine'>
                <span>对齐方向：</span>
                {
                    this.btn.map(v => <btn onClick = {e => this.changeTextAlign(v.key)} className = {this.data.textAlign == v.key ? 'active' : ''}>{v.name}</btn>)
                }
                <div className = 'saveBtn' onClick = {e => this.close(e,true)}>保 存</div>
            </div>
            { color }
        </div>
    }
}

export default Title


// 颜色选择
export let colorTool = function (obj,textW) {
    let tw = textW || 70;
    return '<div style = "height: 34px; width: ' + tw + 'px; float: left; text-align: center;">' + obj.name + '</div>' + 
            '<div style = "float: left; background-color: #fff; cursor: pointer; height: 14px; width: 14px; margin: 10px;" class = "_mk_t_color" key = ' + obj.key + ' left = ' + obj.left + ' bottom = ' + obj.bottom + '>' + 
                '<i style = "display: block; height: 10px; width: 10px; margin: 2px; background-color: ' + obj.value + '; "></i>' + 
            '</div>'
}