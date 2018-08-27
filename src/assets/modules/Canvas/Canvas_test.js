import React from 'react';
import './css/Canvas.less';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		// this.initCanvas = this.initCanvas.bind(this);
		this.state = {
			node:[],
			title:''
			
		}
	}
	completed = '#ff00ff';
	undone = '#00ffff';
	normal = '#cecece';
	initCanvas(x0,y0,x1,y1,negative) {
		
		let ele = document.getElementById('graph_canvas');
		let arrow = ele.getContext('2d');
		let strokeColor;
		if(!!negative) {
			strokeColor = '#ff0000';
			console.log(1);
		}else {
			strokeColor = '#000000';
			console.log(2);
		}
		arrow.beginPath();
		arrow.moveTo(x0,y0);
		arrow.lineTo(x1,y1);
		arrow.strokeStyle = strokeColor;
		arrow.stroke();
	}
	// flowTop = (n) => {
	// 	if(n = -1) {
	// 		return 0
	// 	}else 
	// }

	componentWillMount() {
		// this.initCanvas()
		T.ajax({
			f:'json',
			key:'json',
			data:{},
			method:'GET',
			success:(result) => {
				// console.log(result);
				// console.log(result.data);
				let data = result.data;
	
				let arr = new Array;
				this.setState({
					title:result.data.flow_name
				});
				for(let i = 0; i < data.nodes.length; i++) {
					arr.push(data.nodes[i].step);
				}
				// console.log(arr);
				let temp = new Array;
				let stepResult = new Array;
				temp.push(arr[0]);
				for(var i = 1; i < arr.length; i++) {
					var flag = 0;
					for(var j = 0; j < temp.length; j++) {
						if(arr[i] == temp[j]) {
							flag = 1;
							break;
						}
					}
					if(flag == 0) {
						temp.push(arr[i]);
					}
				}
				for(var m = 0; m < temp.length; m++) {
					var arr_1 = new Array;
					var count = 0;
					for(var n = 0; n < arr.length; n++) {
						if(arr[n] == temp[m]) {
							// arr_1.push(arr[n]);
							arr_1.push(data.nodes[n])
							count++;
						}
					}
					if(count > 1) {
						stepResult.push(arr_1);
					}else {
						// stepResult.push(temp[m]);
						let headNode = new Array;
						headNode.push(data.nodes[m]);
						stepResult.push(headNode);
					}
				}
				console.log(stepResult);
				for(var b = 0; b < stepResult.length; b++) {
					for(var c = 0,stepL = stepResult[b].length; c < stepL; c++) {
						var stepInd = stepResult[b][c].step;
						// console.log(stepInd);
						let headTop = 60,headBottom = 100;
						if(stepInd == 0) {
							// stepResult[b][c].topX = 500;
							stepResult[b][c].topY = headTop;
							// stepResult[b][c].bottomX = 500;
							stepResult[b][c].bottomY = headBottom;
						}else {
							stepResult[b][c].topY = 60 + headTop * stepInd;
							stepResult[b][c].bottomY = headBottom + headTop * stepInd;
						}
						if(stepL == 1) {
							// console.log(stepResult[b][c]);
							stepResult[b][c].marginLeft = -60;
							stepResult[b][c].topX = 500;
							stepResult[b][c].bottomX = 500;
							// stepResult[b][c].topx = 
						}else if(stepL % 2 == 0) {
							
							
							let middle = stepL/2-1;
						
							let p = middle,_stepMar = -140,_i=0 ;
							let _stepTopX = 500 - 20 - 60;

							do {
								_stepMar = _stepMar - 160 * _i;
								_stepTopX = _stepTopX - 160 * _i;
								stepResult[b][p].marginLeft = _stepMar;
								stepResult[b][p].topX = _stepTopX;
								stepResult[b][p].bottomX = _stepTopX;
								_i++;
								p--;
							}while(p > -1)
							let q = middle+1,_stepMarR = 20,_j = 0;
							let _stepTopXR = 500 + 20 + 60;
							do{
								_stepMarR = _stepMarR + 160 * _j;
								_stepTopXR = _stepTopXR + 160 * _j;
								stepResult[b][q].marginLeft = _stepMarR;
								stepResult[b][q].topX = _stepTopXR;
								stepResult[b][q].bottomX = _stepTopXR;
								_j++;
								q++;
							}while (q < stepL)
						
						}else if(stepL % 2 == 1 && stepL != 1) {
							let middle = parseInt(stepL / 2);
							let _p = middle, _q = middle, _stepMar = -60, _stepMarR = 40, _i = 0,_j = 0;
							let _stepTopX = 500;
							console.log(stepResult[b][_p]);
							// console.log(middle);
							// console.log(_p);
							do{
								console.log(1);
								_stepMar = _stepMar - 160 * _i;
								_stepTopX = _stepTopX - 160 * _i;
								stepResult[b][_p].marginLeft = _stepMar;
								stepResult[b][_p].topX = _stepTopX;
								stepResult[b][_p].bottomX = _stepTopX;
								_i++;
								_p--;
							}while(_p > -1)
							// while(_p > -1) {
							// 	p--;
							// 	i++;
							// }
							do {
								console.log(2);
								_stepMar = _stepMar + 40 * _j;
								_stepTopX = _stepTopX + 160 * _j;
								stepResult[b][_q].marginLeft = _stepMar;
								stepResult[b][_q].topX = _stepTopX;
								stepResult[b][_q].bottomX = _stepTopX;
								_j++;
								_q++;
							}while (_q < stepL)
						}
					

					}
				}
				let newDataNodes = new Array;
				for(let _m = 0; _m < stepResult.length; _m++) {
					for(let _n = 0; _n < stepResult[_m].length; _n++) {
						newDataNodes.push(stepResult[_m][_n]);
					}
				}
				for(let _t = 0; _t < newDataNodes.length; _t++) {
					if(newDataNodes[_t].status == 0) {
						newDataNodes[_t].bcColor = this.normal;
					}else if(newDataNodes[_t].status == -1) {
						newDataNodes[_t].bcColor = this.undone;
					}else if(newDataNodes[_t].status == 1) {
						newDataNodes[_t].bcColor = this.completed;
					}
				}
				console.log(newDataNodes);
				this.setState({
					node:newDataNodes
				});
				// this.initCanvas(500,40,420,60);
				let x0,y0,x1,y1;
				let routes = data.routes;
				
				for(let _o = 0; _o < routes.length; _o++) {
					for(let _d = 0; _d < newDataNodes.length; _d++) {
						let flag_1 = 0, flag_2 = 0;
						if(routes[_o].from_id == newDataNodes[_d].node_id) {
							flag_1++;
							x0 = newDataNodes[_d].bottomX;
							y0 = newDataNodes[_d].bottomY;
						}
						if(routes[_o].to_id == newDataNodes[_d].node_id) {
							flag_2++
							x1 = newDataNodes[_d].topX;
							y1 = newDataNodes[_d].topY;
						}
						if(flag_1 > 0 && flag_2 > 0) {
							flag_1 = 0;
							flag_2 = 0;
							break;
						
						}
					}
					// let _d = 0; _d < newDataNodes.length; _d++
					this.initCanvas(x0,y0,x1,y1,routes[_o].negative);
					
				}
			},
			err:(err) => {
				alert(err)
			}
		})
	}
	static defaultProps = {
		canvasWidth:200,
		canvasHeight:200,
	}

	test = () => {
		console.log(2);
	}
	render() {
		// const {canvasHeight,canvasWidth} = this.props;
		let {node,title} = this.state;
		// this.test();
		return (
			<div className = 'canvasBox' style={{border:'1px solid #cecece',width:1000,height:1000,marginLeft:10,marginTop:10}}>
				<div className = 'flow_name'>{title}</div>
				{
					node.map(item => {
						return (
							<div>
								
								<div className = 'flow_div' style={{top:item.step*60 + 60,marginLeft:item.marginLeft,backgroundColor:item.bcColor}}><span>{item.node_name}</span></div>
							</div>
							
						)
					})
				}
				<canvas id = 'graph_canvas' width="1000" height="1000"></canvas>
			</div>
			
		)
	}
}
export default Canvas