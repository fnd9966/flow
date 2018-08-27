import React from 'react';
import ReactDOM from 'react-dom';
import './css/Canvas_fnd.less';
import $ from 'jquery';
import ConfigModal from '../form_fnd/form_fnd.js';
import WrapperFlowForm from './flowForm.js';
import { Icon, Button, Input, AutoComplete, Modal, message, notification } from 'antd';

const Option = AutoComplete.Option;
class Canvas_fnd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nodeName:'',
			config_modal:false,
			
			lineFlag:false, //连线的标志
			width:props.canvasProperty.width || 800, //整个demo的宽度
			height:props.canvasProperty.height || 500, //整个demo的高度
			title:'', //流程图的名称
			// lineFlag:false
			node_id:new Date().getTime(),
			top:'',
			flowTitleFlag:false,//流程图头部是否显示,
			// editFlow:false,//是否要修改流程图的基本配置信息
			flowData:[],//流程图基本配置信息的数据
			editData:null,
			modalVisible:false, //是否打开浏览流程
			autoValue:'',
			flowNode: null,
			editFlow:false, //加载已有的flow
			disableFlowId:false, //是否禁用flowid的输入
			line_open:false,//设置初始的线条类型选择为false，不显示
		};
		this.handleModifyTitle = this.handleModifyTitle.bind(this);
		this.handleHeadTitle = this.handleHeadTitle.bind(this);
	}
	//下面绑定当结点/线/分组块的一些操作事件,这些事件可直接通过this访问对象本身
	  //当操作某个单元（结点/线/分组块）被添加时，触发的方法，返回FALSE可阻止添加事件的发生
	  //格式function(id，type,json)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值,json即addNode,addLine或addArea方法的第二个传参json.
	  onItemAdd=null;
	  //当操作某个单元（结点/线/分组块）被删除时，触发的方法，返回FALSE可阻止删除事件的发生
	  //格式function(id，type)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值
	  onItemDel=null;
	  //当操作某个单元（结点/分组块）被移动时，触发的方法，返回FALSE可阻止移动事件的发生
	  //格式function(id，type,left,top)：id是单元的唯一标识ID,type是单元的种类,有"node","area"两种取值，线line不支持移动,left是新的左边距坐标，top是新的顶边距坐标
	  onItemMove=null;
	  //当操作某个单元（结点/线/分组块）被重命名时，触发的方法，返回FALSE可阻止重命名事件的发生
	  //格式function(id,name,type)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值,name是新的名称
	  onItemRename=null;
	  //当操作某个单元（结点/线）被由不选中变成选中时，触发的方法，返回FALSE可阻止选中事件的发生
	  //格式function(id,type)：id是单元的唯一标识ID,type是单元的种类,有"node","line"两种取值,"area"不支持被选中
	  onItemFocus=null;
	  //当操作某个单元（结点/线）被由选中变成不选中时，触发的方法，返回FALSE可阻止取消选中事件的发生
	  //格式function(id，type)：id是单元的唯一标识ID,type是单元的种类,有"node","line"两种取值,"area"不支持被取消选中
	  onItemBlur=null;
	  //当操作某个单元（结点/分组块）被重定义大小或造型时，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
	  //格式function(id，type,width,height)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值;width是新的宽度,height是新的高度
	  onItemResize=null;
	  //当移动某条折线中段的位置，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
	  //格式function(id，M)：id是单元的唯一标识ID,M是中段的新X(或Y)的坐标
	  onLineMove=null;
	  //当变换某条连接线的类型，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
	  //格式function(id，type)：id是单元的唯一标识ID,type是连接线的新类型,"sl":直线,"lr":中段可左右移动的折线,"tb":中段可上下移动的折线
	  onLineSetType=null;
	  //当变换某条连接线的端点变更连接的结点时，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
	  //格式function(id，newStart,newEnd)：id是连线单元的唯一标识ID,newStart,newEnd分别是起始结点的ID和到达结点的ID
	  onLinePointMove=null;
	  //当用重色标注某个结点/转换线时触发的方法，返回FALSE可阻止重定大小/造型事件的发生
	  //格式function(id，type，mark)：id是单元的唯一标识ID,type是单元类型（"node"结点,"line"转换线），mark为布尔值,表示是要标注TRUE还是取消标注FALSE
	  onItemMark=null;
	headHeight = 28; //头部的高度
	toolWidth = 34; //工具栏的宽度
	max = 1;//计算默认的ID起始值
	$nodeDom = {};
	// nodeDom = {};
	nodeData = {};//节点对象
	lineData = {};//连线的对象
	$lineDom = {};
	focusId = '';//当前被选中的节点，如果没有被选中，则为空
	editable = false; //是否可编辑状态
	// $draw = null;//画线条的容器
	// lineFlag = false //线条类型显示与否
	lineType = 'default'
	nowType = 'cursor'
	flowTitleNum = 0;//默认流程图的头部个数为0，当创建成功后加1
	doubleClick = false;//默认生成流程图的头部，只有当双击之后才能修改头部名称
	titleArr = [];//存放新建流程图名称的数组
	dataSource = [] //option的值
	flow_id = 0; //创建流程图的id，自定义

	ctx 
	target = false
	ele
	allFlowData = {}
	_i = -1
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
	//折线箭头
	drawArrowZ = (start,end,m1,m2,color) => {
		let fromX = start[0],
    		fromY = start[1],
    		toX = end[0],
    		toY = end[1],
    		m1X = m1[0],
			m1Y = m1[1],
			m2X = m2[0],
			m2Y = m2[1];
    	let ctx = this.ctx;
    	let theta = 30;
    	let headlen = 10;
    	let width = 2;
	    color = typeof(color) != 'undefined' ? color: '#000';

	    // 计算各角度和对应的P2,P3坐标
	    var angle = Math.atan2(m2Y - toY, m2X - toX) * 180 / Math.PI,
	        angle1 = (angle + theta) * Math.PI / 180,
	        angle2 = (angle - theta) * Math.PI / 180,
	        topX = headlen * Math.cos(angle1),
	        topY = headlen * Math.sin(angle1),
	        botX = headlen * Math.cos(angle2),
	        botY = headlen * Math.sin(angle2);
	        
	    
	    ctx.save();
	    ctx.beginPath();
	    
	    var arrowX = fromX - topX,
	        arrowY = fromY - topY;
	        // debugger
	    ctx.moveTo(fromX, fromY);
	    ctx.lineTo(m1X,m1Y);
		ctx.lineTo(m2X,m2Y);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + topX;
	    arrowY = toY + topY;
	    ctx.moveTo(arrowX, arrowY);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + botX;
	    arrowY = toY + botY;
	    ctx.lineTo(arrowX, arrowY);
	    ctx.strokeStyle = color;
	    ctx.lineWidth = width;
	    ctx.stroke();
	    ctx.restore();
	}
	drawLine = (start,end,theta,headlen,width,color) => {
		let fromX = start[0],
    		fromY = start[1],
    		toX = end[0],
    		toY = end[1];
    	let ctx = this.ctx;
	    theta = typeof(theta) != 'undefined' ? theta: 30;
	    headlen = typeof(headlen) != 'undefined' ? headlen: 10;
	    width = typeof(width) != 'undefined' ? width: 2;
	    color = typeof(color) != 'undefined' ? color: '#000';
	    
	    // 计算各角度和对应的P2,P3坐标
	    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
	        angle1 = (angle + theta) * Math.PI / 180,
	        angle2 = (angle - theta) * Math.PI / 180,
	        topX = headlen * Math.cos(angle1),
	        topY = headlen * Math.sin(angle1),
	        botX = headlen * Math.cos(angle2),
	        botY = headlen * Math.sin(angle2);
	        
	    
	    ctx.save();
	    ctx.beginPath();
	    
	    var arrowX = fromX - topX,
	        arrowY = fromY - topY;
	    // ctx.moveTo(arrowX, arrowY);
	    ctx.setLineDash([25,5]);
	    ctx.lineWidth = 4;
	    ctx.strokeStyle = '#f36';
	    
	    ctx.moveTo(fromX, fromY);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + topX;
	    arrowY = toY + topY;
	    ctx.moveTo(arrowX, arrowY);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + botX;
	    arrowY = toY + botY;
	    ctx.lineTo(arrowX, arrowY);
	    // ctx.strokeStyle = color;
	    // ctx.lineWidth = width;
	    ctx.stroke();
	    ctx.restore();

	}
	//箭头连线
	drawArrow(start,end,color) {
    	let fromX = start[0],
    		fromY = start[1],
    		toX = end[0],
    		toY = end[1];
    	let ctx = this.ctx;
    	let theta = 30;
    	let headlen = 10;
    	let width = 2;
	    color = typeof(color) != 'undefined' ? color: '#000';
	    
	    // 计算各角度和对应的P2,P3坐标
	    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
	        angle1 = (angle + theta) * Math.PI / 180,
	        angle2 = (angle - theta) * Math.PI / 180,
	        topX = headlen * Math.cos(angle1),
	        topY = headlen * Math.sin(angle1),
	        botX = headlen * Math.cos(angle2),
	        botY = headlen * Math.sin(angle2);
	        
	    
	    ctx.save();
	    ctx.beginPath();
	    
	    var arrowX = fromX - topX,
	        arrowY = fromY - topY;
	    ctx.moveTo(fromX, fromY);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + topX;
	    arrowY = toY + topY;
	    ctx.moveTo(arrowX, arrowY);
	    ctx.lineTo(toX, toY);
	    arrowX = toX + botX;
	    arrowY = toY + botY;
	    ctx.lineTo(arrowX, arrowY);
	    ctx.strokeStyle = color;
	    ctx.lineWidth = width;
	    ctx.stroke();
	    ctx.restore();
	  }
	//画方格
	drawGrid(ctx,w,h,strokeStyle,step) {
		//竖线
		for(let x = 0.5; x < w; x += step) {
			ctx.moveTo(x,0);
			ctx.lineTo(x,h);
		}
		//横向
		for(let y = 0.5; y < h; y += step) {
			ctx.moveTo(0,y);
			ctx.lineTo(w,y);
		}
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
	//初始化画布
	initCanvas(width,height) {
		let ele = this.ele = this.refs.canvas_arrow;
		let _ctx = this.ctx = ele.getContext('2d');
		_ctx.beginPath();
		this.drawGrid(_ctx,width,height,'#eee',10);
		// this.drawLine([300,300],[400,400]);
	}
	componentWillMount() {
		
	}
	componentDidMount() {
		this.getSelectData()
		this.refs.direct.oncontextmenu = function(e) { return false; }
		let workArea = $('.flow_work');
        this.workArea = workArea;
		//对结点进行移动或者RESIZE时用来显示的遮罩层
		this.$ghost=$("<div class='rs_ghost'></div>").attr({"unselectable":"on","onselectstart":'return false',"onselect":'document.selection.empty()'});
		workArea.append(this.$ghost);
		workArea.append(this.$textArea);

		let toolHeight = this.state.height - this.headHeight - 1;
        let workWidth = this.state.width - this.toolWidth - 1;
        
        this.initCanvas(workWidth,toolHeight);

		this.workArea.delegate('.GooFlow_item','click',{inthis:this},(e) => {
			// let id = $(e.target).attr('id');
			let tar = e.target;
			if(tar.tagName == 'TD') tar = $(tar).parents('.GooFlow_item');
			let id = $(tar).attr('id');
			this.focusItem(id,false);
			$(tar).removeClass('item_mark');
			return false;
			// console.log('click');
		});
		this.workArea.delegate('.ico','mousedown',{inthis:this},(e) => { 
			// this.stop(e);
			if(!e) e=window.event;
			if(e.button==2)return false;
			let This=e.data.inthis;
			// console.log(This)
			// console.log(e.target);
			if(this.nowType=="direct")	return;
			let Dom = $(e.target).parents('.GooFlow_item');
			// let Dom = $(e.target);
			let id = Dom.attr('id');
			This.focusItem(id,true);

			var ev=this.mousePosition(e),t=this.getElCoordinate($('.flow_work')[0]);
			
			// Dom.children("table").clone().prependTo(This.$ghost);
			Dom.children('span').clone().prependTo(This.$ghost);
			var X,Y;
			X=ev.x-t.left;
			Y=ev.y-t.top;
			var vX=X-This.nodeData[id].left,vY=Y-This.nodeData[id].top;
			var isMove=false;
			document.onmousemove=function(e){
				if(!e) e=window.event;
				var ev=This.mousePosition(e);
				if(X==ev.x-vX&&Y==ev.y-vY)	return false;
				X=ev.x-vX;Y=ev.y-vY;
				if(isMove&&This.$ghost.css("display")=="none"){
					This.$ghost.css({display:"block",
						width:This.nodeData[id].width+"px", height:This.nodeData[id].height+"px",
						top:This.nodeData[id].top+t.top+"px",
						left:This.nodeData[id].left+t.left+"px",cursor:"move"
					});
				}

				if(X<t.left)
					X=t.left;
				else if(X+This.nodeData[id].width>t.left+$('.flow_work').width())
					X=t.left+$('.flow_work').width()-This.nodeData[id].width;
				if(Y<t.top)
					Y=t.top;
				else if(Y+This.nodeData[id].height>t.top+$('.flow_work').height())
					Y=t.top+$('.flow_work').height()-This.nodeData[id].height;
				This.$ghost.css({left:X-t.left+"px",top:Y-t.top+"px"});
				isMove=true;
			}
			document.onmouseup=function(e){
				if(isMove)This.moveNode(id,X-t.left,Y-t.top);
				This.$ghost.empty().hide();
				document.onmousemove=null;
				document.onmouseup=null;
			}
			return false


		});
		// let that = this;
		this.workArea.delegate(".ico + td","dblclick",(e) => {
			// this.stop(e);
			this.setState({
				config_modal:true,
				nodeName:e.target.innerHTML,
			});
			// console.log(e.target)
			let id = $(e.target).parents('.GooFlow_item').attr('id');
			// let id = $(e.target).attr('id');
			this.focusId = id;
			let focusNode = {};
			// console.log(this.flowNode);
			let nodeData = {};

			if(this.flowNode && !this.oriFlowData) {
				for (let i = 0, nLen = this.flowNode.length; i < nLen; i++) {
					// if(this.flowNode[i].node_id == this.focusId) {
					// 	for( let key in data) {
					// 		this.flowNode[i][key] = data[key];
					// 	}

					// }

					// if(!this.isArray(this.flowNode[i].api)) {
					// 	console.log(2);
					// 	console.log(this.flowNode[i].api);
					// 	this.flowNode[i].api = JSON.parse(this.flowNode[i].api)
					// }
					// if(!this.isArray(this.flowNode[i].attribute)) {
					// 	this.flowNode[i].attribute = JSON.parse(this.flowNode[i].attribute)
					// }
					let basicAttr = ['column_key', 'column_name', 'type', 'isEdit', 'isReq'];
					let attr = this.flowNode[i].attribute;
					if(attr) {
						attr = eval(attr);
						for(let m = 0, aLen = attr.length; m < aLen; m++) {
							for(let n in attr[m]) {
								if(!this.isInArray(basicAttr, n)) {
									let _i = 1;
									let _d = {key: n, name: n, i:_i};
									attr[m].keys = [];
									attr[m].keys.push(_d);
									_i++; 

								}
								
							}
						}
					}
					this.flowNode[i].attribute = attr;
					let id = this.flowNode[i].node_id;
					nodeData[id] = this.flowNode[i]
				}
				console.log(nodeData)
				for (let k in nodeData) {

					this.nodeData[k].nodeInfo = nodeData[k];
				}
				for (let key in this.nodeData) {
					if(key == this.focusId) {
						focusNode = this.nodeData[key].nodeInfo;
					} 
				}
				// this.setState({
				// 	flowNode:focusNode
				// })

				// for (let i = 0, nLen = this.flowNode.length; i < nLen; i++) {
				// 	if(this.flowNode[i].node_id == this.focusId) {
				// 		focusNode = this.flowNode[i];
				// 	}
				// }
				setTimeout(() => {
					++this._i;
					this.setState({
						flowNode:focusNode
					})
				},0)
			}else {
				for (let key in this.nodeData) {
					if(key == this.focusId) {
						focusNode = this.nodeData[key].nodeInfo;
					} 
				}
				setTimeout(() => {
					++this._i;
					this.setState({
						flowNode:focusNode
					})
				},0)
			}


			
		});
		this.workArea.delegate('.rs_close','click',{inthis:this},(e) => {
			if(!e)e=window.event;
			console.log('delete');
			this.delNode(this.focusId);
			return false;
		});
		//绑定节点的resize功能
		this.workArea.delegate(".GooFlow_item > div > div[class!=rs_close]","mousedown",{inthis:this},(e) => {
			if(!e)e = window.event;
			if(e.button == 2) return false;
			let cursor = $(e.target).css('cursor');
			if(cursor == 'pointer') return;
			let id = this.focusId;
			this.switchToolBtn('cursor');
			e.cancelBubble = true;
			e.stopPropagation();
			let ev = this.mousePosition(e), t = this.getElCoordinate($('.flow_work')[0]);
			this.$ghost.css({display:"block",
				width:this.nodeData[id].width+"px", height:this.nodeData[id].height+"px",
				top:this.nodeData[id].top+"px",
				left:this.nodeData[id].left+"px",cursor:cursor
			});
			var X,Y;
			X=ev.x-t.left;
			Y=ev.y-t.top;
			var vX=(this.nodeData[id].left+this.nodeData[id].width)-X;
			var vY=(this.nodeData[id].top+this.nodeData[id].height)-Y;
			var isMove=false;
			this.$ghost.css("cursor",cursor);
			var that = this;
			document.onmousemove=function(e){
				if(!e)e=window.event;
				var ev=that.mousePosition(e);
				X=ev.x-t.left-that.nodeData[id].left+vX;
				Y=ev.y-t.top-that.nodeData[id].top+vY;
				if(X<104)	X=104;
				if(Y<26)	Y=26;
				isMove=true;
				switch(cursor){
					case "nw-resize":that.$ghost.css({width:X+"px",height:Y+"px"});break;
					case "w-resize":that.$ghost.css({width:X+"px"});break;
					case "n-resize":that.$ghost.css({height:Y+"px"});break;
				}
			}
			document.onmouseup=function(e){
				document.onmousemove=null;
				document.onmouseup=null;
				that.$ghost.hide();
				if(!isMove)return;
				if(!e)e=window.event;
				that.resizeNode(id,that.$ghost.outerWidth(),that.$ghost.outerHeight());
	  		}
		});
		this.workArea.delegate('.GooFlow_item','mouseenter',{inthis:this},(e) => {
			// console.log(this.nowType);
			// debugger
			if(this.nowType!='direct') return;
			let tar = e.target;
			switch(tar.tagName) {
				case 'TD':tar = $(tar).parents('.GooFlow_item'); break;
				case 'I':tar = $(tar).parents('.GooFlow_item');
				
			}
			$(tar).addClass('item_mark').addClass('crosshair').css('border-color',"#ff8800");
			// console.log('mouseenter');
			return false;
		});
		this.workArea.delegate(".GooFlow_item","mouseleave",{inthis:this},(e) => {
			// console.log(1);
			// console.log(this.nowType);
			if(this.nowType!='direct') return;
			let tar = e.target;
			switch(tar.tagName) {
				case 'TD':tar = $(tar).parents('.GooFlow_item'); break;
				case 'I':tar = $(tar).parents('.GooFlow_item');
				
			}
			$(tar).removeClass("item_mark").removeClass("crosshair");
			if(this.id==this.focusId){
	        $(tar).css("border-color","#3892D3");
				}else{
	        $(tar).css("border-color","#A1DCEB");
				}
			// console.log('mouseleave');
			return false;
		});
		//绑定连线时确定初始点
		this.workArea.delegate(".GooFlow_item","mousedown",{inthis:this},(e) => {
			// console.log(1);
			// console.log(this.nowType);
			if(e.button==2)return false;
			if(this.nowType!="direct")	return;
			let tar = e.target;
			switch(tar.tagName) {
				case 'TD':tar = $(tar).parents('.GooFlow_item'); break;
				case 'I':tar = $(tar).parents('.GooFlow_item');
				
			}
			var ev=this.mousePosition(e),t=this.getElCoordinate($('.flow_work')[0]);
			var X,Y;
			let startId = tar.attr('id');
			X=ev.x-t.left;
			Y=ev.y-t.top;
			this.workArea.data('lineStart',{"x":X,"y":Y,"id":startId});

			var that = this;
			document.onmousemove=function(e){
				if(!e)e=window.event;
				var nev=that.mousePosition(e);
				var nt = that.getElCoordinate($('.flow_work')[0]);

				var newX, newY;
				newX = nev.x - nt.left;
				newY = nev.y - nt.top;
				let start = [X,Y];
				let end = [newX,newY];
				that.resetLines();
				that.drawLine(start,end);

			}
			document.onmouseup=function(e){
				document.onmousemove=null;
				document.onmouseup=null;
				that.resetLines();
	  		}


		});
		//绑定连线时确定结束点
		this.workArea.delegate(".GooFlow_item","mouseup",{inthis:this},(e) => {
			// var This=e.data.inthis;
			let lineStart = this.workArea.data('lineStart');
			// console.log(lineStart);
			if(this.nowType != 'direct')	return;
			let tar = e.target;
			switch(tar.tagName) {
				case 'TD':tar = $(tar).parents('.GooFlow_item'); break;
				case 'I':tar = $(tar).parents('.GooFlow_item');
				
			}
			let endLineId = $(tar).attr('id');
				if(lineStart) {
					this.addLine(new Date().getTime(),{from:lineStart.id,to:endLineId,name:'',type:'sl',condition:this.condition});
				}
			
		});
	}

	/**
	 * 判断元素是否在数组中
	 */
	  isInArray = (arr, value) => {
	    let i = arr.length;
	    while (i--) {
	      if(arr[i] === value) {
	        return true
	      }
	    }
	    return false
	  }

	handleModify = (value) => {
		this.setName(this.focusId,value,'node');
	}
	//判断是否是数组类型
    isArray = (o) => {
        return Object.prototype.toString.call(o)=='[object Array]';
    }
	handleSaveData = (data) => {
		// this.nodeData[this.focusId].nodeInfo = data;
		let nodeData = {};
		// if(this.flowNode) {
		// 	for (let i = 0, nLen = this.flowNode.length; i < nLen; i++) {
		// 		if(this.flowNode[i].node_id == this.focusId) {
		// 			for( let key in data) {
		// 				this.flowNode[i][key] = data[key];
		// 			}

		// 		}
		// 		if(!this.isArray(this.flowNode[i].api)) {
		// 			this.flowNode[i].api = JSON.parse(this.flowNode[i].api)
		// 		}
		// 		if(!this.isArray(this.flowNode[i].attribute)) {
		// 			this.flowNode[i].attribute = JSON.parse(this.flowNode[i].attribute)
		// 		}
		// 		let id = this.flowNode[i].node_id;
		// 		nodeData[id] = this.flowNode[i]
		// 	}
		// 	for (let k in nodeData) {
		// 		this.nodeData[k].nodeInfo = nodeData[k];
		// 	}
		// }else {
		// 	this.nodeData[this.focusId].nodeInfo = data;
		// }
		this.oriFlowData = true;
		this.nodeData[this.focusId].nodeInfo = data;
		console.log(this.flowNode);
		console.log(this.nodeData);
	}
	//重构所有连向某个节点的线的显示，传参结构为nodedata数组的一个单元结构
	resetLines = () => {
		// debugger
		// console.log(this.lineData);
		let toolHeight = this.state.height - this.headHeight - 1;
        let workWidth = this.state.width - this.toolWidth - 1;
		this.clearCanvas();
		this.initCanvas(workWidth,toolHeight);
		// this.findSimpleInObj(this.lineData);
		for(let j in this.lineData) {
			// debugger
			for (let i in this.lineData) {
				if(i != j && this.lineData[i].from == this.lineData[j].from && this.lineData[i].to == this.lineData[j].to) {
					delete this.lineData[i];
				}
			}
			this.addLine(j,this.lineData[j]);
			
		}
	}
	//设置节点的尺寸，仅支持非开始、结束节点
	resizeNode = (id,width,height) => {
		if(!this.nodeData[id]) return;
		if(this.onItemResize!=null && this.onItemResize(id,'node',width,height)) return;
		// if(this.nodeData[id].type == 'start' || this.nodeData[id].type == 'end') return;
		this.$nodeDom[id].children('table').css({width:width-2+'px',height:height-2+'px'});
		this.nodeData[id].width=width;
		this.nodeData[id].height = height;
		if(this.editable) {
			this.nodeData[id].alt = true;
		}
	}
	//删除节点
	delNode = (id,trigger) => {
		if(!this.nodeData[id]) return;
		if(false != trigger && this.onItemDel != null && !this.onItemDel(id,'node')) return;
		//先删除可能的连线
		for(let k in this.lineData) {
			if(this.lineData[k].from == id || this.lineData[k].to == id) {
				this.delLine(k,false);
			}
		}
		delete this.nodeData[id];
		this.$nodeDom[id].remove();
		delete this.$nodeDom[id];
		--this.nodeCount;
		if(this.focusId == id) this.focusId = '';
		this.resetLines();

	}
	//获取结点/连线/分组区域的详细信息
	getItemInfo = (id,type) => {
		switch(type){
			case "node":	return this.nodeData[id]||null;
			case "line":	return this.lineData[id]||null;
		}
	}
	setName = (id,name,type) => {
		let oldname;
		if(type == 'node') {
			if(!this.nodeData[id]) return;
			if(this.nodeData[id].name == name) return;
			if(this.onItemRename != null && !this.onItemRename(id,name,'node')) return;
			oldname = this.nodeData[id].name;
			this.nodeData[id].name = name;
			this.$nodeDom[id].find('td:eq(1)').text(name);
			let width = this.$nodeDom[id].width();
			let height = this.$nodeDom[id].height();
			this.$nodeDom[id].children('table').css({width:width+'px',height:height+'px'});
			this.nodeData[id].width = width;
			this.nodeData[id].height = height;
			
			if(this.editable) {
				this.nodeData[id].alt = true;
			}
		}
	}
	//清除画布
	clearCanvas = () => {
		let toolHeight = this.state.height - this.headHeight;
        let workWidth = this.state.width - this.toolWidth;
		let _ctx = this.ctx;
		_ctx.fillStyle = '#fff';
		_ctx.beginPath();
		_ctx.fillRect(0,0,workWidth - 1,toolHeight - 1);
		_ctx.closePath();
	}

	//判断数组中是否含有某个对象
	isObjInArray = (obj,arr) => {
		let isObj = JSON.stringify(arr).indexOf(JSON.stringify(obj));
		if(isObj !== -1) {
			return true
		}else {
			return false
		}
	}

	//切换左边工具栏按钮，传参type表示切换成那种类型的按钮
	switchToolBtn = (type) => {
		
		$("#demo_btn_"+this.nowType).attr('class','flow_tool_btn');
		this.nowType = type;//当前点击的类型
		$("#demo_btn_"+type).attr('class','flow_tool_btndown');
		if(this.nowType == 'direct') {
			this.blurItem();
		}
		// if(this.$textArea.css('display') == 'none') this.$textArea.removeData('id').val('').hide();
	}
	switchLineTypeBtn = (type) => {
		$("#line_btn_"+this.lineType).attr('class','flow_line_style');
		this.lineType = type;
		$("#line_btn_"+type).attr('class','flow_line_style_btndown');
	}
	//获取type类型
	getType = (e) => {
		if(!e) e = window.event;
		let tar;
		switch(e.target.tagName) {
			case "I":tar = e.target.parentNode;break;
			case "A": tar = e.target;
		}
		// console.log(e.target);
		let type = $(tar).attr("type");
		return type;
	}
	//获取连线的type类型
	getLineType = (e) => {
		if(!e) e = window.event;
		let tar;
		switch(e.target.tagName) {
			case 'SPAN':tar = e.target.parentNode; break;
			case 'I':tar = e.target.parentNode; break;
			case 'A':tar = e.target;
		}
		let type = $(tar).attr('type');
		return type;
	}
	//点击移动事件
	handleClickMove = (e) => {
		// console.log(1);
		let type = this.getType(e);
		this.switchToolBtn(type);
		this.editLineType = false;
		this.setState({
			lineFlag:false,
			line_open:false
		})
	}
	//新增节点
	handleClickNewNode = (e) => {
		// debugger
		let type = this.getType(e);
		this.switchToolBtn(type);

		this.editLineType = false;
		this.setState({
			lineFlag:false
		})
		
	}
	//增加一个流程节点，传参为一个json，有ID，name，top，left，width，height，type
	addNode = (id,json) => {
		if(this.onItemAdd!=null && !this.onItemAdd(id,'node',json)) return;
		let mark=json.marked? " item_mark":"";
		// if(json.type.indexOf('node') < 0) {
			if(!json.width || json.width < 104) json.width = 104;
			if(!json.height || json.height <26) json.height = 26;
			if(!json.top || json.top < 0) json.top = 0;
			if(!json.left || json.left < 0)json.left = 0;
			// this.$nodeDom[id] = $("<div class='GooFlow_item"+mark+"' id='"+id+"' style='top:"+json.top+"px;left:"+json.left+"px'><span class='ico' style='display:block;width:"+(json.width-2)+"px;height:"+(json.height-2)+"px;'>"+json.name+"</span><div style='display:none'><div class='rs_bottom'></div><div class='rs_right'></div><div class='rs_rb'></div><div class='rs_close'>x</div></div></div>");
			this.$nodeDom[id] = $("<div class='GooFlow_item"+mark+"' id='"+id+"' style='top:"+json.top+"px;left:"+json.left+"px'><table cellspacing='1' style='width:"+(json.width-2)+"px;height:"+(json.height-2)+"px;'><tr><td class='ico'><i class='ico_task'></i></td><td>"+json.name+"</td></tr></table><div style='display:none'><div class='rs_bottom'></div><div class='rs_right'></div><div class='rs_rb'></div><div class='rs_close'>x</div></div></div>");
		// }else {
		// 	json.width = 26;
		// 	json.height = 26;
		// 	//this.$nodeDom[id]=$("<div class='GooFlow_item item_round"+mark+"' id='"+id+"' style='top:"+json.top+"px;left:"+json.left+"px'><table cellspacing='0'><tr><td class='ico'><i class='ico_"+json.type+"'></i></td></tr></table><div  style='display:none'><div class='rs_close'></div></div><div class='span'>"+json.name+"</div></div>");
		// 	this.$nodeDom[id]=$("<div class='GooFlow_item item_round"+mark+"' id='"+id+"' style='top:"+json.top+"px;left:"+json.left+"px'><table cellspacing='0'><tr><td class='ico'><i class='ico_task'></i></td></tr></table><div  style='display:none'><div class='rs_close'></div></div><div class='span'>"+json.name+"</div></div>");

		// }
		let workArea = $('.flow_work');
		workArea.append(this.$nodeDom[id]);
		this.setState({
			line_open:false
		})
		// this.nodeData[id] = Object.assign({},json,{})
		this.nodeData[id] = json;

		++this.nodeCount;

	}
	//获取一个DIV的绝对坐标的功能函数,即使是非绝对定位,一样能获取到
	getElCoordinate = (dom) => {
	  var t = dom.offsetTop;
	  var l = dom.offsetLeft;
	  dom=dom.offsetParent;
	  while (dom) {
	    t += dom.offsetTop;
	    l += dom.offsetLeft;
		dom=dom.offsetParent;
	  }; return {
	    top: t,
	    left: l
	  };
	}
	//兼容各种浏览器的,获取鼠标真实位置
	mousePosition = (ev) => {
		if(!ev) ev=window.event;
	    if(ev.pageX || ev.pageY){
	        return {x:ev.pageX, y:ev.pageY};
	    }
	    return {
	        x:ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
	        y:ev.clientY + document.documentElement.scrollTop  - document.body.clientTop
	    };
	}
	//工作区域的点击事件
	handleWorkArea = (e) => {
		// console.log(1);
		this.setState({
					lineFlag:false
				})
		if(!e) e = window.event;
		if(!this.editable) {
			this.setState({
				line_open:false
			});
			return
		}
		let type = this.nowType;
		if(type == 'cursor') {
			// if()
			this.blurItem();
			return;
		} 
		// console.log(this.nowLineId)
		let x,y;
		let workArea = $('.flow_work');
		// console.log(workArea[0]);
		let ev = this.mousePosition(e), t=this.getElCoordinate(workArea[0]);
		x = ev.x - t.left;
		y = ev.y - t.top;
		this.setState({
			line_open:false
		})

		if(type == 'task') {
			this.addNode(`n${this.flow_id}_${this.formatNum(this.max)}`, {name:'node_'+this.max,left:x,top:y,type:this.nowType});
			this.max++;
		}
		
	}
	formatNum = (num) => {
		if(num < 10 && num > 0) {
			return '0' + num
		}
	}
	//移动节点到一个新的位置
	moveNode = (id,left,top) => {
		if(!this.nodeData[id]) return;
		if(this.onItemMove != null && !this.onItemMove(id,'node',left,top)) return;
		if(left < 0) left = 0;
		if(top < 0) top = 0;

		$('#'+id).css({left:left + 'px',top:top + 'px'});
		this.nodeData[id].left = left;
		this.nodeData[id].top = top;
		//重新划线
		this.resetLines();
		this.setState({
			line_open:false
		})
		// if(this.editable) {
		// 	this.nodeData[id].alt = true;
		// }
	}
	//选定某个节点
	focusItem = (id,bool) => {
		let jq = $('#'+id);
		// console.log(jq);
		if(jq.length == 0) return;
		if(!this.blurItem()) return;
		if(jq.prop('tagName') == 'DIV') {
			if(bool && this.onItemFocus!=null && !this.onItemFocus(id,'node')) return;
			jq.addClass('item_focus');
			if(this.editable)jq.children("div:eq(0)").css("display","block");
			let workArea = $('.flow_work');
			workArea.append(jq);
		}
		this.focusId = id;
		this.switchToolBtn('cursor');
	}
	/**
	 * 画选中的线
	 */
	drawFocusLine = (start, end, m1, m2, color) => {
		let fromX = start.x
			,fromY = start.y
			,toX = end.x
			,toY = end.y
			,ctx = this.ctx
			,width = 2
			,r = 5;
		ctx.beginPath();
		ctx.arc(fromX, fromY, r, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		if(m1 && m2) {
			let m1X = m1.x
				,m1Y = m1.y
				,m2X = m2.x
				,m2Y = m2.y;
			ctx.lineTo(m1X,m1Y);
			ctx.lineTo(m2X,m2Y);
		}
		ctx.lineTo(toX, toY);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.restore();
		ctx.arc(toX, toY, r, 0, Math.PI * 2);
		ctx.fill();
	}
	/**
	 * 选中某条线
	 */
	focusLine = (id,bool) => {
		this.switchToolBtn('cursor');
		// console.log(this.lineData);
		
		let toolHeight = this.state.height - this.headHeight - 1;
        let workWidth = this.state.width - this.toolWidth - 1;
		this.clearCanvas();
		this.initCanvas(workWidth,toolHeight);
		for (let key in this.lineData) {
			let lineData = this.lineData[key];
			let linePoit = lineData.data;
			if(id == key) {
				if(lineData.type == 'sl') {
					// this.drawArrow(linePoit[0],linePoit[1],'#fffc66');
					this.drawFocusLine(linePoit[0],linePoit[1],null,null,'#fffc66');
				}else {
					this.drawFocusLine(linePoit[0], linePoit[3], linePoit[1], linePoit[2], '#fffc66');
				}
			}else {
				this.addLine(key,lineData);
			}
		}
	}
	//取消所有节点的状态
	blurItem = () => {
		if(this.focusId != '') {
			// console.log(1);
			let jq = $('#'+this.focusId);
			if(jq.prop('tagName') == 'DIV') {
				if(this.onItemBlur!=null&&!this.onItemBlur(this.focusId,"node"))	return false;
				jq.removeClass("item_focus").children("div:eq(0)").css("display","none");
			}else {
				if(this.onItemBlur!=null&&!this.onItemBlur(this.focusId,"line"))	return false;
			}
		}
		this.focusId='';
		return true;
	}
	//右键点击事件，弹出选择连线类型
	handleMenuDir = (e) => {
		let type = this.getType(e);
		this.switchToolBtn(type);
		this.editLineType = true;
		this.setState({
			lineFlag:true,
			top:'139px'
		})
	}
	/**
	 * 擦除画布，并重绘画布
	 */
	clearAndInitCanvas = () => {
		let toolHeight = this.state.height - this.headHeight - 1;
	    let workWidth = this.state.width - this.toolWidth - 1;
		this.clearCanvas();
		this.initCanvas(workWidth,toolHeight);
	}
	/**
	 * 连线事件
	 */
	handledirect = (e) =>{
		let type = this.getType(e);
		this.switchToolBtn(type);
		this.editLineType = true;
		this.setState({
			lineFlag:false,
			line_open:false
		})
	}
	/**
	 * 设置为默认连线，直线
	 * @author fnd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleClicksl = () => {
		this.changeLineStyle('sl');		
	}
	/**
	 * 改变连线类型
	 */
	changeLineStyle = (style) => {
		this.clearAndInitCanvas();
		console.log(this.nowLineId);
		
		let nowLineId = this.nowLineId;
		for (let key in this.lineData) {
			let lineData = this.lineData[key];
			if(key == nowLineId) {
				this.lineData[key].type = style;
				this.addLine(nowLineId, lineData);
			}else {
				this.addLine(key,lineData);
			}
			
		}
	}
	/**
	 * 设置为上下连线
	 * @author fnd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleClicktb = () => {
		// let type = this.getType(e);
		// this.switchToolBtn(type);
		// this.editLineType = true;
		// this.setState({
		// 	lineFlag:false
		// })
		this.changeLineStyle('tb');
		
	}
	/**
	 * 设置为左右连线
	 * @author fnd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleClicklr = () => {
		this.changeLineStyle('lr');
	}
	handleLineDefault = (e) => {
		let type = this.getLineType(e);
		this.switchLineTypeBtn(type);
		// console.log(type);
		if(this.editLineType) {
			this.lineType = type;
			this.condition = null;
			console.log(this.lineType);
		}else {
			this.lineType = null
		}
		this.setState({
			lineFlag:false
		})
		
	}
	handleErr = (e) => {
		let type = this.getLineType(e);
		this.switchLineTypeBtn(type);
		if(this.editLineType) {
			// console.log(type);
			this.condition = 'step.state==2';
			this.lineType = type;
			console.log(this.lineType);
		}else {
			this.lineType = null
			// console.log('null');
		}
		this.setState({
			lineFlag:false
		})
	}
	handleSuc = (e) => {
		let type = this.getLineType(e);
		this.switchLineTypeBtn(type);
		// this.lineType = type;
		if(this.editLineType) {
			this.condition = 'step.state==1';
			this.lineType = type;
			console.log(this.lineType);
		}else {
			this.lineType = null
		}
		this.setState({
			lineFlag:false
		})
		// console.log(type);
	}
	//划线或者更改线时的绑定
	handleMoveWork = (e) => {
		// console.log('lianxian');
		// if(this.nowType!=''&&)
	}
	
	/**
	 * 对象查重
	 */
	// findSimpleInObj = (obj) => {
	// 	let arr = []
	// 		,res = [];
	// 	for (let k in obj) {
	// 		obj[k].key = k;
	// 		arr.push(obj[k]);
	// 	}
	// 	for (let i = 0, oLen = arr.length; i < oLen; i++) {
	// 		let res1 = arr[i];
	// 		for (let j = 0, rLen = res1.length; i < rLen; j++) {
	// 			let res2 = arr[j];
	// 			if( i != j && res1[i].from !== res2[j].from && res1[i].to !== res2[j].to) {
	// 				res.push(res1);
	// 			}
	// 		}
	// 	}
	// 	console.log(res);
	// }
	
	//增加一条线
	addLine = (id,json) => {
		if(this.onItemAdd!=null&&!this.onItemAdd(id,'line',json)) return;
		if(json.from == json.to) return;
		let n1 = this.nodeData[json.from], n2 = this.nodeData[json.to];
		if(!n1 || !n2) return;
		// if(!this.isEmptyObj(this.lineData)) {
		// //避免两个节点间不能有一条以上同向连接线
		// 	for(let k in this.lineData) {
		// 		if(json.from == this.lineData[k].from && json.to == this.lineData[k].to) return;
		// 	}
		// }
		
		// 设置linedata[id]
		this.lineData[id] = {};

		//选择线的类型
		if(json.condition) {
			this.lineData[id].condition = json.condition;
		}else {
			this.lineData[id].condition = null;
		}
		if(json.type) {
			this.lineData[id].type = json.type;
			this.lineData[id].M = json.M;
		}else {
			this.lineData[id].type = 'sl';//默认为上下
		}
		this.lineData[id].from = json.from;
		this.lineData[id].to = json.to;
		this.lineData[id].name = json.name;
		if(json.marked) this.lineData[id].marked = json.marked;
		else this.lineData[id].marked = false;
		//设置linedata完毕
		this.addLineDom(id,this.lineData[id]);
		++this.lineCount;
		// if(this.editable) {
		// 	this.lineData[id].alt = true;
		// }
	} 
	addLineDom = (id,lineData) => {
		let n1 = this.nodeData[lineData.from],n2 = this.nodeData[lineData.to];
		//测试节点的位置
		//
		//获取开始节点和结束节点的数据
		if(!n1 || !n2) return;
		//开始计算线端点的 坐标
		let res;
		if(lineData.type && lineData.type != 'sl') {
			res=this.calcPoints(n1,n2,lineData.type)
		}else {
			res = this.calcStartEnd(n1,n2);
		}
		if(!res) return;
		// console.log(lineData.condition);
		if(lineData.type == 'sl') {
			// this.lineData[id].data = [res.start,res.end];
			this.lineData[id].data = [{x: res.start[0], y: res.start[1]}, {x: res.end[0], y: res.end[1]}];
			if(lineData.condition == null) {
				this.drawArrow(res.start,res.end,'#000');
			}else if(lineData.condition == 'step.state==1') {
				this.drawArrow(res.start,res.end,'#0f0');
			}else if(lineData.condition == 'step.state==2') {
				this.drawArrow(res.start,res.end,'#f00');
			}
			// this.drawArrow(res.start,res.end);
		}else {
			// this.lineData[id].data = [res.start,res.end,res.m1,res.m2];
			this.lineData[id].data = [{x: res.start[0], y: res.start[1]}, {x: res.m1[0], y: res.m1[1]}, {x: res.m2[0], y: res.m2[1]}, {x: res.end[0], y: res.end[1]}];
			// this.drawArrowZ(res.start,res.end,res.m1,res.m2);
			if(lineData.condition == null) {
				this.drawArrowZ(res.start,res.end,res.m1,res.m2,'#000');
			}else if(lineData.condition == 'step.state==1') {
				this.drawArrowZ(res.start,res.end,res.m1,res.m2,'#0f0');
			}else if(lineData.condition == 'step.state==2') {
				this.drawArrowZ(res.start,res.end,res.m1,res.m2,'#f00');
			}
		}
		// console.log(this.lineData)
	}
	calcStartEnd = (n1,n2) => {
		var X_1,Y_1,X_2,Y_2;
		//X判断：
		var x11=n1.left,x12=n1.left+n1.width,x21=n2.left,x22=n2.left+n2.width;
		//结点2在结点1左边
		if(x11>=x22){
			X_1=x11;X_2=x22;
		}
		//结点2在结点1右边
		else if(x12<=x21){
			X_1=x12;X_2=x21;
		}
		//结点2在结点1水平部分重合
		else if(x11<=x21&&x12>=x21&&x12<=x22){
			X_1=(x12+x21)/2;X_2=X_1;
		}
		else if(x11>=x21&&x12<=x22){
			X_1=(x11+x12)/2;X_2=X_1;
		}
		else if(x21>=x11&&x22<=x12){
			X_1=(x21+x22)/2;X_2=X_1;
		}
		else if(x11<=x22&&x12>=x22){
			X_1=(x11+x22)/2;X_2=X_1;
		}
		
		//Y判断：
		var y11=n1.top,y12=n1.top+n1.height,y21=n2.top,y22=n2.top+n2.height;
		//结点2在结点1上边
		if(y11>=y22){
			Y_1=y11;Y_2=y22;
		}
		//结点2在结点1下边
		else if(y12<=y21){
			Y_1=y12;Y_2=y21;
		}
		//结点2在结点1垂直部分重合
		else if(y11<=y21&&y12>=y21&&y12<=y22){
			Y_1=(y12+y21)/2;Y_2=Y_1;
		}
		else if(y11>=y21&&y12<=y22){
			Y_1=(y11+y12)/2;Y_2=Y_1;
		}
		else if(y21>=y11&&y22<=y12){
			Y_1=(y21+y22)/2;Y_2=Y_1;
		}
		else if(y11<=y22&&y12>=y22){
			Y_1=(y11+y22)/2;Y_2=Y_1;
		}
		return {"start":[X_1,Y_1],"end":[X_2,Y_2]};
	}
	calcPoints = (n1,n2,type) => {
		//开始、结束两个节点的中心
		let SP = {x:n1.left + n1.width/2,y:n1.top+n1.height/2};
		let EP={x:n2.left+n2.width/2,y:n2.top+n2.height/2};
		var sp=[],m1=[],m2=[],ep=[];
		//粗略计算起始点
		sp=[SP.x,SP.y];
		ep=[EP.x,EP.y];
		if(type == 'lr') {
			let M;
			if(SP.x - EP.x > 0) {
				M = (SP.x - EP.x) / 2 +EP.x;
			}else {
				M = (EP.x - SP.x) / 2 + SP.x;
			}
			//粗略计算两个重点
			m1 = [M,SP.y];
			m2 = [M,EP.y];
			if(m1[0]>n1.left&&m1[0]<n1.left+n1.width){
				m1[1]=(SP.y>EP.y? n1.top:n1.top+n1.height);
				sp[0]=m1[0];sp[1]=m1[1];
			}
			else{
				sp[0]=(m1[0]<n1.left? n1.left:n1.left+n1.width)
			}
			//再具体分析中点2和结束点
			if(m2[0]>n2.left&&m2[0]<n2.left+n2.width){
				m2[1]=(SP.y>EP.y? n2.top+n2.height:n2.top);
				ep[0]=m2[0];ep[1]=m2[1];
			}
			else{
				ep[0]=(m2[0]<n2.left? n2.left:n2.left+n2.width)
			}
		}else if(type == 'tb') {
			let M;
			if(SP.y - EP.y > 0) {
				M = (SP.y - EP.y) / 2 + EP.y;

			}else {
				M = (EP.y - SP.y) / 2 + SP.y;
			}
			m1 = [SP.x,M];
			m2 = [EP.x,M];
			//再具体分析修改开始点和中点1
			if(m1[1]>n1.top&&m1[1]<n1.top+n1.height){
				m1[0]=(SP.x>EP.x? n1.left:n1.left+n1.width);
				sp[0]=m1[0];sp[1]=m1[1];
			}
			else{
				sp[1]=(m1[1]<n1.top? n1.top:n1.top+n1.height)
			}
			//再具体分析中点2和结束点
			if(m2[1]>n2.top&&m2[1]<n2.top+n2.height){
				m2[0]=(SP.x>EP.x? n2.left+n2.width:n2.left);
				ep[0]=m2[0];ep[1]=m2[1];
			}
			else{
				ep[1]=(m2[1]<n2.top? n2.top:n2.top+n2.height);
			}
		}
		return {start:sp,m1:m1,m2:m2,end:ep};

	}
	//删除转换线
	delLine = (id,trigger) => {
		if(!this.lineData[id])	return;
		if(false!=trigger && this.onItemDel!=null&&!this.onItemDel(id,"node"))	return;
		// this.$draw.removeChild(this.$lineDom[id]);
		delete this.lineData[id];
		// delete this.$lineDom[id];
		if(this.focusId==id)	this.focusId="";
		--this.lineCount;
		this.clearCanvas();
		this.initCanvas()
	}
	export = () => {
		// this.flowRet={title:this.state.title,nodes:this.nodeData,lines:this.lineData};
		// for(var k1 in this.flowRet.nodes){
		// 	if(!this.flowRet.nodes[k1].marked){
		// 		delete this.flowRet.nodes[k1]["marked"];
		// 	}
		// }
		// for(var k2 in this.flowRet.lines){
		// 	if(!this.flowRet.lines[k2].marked){
		// 		delete this.flowRet.lines[k2]["marked"];
		// 	}
		// }
		console.log(this.allFlowData);
		// return this.flowRet;
	}
	showOrHidden = (val) => {
		this.setState({
			config_modal:val,
		})
	}
	handleModifyTitle =(e) => {
		this.currentFlow = e.currentTarget.getAttribute('data');
		this.doubleClick = true;
		// this.editable = true;
		this.clickType = 'edit';
		for (let i = 0, data = this.state.flowData, len = data.length; i < len; i++) {
			if(data[i][0].flow_name == this.currentFlow) {
				this.editData = data[i][0];
			}
		}
		this.setState({
			titleInput:true,
			editData:this.editData,
			disableFlowId:true
		});
		
	}
	/**
	 * 点击流程头tab的事件
	 * @author fnd
	 * @return {[type]} [description]
	 */
	handleTitleBlur = () => {
		this.setState({
			titleInput:false
		})
	}
	/**
	 * 改变流程名称
	 * @author fnd
	 * @return {[type]} [description]
	 */
	handleTitleChange = () => {
		let value = this.refs.titleInput.value;
		this.setState({
			title:value
		})
	}
	/**
	 * flow_type数据保存
	 * @author fnd
	 * @param  {[type]} value 表单数据
	 * @param  {[type]} flag  [description]
	 * @return {[type]}       [description]
	 */
	handleData = (value,flag) => {
		let type = this.clickType;
		//如果创建成功，显示流程图的头
		if (flag) {
			this.editable = true;
			if (type == 'add') {
				this.flowTitleNum++;
				this.addTitle = value.flow_name;
				// this.flow_id = value.flow_id;
				value.flow_id = this.flow_id;

				let all = [value];
				this.state.flowData.push(all);
				this.setState({
					flowData:this.state.flowData,
				});
				// console.log(value);
				this.flowTypeData = this.delElement(value);
				// this.postFlowType(flowType);
				setTimeout(() => {
					this.switchCurrentFlow(value.flow_id);
					let id = this.currentFlowID = this.flow_id;
					let allData = this.allFlowData;
					let flowID = id.toString();
					allData[flowID] = {};
					allData[flowID].nodeData = this.nodeData;
					allData[flowID].lineData = this.lineData;
					this.max = 1;
				},0)
			}else if (type == 'edit') {
				// console.log(this.flowType);
				// this.isEqual;
				for (let i = 0, data = this.state.flowData, len = data.length; i < len; i++) {
					if(data[i][0].flow_name == this.currentFlow) {
						let all = [value];
						// console.log(this.cmpArr(data[i],all))
						if(this.cmpArr(data[i],all)) {
							this.isEqual = true
						}else {
							this.isEqual = false;
							data[i] = all;
							this.setState({
								flowData:data
							});
						}
						
						
					}
				}
				// console.log(value);
				if(this.isEqual) {
					return
				}else {
					console.log(111);
					this.flowType = this.delElement(value);
					// this.postFlowType(flowType,value.flow_id);
					// this.getSelectData();
					this.flow_id = value.flow_id;
				}
				
				// this.editable = true;
			}
		}else {
			this.editable = false;
		}
		// console.log(value)
		
	}
	//判断两个对象是否相等
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
	//判断两个数组是否相等
	cmpArr = (x,y) => {
		return this.cmp(x[0],y[0])
	}
	handleClose = (data) => {
		this.setState({
			titleInput:data,
		})
	}
	handleNotiClose = (key) => {
		let id = this.currentFlowID;
		delete this.allFlowData[id];
		for (let i = 0, data = this.state.flowData, len = data.length; i < len; i++) {
			if(data[i]) {
				if(data[i][0].flow_name == this.currentFlow) {
					data.splice(i,1);
					this.setState({
						flowData:data
					})
					// console.log(data);
				}
			}
			
		}
		if(!this.allFlowData.nodeData || !this.allFlowData.lineData) {
			for(let key in this.$nodeDom) {
				this.$nodeDom[key].remove()
				delete this.$nodeDom[key];
			}
			let toolHeight = this.state.height - this.headHeight - 1;
		    let workWidth = this.state.width - this.toolWidth - 1;
			this.clearCanvas();
			this.initCanvas(workWidth,toolHeight);
		}
		// if(this.state.flowData.length > 0) {
		// 	this.switchCurrentFlow(this.state.flowData[])
		// }
		notification.close(key);
	}
	openNotification = () => {
	  this.notificationFlag = true;
	  const key = `open${Date.now()}`;
	  const btn = (
	    <Button type="primary" size="small" onClick={() => this.handleNotiClose(key)}>
	      确定
	    </Button>
	  );
	notification.open({
	    message: '警告',
	    description: '该流程暂未保存，是否确认关闭？',
	    btn,
	    key,
	    duration: 5,
	    onClose: this.close,
	  });
	};
	close = () => {
		// console.log('close');
		this.notificationFlag = false;
	}
	//删除整个流程图，首先是先将所有的数据清空，然后重新绘制canvas
	handleFlowDel = (e) => {
		// console.log(e);
		if(!e) e = window.event;
		this.stop(e);
		let tar = e.target;
		// console.log(tar);
		switch(tar.tagName) {
			case 'SPAN':return;
			case 'DIV': return;
		}
		let currentFlow = this.currentFlow =  tar.previousSibling.getAttribute('data');
		let id = this.currentFlowID = tar.previousSibling.getAttribute('id');
		let nextId;
		// if(!this.allFlowData[this.currentFlowID].isSave) {
		// 	  this.openNotification();
		// 	  return
		// }
		if(!this.notificationFlag) {
			this.openNotification();
			return
		}
		// if(tar.parentNode.nextSibling.length && tar.parentNode.nextSibling.length > 0) {
		// 	nextId = tar.parentNode.nextSibling.firstChild.getAttribute('id');
		// }else if(tar.parentNode.previousSibling) {
		// 	nextId = tar.parentNode.previousSibling.firstChild.getAttribute('id');
		// }
		// let flowID = id.toString();
		// // allData[flowID] = {};
		// delete this.allFlowData[id];
		// for (let i = 0, data = this.state.flowData, len = data.length; i < len; i++) {
		// 	if(data[i]) {
		// 		if(data[i][0].flow_name == currentFlow) {
		// 			data.splice(i,1);
		// 			this.setState({
		// 				flowData:data
		// 			})
		// 			// console.log(data);
		// 		}
		// 	}
			
		// }
		// // console.log(this.allFlowData.nodeData);
		// if(!this.allFlowData.nodeData || !this.allFlowData.lineData) {
		// 	for(let key in this.$nodeDom) {
		// 		this.$nodeDom[key].remove()
		// 		delete this.$nodeDom[key];
		// 	}
		// 	let toolHeight = this.state.height - this.headHeight - 1;
		//     let workWidth = this.state.width - this.toolWidth - 1;
		// 	this.clearCanvas();
		// 	this.initCanvas(workWidth,toolHeight);
		// }
		// // console.log('当没有流程的时候',nextId)
		// if(nextId) {
		// 	this.switchCurrentFlow(nextId);
		// }
	}
	saveData = () => {
		console.log('save');
	}
	//新建流程图的点击事件
	handleNewFlow = (e) => {
		this.setState({
			titleInput: true,
			editData:{},
			disableFlowId:false,
			editFlow:false,
			line_open:false
		});
		this.flow_id++;
		let type = this.getType(e);
		// console.log(type)
		this.switchToolBtn(type);
		this.clickType = 'add';
		this.doubleClick = false;
		this.nodeData = {};
		this.lineData = {};
		this.getSelectData();
	}
	//切换流程图
	switchCurrentFlow = (id) => {
		$('#' + this.currentFlowID).attr('class','flow_head_title');
		for(let key in this.$nodeDom) {
			this.$nodeDom[key].remove()
			delete this.$nodeDom[key];
		}
		if(this.currentFlowID && this.allFlowData[this.currentFlowID]) {
			this.allFlowData[this.currentFlowID].max = this.max;
		}
		
		// if(this.currentFlowID && this.allFlowData[this.currentFlowID]) {
		// 		this.allFlowData[this.currentFlowID].max = this.max;
		// 	}else if(this.allFlowData[id]) {
		// 		this.allFlowData[id].max = this.max;
		// 	}
		this.currentFlowID = id;
		let toolHeight = this.state.height - this.headHeight - 1;
	    let workWidth = this.state.width - this.toolWidth - 1;
		this.clearCanvas();
		this.initCanvas(workWidth,toolHeight);
		$('#' + id).attr('class','flow_head_title_btndown');
		if(this.allFlowData[id]) {
			this.nodeData = {};
			this.lineData = {};
			this.loadData(this.allFlowData[id]);
		}
		setTimeout(() => {
			if(this.allFlowData[id]) {
				this.flow_id = id;
				this.nodeData = this.allFlowData[id].nodeData;
				this.lineData = this.allFlowData[id].lineData;
				if(this.allFlowData[id].max) {
					this.max = this.allFlowData[id].max;
					console.log(this.max)
				}else {
					this.max = this.countProperties(this.nodeData);
				}
				
				
			}
		},0);
		
		// this.allFlowData[id] = this.nodeData

	}
	//计算对象的长度
	countProperties = (obj) => {
	　　var count = 0;
	    for(var key in obj){
	        if(obj.hasOwnProperty(key)){
	            count++;
	        }
	    }
	    return count + 1;
	}
	//点击流程图事件
	handleHeadTitle = (e) => {
		let currentID = e.currentTarget.getAttribute('id');
		this.switchCurrentFlow(currentID);
	}
	loadData = (data) => {
		this.nodeData = {};
		this.lineData = {};
		for (let i in data.nodeData) {
			let newObject = Object.assign({},data.nodeData[i],{})
			this.addNode(i,newObject);
			// this.nodeData = data.nodeData[i];
		}
		for (let j in data.lineData) {
			let newObject = Object.assign({},data.lineData[j],{})
			this.addLine(j, newObject);
		}

	}
	//点击浏览所有流程
	handleOpenFlow = (e) => {
		this.setState({
			modalVisible:true,
			line_open:false
		});
		let type = this.getType(e);
		this.switchToolBtn(type);
		// this.getSelectData();
	}
	//弹出框所有流程的确定事件
	handleOk = () => {
		this.state.flowData.push(this.flowType)
		this.setState({
			modalVisible:false,
			autoValue:'',
			flowData:this.state.flowData,
			editFlow:true,
		})
		this.editable = true;
		let data = {};
		let max;
		//处理node数据
		let nodeData = {};
		for (let i = 0,nLen = this.flowNode.length; i < nLen; i++) {
			let key = this.flowNode[i].node_id;
			nodeData[key] = {};
			nodeData[key].name = this.flowNode[i].node_name;
			let point = JSON.parse(this.flowNode[i].point);
			if(!!point) {
				nodeData[key].width = point.width;
				nodeData[key].height = point.height;
				nodeData[key].left = point.left;
				nodeData[key].top = point.top;
				// this.max = point.max;
				max = point.max;
			}else {
				nodeData[key].width = 104;
				nodeData[key].height = 26;
				nodeData[key].left = 0;
				nodeData[key].top = 0;
			}
			
		}
		//处理line数据
		let lineData = {};
		let date = new Date().getTime();
		// console.log(this.flowRoute);
		for (let j = 0, lLen = this.flowRoute.length; j < lLen; j++) {
			// let key = this.flowRoute[i].line_type.line_id;
			let line_type = JSON.parse(this.flowRoute[j].line_type);
			if(line_type) {
				let key = line_type.line_id;
				lineData[key] = {};
				lineData[key].condition = this.flowRoute[j].condition;
				lineData[key].from = this.flowRoute[j].from_id;
				lineData[key].to = this.flowRoute[j].to_id;
				lineData[key].type = line_type.type;
			}else {
				// let date = new Date().getTime();
				let key = date++;
				lineData[key] = {};
				lineData[key].condition = this.flowRoute[j].condition;
				lineData[key].from = this.flowRoute[j].from_id;
				lineData[key].to = this.flowRoute[j].to_id;
				// lineData[key].type = line_type.type;
			}
		}
		data.lineData = lineData;
		data.nodeData = nodeData;
		data.max = max;
		let toolHeight = this.state.height - this.headHeight - 1;
	    let workWidth = this.state.width - this.toolWidth - 1;
		let flowId = this.flowType[0].flow_id;
		this.allFlowData[flowId] = data;

		this.flow_id = flowId;
		this.clearCanvas();
		// console.log(this.allFlowData)
		this.initCanvas(workWidth,toolHeight);
		this.loadData(this.allFlowData[flowId]);
		setTimeout(() => {
			this.switchCurrentFlow(flowId);
		},0)
		
		// console.log(this.allFlowData)
		
	}
	//弹出框所有流程的取消事件
	handleCancel = () => {
		this.setState({
			modalVisible:false,
			autoValue:''
		})
	}
	//选中的option
	handleAutoSelect = (value) => {
		// this.dataId = value;
		this.getDataFromId(value);
	}
	// 获取datasource的真实值
	getSelectData = () => {
		T.ajax({
	      f: 'json',
	      key: 'selectData',
	      data: {},
	      method: 'GET',
	      success: (result) => {
	        this.dataSource = result.data.data;
	        // console.log(this.dataSource)
	        this.d = [];
	        this.dataSource.map(item => {
	        	this.d.push(item.flow_id);
	        });
	        // console.log(this.d);
			this.setState();
			}	
	      })
	}
	//根据ID获取某个flow
	getDataFromId = (id) => {
		T.ajax({
	      f: 'json',
	      key: 'allFlowData',
	      data: {flow_id: id},
	      method: 'GET',
	      success: result => {
	        this.flowType = result.data.flow_type;
	        this.flowNode = result.data.flow_node;
	        console.log(this.flowNode);
	        this.flowRoute = result.data.flow_route;

	        // this.setState({
	        // 	flowNode:this.flowNode
	        // })
	        this.setState();
			}
	      })
	}
	
	//遍历render option
	renderOption = (item) => {
		if(!item) return false  
		return <Option key = {item.flow_id}>{ item.flow_name }{item.sys_name ? `[${item.sys_name}]` : '[无所属的项目系统]'}</Option>	
	}

	//遍历对象，过滤掉没有值的字段
	delElement = (obj) => {
		let params = {};
		if ( obj === null || obj === undefined || obj === '' || obj === [] ) return params;
		for ( var key in obj ) {
			if ( obj[key] !== null && obj[key] !==undefined && obj[key] !== '' && obj[key].length !== 0) {
				params[key] = obj[key];
			}
		}
		return params
	}
	//添加/修改新的flowtype
	postFlowType = (data,id) => {
		let params = {
			type: data
		};
		if (!!id) {
			params.flow_id = id;
		}
		T.ajax({
			f: 'json',
			key: 'flowType',
			data: params,
			method: 'POST',
			success: result => {
				console.log(result);
				if(this.state.editFlow) {
					if(result.data) {
						if(result.data.flow_id) {
							let nodes = this.resultNodes
								,routes = this.resultRoutes;
							let n = this.dataProcess(nodes, result.data.flow_id, 'node');
							let l = this.dataProcess(routes,result.data.flow_id, 'route');
							this.postFlowNode(n);
							this.postFlowRoute(l);
						}
					}else {
						message.error('保存失败')
					}
				}
				
			} 
		})
	}
	/**
	 * 提交node和route的数据到数据库
	 */
	postNR = (n,r) => {
		this.postFlowNode(n);
		this.postFlowRoute(r);
		setTimeout({

		})
	}
	//添加/修改 流程节点
	postFlowNode = (data, id) => {
		let params = {
			nodes: data
		};
		if (!!id) {
			params.flow_id = id;
		}
		T.ajax({
			f: 'json',
			key: 'flowNode',
			data: params,
			method: 'POST',
			success: result => {
				console.log(result);
				this.eventNode = result.data;
				// if(result.data.data) {
				// 	message.success("已保存")
				// }else {
				// 	message.error('保存失败')
				// }

			}
		})
	}
	//修改/添加 流程步骤
	postFlowRoute = (data, id) => {
		let params = {
			routes: data
		};
		if (!!id) {
			params.flow_id = id;
		}
		T.ajax({
			f: 'json',
			key: 'flowRoute',
			data: params,
			method: 'POST',
			success: result => {
				console.log(result);
				this.eventRoute = result.data;
			}
		})
	}
	//保存当前流程
	handleSaveFlow = (e) => {
		//处理数据nodedata
		this.setState({
			line_open:false
		})
		this.allFlowData[this.currentFlowID].isSave = true;
		let type = this.getType(e);
		this.switchToolBtn(type);
		if(this.state.editFlow) {
			let nodes = [];
			for (let key in this.nodeData) {
				let n = {};
				// debugger
				n.node_id = key;
				n.point = {
					width:this.nodeData[key].width,
					height:this.nodeData[key].height,
					left:this.nodeData[key].left,
					top:this.nodeData[key].top,
					max:this.max
				};
				if (this.nodeData[key].nodeInfo) {
					for (let k in this.nodeData[key].nodeInfo) {
						n[k] = this.nodeData[key].nodeInfo[k]
					}
				}else {
					n.node_name = this.nodeData[key].name
				}
				nodes.push(n);
			}
			for ( let j  = 0, nLen = nodes.length; j < nLen; j++) {
				nodes[j] = this.delElement(nodes[j]);
				nodes[j].flow_id = this.flow_id;
			}
			//处理linedata的数据
			let routes = [];
			for (let key in this.lineData) {
				let n = {};
				n.from_id = this.lineData[key].from;
				n.to_id = this.lineData[key].to;
				n.line_type = {
					line_id:key,
					type:this.lineData[key].type
				};
				if(this.lineData[key].condition) {
					n.condition = this.lineData[key].condition;
				}
				routes.push(n)
			}
			let _type = this.clickType;
			if(nodes.length > 0 && routes.length > 0) {
				/*if(!_type) {
					let flowType =  this.delElement(this.flowType[0]);
					console.log('noclick', flowType);
				}else if(_type == 'edit'){
					if(!this.isEqual) {
						// break
						console.log('edit',this.flowType);
					}
				}*/
				if(!!_type && _type == 'edit') {
					if(!this.isEqual) {
						console.log('edit', this.flowType);
					}
				}
				let n = this.dataProcess(nodes, this.flow_id, 'node');
				let r = this.dataProcess(routes, this.flow_id, 'route');
				console.log(n,r);
			
			}else {
				message.warning('该流程暂未创建');
			}

			// this.postFlowRoute(routes,this.flow_id);
		}else {
			let nodes = [];
			for (let key in this.nodeData) {
				let n = {};
				// debugger
				n.node_id = key;
				n.point = {
					width:this.nodeData[key].width,
					height:this.nodeData[key].height,
					left:this.nodeData[key].left,
					top:this.nodeData[key].top,
					max:this.max
				};
				if (this.nodeData[key].nodeInfo) {
					for (let k in this.nodeData[key].nodeInfo) {
						n[k] = this.nodeData[key].nodeInfo[k]
					}
				}else {
					n.node_name = this.nodeData[key].name
				}
				nodes.push(n);
			}
			// console.log(nodes);
			for ( let j  = 0, nLen = nodes.length; j < nLen; j++) {
				nodes[j] = this.delElement(nodes[j]);
				// nodes[j].flow_id = this.flow_id;
			}
			// console.log(nodes);
			// 测试数据
			// let j = this.dataProcess(nodes, 12, 'node');
			// console.log(j);
			this.resultNodes = nodes;
			
			//处理linedata的数据
			let routes = [];
			for (let key in this.lineData) {
				let n = {};
				n.from_id = this.lineData[key].from;
				n.to_id = this.lineData[key].to;
				n.line_type = {
					line_id:key,
					type:this.lineData[key].type
				};
				if(this.lineData[key].condition) {
					n.condition = this.lineData[key].condition;
				}
				routes.push(n)
			}
			this.resultRoutes = routes;
			let flowTypeData = this.flowTypeData;
			let f_t_d = this.flowTypeDataProcess(flowTypeData);
			console.log(f_t_d);
			if(nodes.length > 0 && routes.length > 0) {
				// this.postFlowType()
				this.postFlowType(f_t_d);
				// setTimeout(() => {
				// 	if(this.result.flow_id) {
				// 		let n = this.dataProcess(nodes, this.result.flow_id, 'node');
				// 		let l = this.dataProcess(routes, this.result.flow_id, 'route');
				// 		console.log(n);
				// 		console.log(l);
				// 	}else {
				// 		message.warning('流程创建失败')
				// 	}
				// },0);
				
				// this.postFlowNode(nodes);
				// this.postFlowRoute(routes);
				// this.getSelectData()
			}else {
				message.warning('该流程暂未创建');
			}
			
			
			// console.log(this.max);
		}
	}
	/**
	 * 处理flow_type的数据
	 */
	flowTypeDataProcess = (data) => {
		for (let key in data) {
			if(key == 'flow_id') {
				delete data[key]
			}
		}
		return data
	}
	/**
	 * 处理提交数据库的数据
	 */
	dataProcess = (data, flow_id, type) => {
		if(type == 'node') {
			for (let i = 0, nLen = data.length; i < nLen; i++) {
				// console.log(data[i].node_id.replace(/^[\d|\w]*\+(.*)$/, `${flow_id}$1`))
				data[i].node_id = data[i].node_id.replace(/^[\d|\w]*_(.*)$/, `${flow_id}$1`);
				data[i].flow_id = flow_id;
 				// console.log(data[i].node_id)
			}
			return data
		}else {
			for (let j = 0, lLen = data.length; j < lLen; j++) {
				data[j].from_id = data[j].from_id.replace(/^[\d|\w]*_(.*)$/, `${flow_id}$1`);
				data[j].to_id = data[j].to_id.replace(/^[\d|\w]*_(.*)$/, `${flow_id}$1`);
			}
			return data
		}
		return data
 	}
	/**
	 * 鼠标滑过canvas的事件
	 * @author fnd
	 * @param {[type]} e 事件
	 * @return {[type]} [description]
	 */
	canvasMove = (e) => {
		//获取鼠标滑过的坐标（相对文档的）
		let x,y;
		let workArea = $('.flow_work');
		// console.log(workArea[0]);
		let ev = this.mousePosition(e), t=this.getElCoordinate(workArea[0]);
		x = ev.x - t.left;
		y = ev.y - t.top;
		// console.log(x,y)
		let point = {x: x, y: y};
		let linePointData = [];
		for (let key in this.lineData) {
			if(this.lineData[key].data) {
				linePointData.push(this.lineData[key].data) 
			}
		}
		// console.log(linePointData);
		for (let i = 0, l_p_dLen = linePointData.length; i < l_p_dLen; i++) {
			// console.log(point)
			let d = this.d = this.hitLine(point, linePointData[i], 5);
			// console.log(d);
			if (d) {
				$('body').css('cursor', 'pointer');
				for (let k in this.lineData) {
					let a = this.lineData[k].data;
					let b = linePointData[i];
					// console.log(a,b)
					if (this.arrayIsEqual(a,b)) {
						this.nowLineId = k;
						// console.log(this.nowLineId);
						break
					}
				}
				return
			}else {
				$('body').css('cursor', 'default')
			}
		}

		
		

		// console.log(p);
	}
	/**
	 * 判断两个对象是否相等
	 * @author fnd
	 * @param  {[type]}  a [description]
	 * @param  {[type]}  b [description]
	 * @return {Boolean}   [description]
	 */
	isObjectValueEqual(a, b) {
    // Of course, we can do it use for in 
    // Create arrays of property names
	    var aProps = Object.getOwnPropertyNames(a);
	    var bProps = Object.getOwnPropertyNames(b);
	 
	    // If number of properties is different,
	    // objects are not equivalent
	    if (aProps.length != bProps.length) {
	        return false;
	    }
	 
	    for (var i = 0; i < aProps.length; i++) {
	        var propName = aProps[i];
	 
	        // If values of same property are not equal,
	        // objects are not equivalent
	        if (a[propName] !== b[propName]) {
	            return false;
	        }
	    }
	 
	    // If we made it this far, objects
	    // are considered equivalent
	    return true;
	}

	/**
	 * 判断两个数组是否相等
	 * @author fnd
	 * @param  {[type]} arr1 [description]
	 * @param  {[type]} arr2 [description]
	 * @return {[type]}      [description]
	 */
	arrayIsEqual = (arr1,arr2) => {
		//判断是否都是数组
		if(!this.isArray(arr1) && !this.isArray(arr2)) {
			return false
		}
		//判断数组的长度是否相等
		if(arr1.length != arr2.length) {
			return false;
		}
		for (let i = 0, l = arr1.length; i < l; i++) {
			if(arr1[i] instanceof Array && arr2[i] instanceof Array) {
				if(!arr1[i].equals(arr2[i])) {
					return false
				}
			}else if(arr1[i] != arr2[i]) {
				return false
			}else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
				if(!this.isObjectValueEqual(arr1[i],arr2[i])) {
					return false
				}
			}
		}
		return true
	}

	/**
	 * 判断点是否在canvas的线上
	 * @author fnd
	 * @return {[type]} [description]
	 */
	hitLine = ( lp, _l_ll, _l_d, loop, returnI ) => {

	    let hit = false,index = -1;

	    if (_l_ll.length < 2) return hit;

	    if (!!loop) _l_ll.push(_l_ll[0]);

	    for (let i = 0, _l_len = _l_ll.length - 1; i < _l_len; i++ ) {

	        let _l_a = _l_ll[i],
	            _l_b = _l_ll[i + 1];

	        if (lp.x < Math.max(_l_a.x,_l_b.x) + _l_d && lp.x > Math.min(_l_a.x,_l_b.x) - _l_d && lp.y < Math.max(_l_a.y,_l_b.y) + _l_d && lp.y > Math.min(_l_a.y,_l_b.y) - _l_d) {

	            if (_l_a.x == _l_b.x) {
	                if (Math.abs(lp.x - _l_a.x) <= _l_d) {
	                    hit = true;
	                    index = i + 1;
	                    break;
	                }
	            } else if (_l_a.y == _l_b.y) {
	                if (Math.abs(lp.y - _l_a.y) <= _l_d) {
	                    hit = true;
	                    index = i + 1;
	                    break;
	                }
	            } else {
	                let _la = _l_b.y - _l_a.y,
	                    _lb = _l_a.x - _l_b.x,
	                    _lc = _l_a.y * _l_b.x - _l_a.x * _l_b.y,
	                    _l_calc_d = Math.abs((_la * lp.x + _lb * lp.y + _lc) / Math.sqrt(Math.pow(_la,2) + Math.pow(_lb,2)));
	                    
	                if (_l_calc_d <= _l_d) {
	                    hit = true;
	                    index = i + 1;
	                    break;
	                }
	            }

	        }
	    }
	    
	    if (!!returnI) return { hit: hit, index:index };
	    return hit

	}
	/**
	 * 判断对象是否为空
	 * @author fnd
	 * @param  {[type]} o [description]
	 * @return {[type]}   [description]
	 */
	isEmptyObj = (o) => {
        if(o) {
            return Object.keys(o).length == 0
		}   
    }
	/**
	 * canvas 的点击事件，用来绑定删除线
	 * @author fnd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	canvasClick = (e) => {
		if(this.d) {
			//设置流程是否显示是否显示
			let x,y;
			let workArea = $('.flow_work');
			// console.log(workArea[0]);
			let ev = this.mousePosition(e), t=this.getElCoordinate(workArea[0]);
			x = ev.x - t.left;
			y = ev.y - t.top;
			this.line_open_l = x;
			this.line_open_t = y;
			// this.focusItem(this.nowLineId,false);
			if(!this.isEmptyObj(this.lineData)) {
				this.focusLine(this.nowLineId,false)
				this.setState({
					line_open:true
				})
			}
			
		}else {
			// console.log(2)
			this.setState({
				line_open:false
			});
			this.resetLines();
		}
	}
	/**
	 * 删除当前的点击的line线
	 * @author fnd
	 * @return {[type]} [description]
	 */
	handleClickDelLine = () => {
		console.log(this.nowLineId)
		this.delLine(this.nowLineId, false);
		this.resetLines();
		this.setState({
			line_open:false
		})
	}
 	render() {
        let toolHeight = this.state.height - this.headHeight;
        let workWidth = this.state.width - this.toolWidth;
        let top;
        if(this.nowType) {
        	if(this.nowType == 'sl' || this.nowType == 'tb' || this.nowType == 'lr') {
        		if(this.nowType == 'sl') top = '139px';
        		if(this.nowType == 'tb') top = '174px';
        		if(this.nowType == 'lr') top = '207px';
        	}
        }
		return (
			<div style = {{width:this.state.width +'px',height:this.state.height + 'px', margin:'10px'}} id='demo' className='demo'>
				<div className='flow_head'>
					{this.state.flowData.map((item) => {
						return (
							<div className = 'flow_head_div'><span id = {item[0].flow_id} key = {item[0].flow_name} data = {item[0].flow_name} className = 'flow_head_title' onClick = {this.handleHeadTitle} onDoubleClick = {this.handleModifyTitle}>{item[0].flow_name}</span><i className = 'btnTitleColse' onClick = {(e) => this.handleFlowDel()}>×</i></div>
						)
					})}
					
					
					{this.state.titleInput ? <WrapperFlowForm disableFlowId = {this.state.disableFlowId} idData = {this.d} handleClose = {this.handleClose} handleData = {this.handleData} value = {this.state.editData}></WrapperFlowForm>: ''}
				</div>
				<div className='flow_tool'>
					<div style={{height: toolHeight+ 'px'}} className='flow_tool_div'>
						<a href="javascript:void(0);" type='newFile' className='flow_tool_btn' id='demo_btn_newFile' title='新建' onClick={() => this.handleNewFlow()}>
							<i className = 'newIcon'></i>
						</a>
						<a href="javascript:void(0);" type='openFile' className='flow_tool_btn' id='demo_btn_openFile' title='浏览' onClick={() => this.handleOpenFlow()}>
							<i className = 'openIcon'></i>
						</a>
						<a href="javascript:void(0);" type='saveFile' className='flow_tool_btn' id='demo_btn_saveFile' title='保存' onClick={() => this.handleSaveFlow()}>
							<i className = 'saveIcon'></i>
						</a>
						<a href="javascript:void(0);" type='cursor' className='flow_tool_btn' id='demo_btn_cursor' title='选择指针' onClick={() => this.handleClickMove()}>
							<i className = 'icon_cursor'></i>
						</a>
						<a href="javascript:void(0);" type='direct' ref = 'direct' className='flow_tool_btn' title='直线连线' id = 'demo_btn_direct' onClick={(e) => this.handledirect()} onContextMenu = {(e) => this.handleMenuDir()}>
							<i className = 'icon_sl'></i>
							<i className = 'more'></i>
						</a>
						{/*<a href="javascript:void(0);" type='tb' ref = 'tb' className='flow_tool_btn' title='上下连线' id = 'demo_btn_tb' onClick={(e) => this.handleClicktb()} onContextMenu = {(e) => this.handleMenutb()}>
							<i className = 'icon_tb'></i>
							<i className = 'more'></i>
						</a>
						<a href="javascript:void(0);" type='lr' ref = 'lr' className='flow_tool_btn' title='左右连线' id = 'demo_btn_lr' onClick={(e) => this.handleClicklr()} onContextMenu = {(e) => this.handleMenulr()}>
							<i className = 'icon_lr'></i>
							<i className = 'more'></i>
						</a>*/}
						<a href="javascript:void(0);" type='task' className='flow_tool_btn' id='demo_btn_task' title='任务节点' onClick = {() => this.handleClickNewNode()}>
							<i className = 'icon_node'></i>
						</a>
						{this.state.lineFlag ? (<div className = 'lineStyleDiv' style = {{top:this.state.top ? this.state.top: top}}><a href="javascript:void(0);" className = 'flow_line_style' type = 'default' id = 'line_btn_default' title = '默认' onClick = {() => this.handleLineDefault()}>
							<i className = 'line_default'></i><span>默认连线</span>
						</a>
						<a href="javascript:void(0);" className = 'flow_line_style' type = 'err' id = 'line_btn_err' title = '不同意' onClick = {() => this.handleErr()}>
							<i className = 'line_err'></i><span>不同意连线</span>
						</a>
						<a href="javascript:void(0);" className = 'flow_line_style' type = 'suc' id = 'line_btn_suc' title = '同意' onClick = {() => this.handleSuc()}>
							<i className = 'line_suc'></i><span>同意连线</span>
						</a></div>): ''}
					</div>
					
				</div>
				<Modal
		          title="浏览所有流程"
		          visible={this.state.modalVisible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        >
		          <AutoComplete
			          className="global-search"
			          size="large"
					  allowClear = 'true'
			          style={{ width: '100%' }}
			          dataSource={this.dataSource.map(v => this.renderOption(v))}
			          placeholder="input here"
			          onSelect = {this.handleAutoSelect}
			          filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1}
			        >
			        </AutoComplete>
		        </Modal>
				<div className='flow_work' style={{width:workWidth - 1,height:toolHeight - 1}} onClick = {() => this.handleWorkArea()} onMouseMove = {() => this.handleMoveWork()}>
					{this.state.line_open ? <div className = 'line_open' style = {{left:this.line_open_l, top:this.line_open_t}}>
						<i className = 'icon_sl' onClick={(e) => this.handleClicksl()}></i>
						<i className = 'icon_tb' onClick={(e) => this.handleClicktb()}></i>
						<i className = 'icon_lr' onClick={(e) => this.handleClicklr()}></i>
						<i className = 'icon_close' onClick = {() => this.handleClickDelLine()}>×</i>
					</div> : ''}
					<canvas className = 'canvas' id = 'canvas_arrow' ref = 'canvas_arrow' width={workWidth - 1} height={toolHeight - 1} onMouseMove = {() => this.canvasMove()} onClick = {() => this.canvasClick()}>
						<p>您当前的浏览器不支持canvas，请更换其他浏览器！</p>
					</canvas>
				</div>
				
				<button onClick = {() => this.export()}>点击导出</button>
				<button onClick = {() => this.saveData()}>保存</button>
				{this.state.config_modal ? <ConfigModal i = {this._i} data = {this.state.flowNode} showOrHidden = {this.showOrHidden} nodeName = {this.state.nodeName} modifyText = {this.handleModify} handleSaveData = {this.handleSaveData}></ConfigModal>: ''}
			</div>		
		)
	}
}
export default Canvas_fnd