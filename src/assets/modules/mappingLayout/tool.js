
import React from 'react'

class Tool extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    key = -1;
    tool = [];
    componentWillMount () {

    }
    componentDidMount () {
        
    }
    /**
     * 打开/关闭二级菜单
     */
    openSecondTool = (i,key) => {
        this.tool[i].hover = key;
        this.setState();
    }
    stop = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (e.cancelBubble) {
            e.cancelBubble = true;
        }
    }
    /**
     * 点击事件
     */
    click = (e,item) => {
        this.stop(e);
        !!this.props.click && this.props.click(item)
    }
    render () {
        let {config, ind} = this.props;
        if (this.key !== ind) {
            this.key = ind;
            this.tool = config;
        }
        return <div className = 'toolBar'>
            {
                this.tool.map((child,c) => {
                    let childActive = !!child.hover ? 'active' : '',
                        icon = !!child.icon ? <img src = {'./assets/mappingLayout/' + child.icon + '.png'} /> : '',
                        children = !!child.children ? <div className = 'tool_level2'  style = {{width: child.width || 100}}>
                            {
                                child.children.map((item,i) => {
                                    let cN = (item.type == 'select' && !!item.state) ? 'active' : '';
                                    return <div className = {cN} onClick = {e => { this.click(e,item) }}>{item.name}</div>
                                })
                            }
                        </div> : '';
                    return <div className = {'toolItem ' + childActive} onClick = {e => { this.click(e,child) }} onMouseOver = {() => this.openSecondTool(c,true)} onMouseOut = {() => this.openSecondTool(c,false)} style = {{width: child.width || 100}}>
                        <div className = 'tool_level1'>{icon} {child.name} <span></span></div>
                        { children }
                    </div>
                })
            }
        </div>
    }
}

export default Tool