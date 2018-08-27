import React from 'react';
import Text from './Text.js';
import CheckBox from './checkBox.js';
import File from './file.js';
import Time from './time.js';
import './css/form_fnd.less';

class FormFnd extends React.Component {
	constructor(props){
        super(props)
        this.state = {
            // detail: false
            textFlag:false,
            checkboxFlag:false,
            fileFlag:false,
            dateFlag:false,
            iframFlag:false,
            btnFlag:false,
            text:[],
            check:[],
            file:[],
            time:[],
            iframe:[]
        }
    }
    componentDidMount() {
		T.ajax({
			key:'formjson',
			data:{},
			method:'GET',
			success:(result) => {
				console.log(result.type);
			},
			error:(err) => {
				alert(err);
			}
		});
		let input = document.getElementById('choose');
		let res = input.getElementsByTagName('input');
		// console.log(res);
		let checkArr = [];
		for(let i = 0, resLen = res.length; i < resLen; i++) {
			// if(input[i].getAttributes('type') == 'checkbox')
			
			res[i].addEventListener('change',(e) => {
				if(e.target.checked) {
					// console.log(1);
					checkArr.push(res[i]);
					
				}else {
					for(let j = 0,arrLen = checkArr.length; j < arrLen; j++) {
						if(res[i] == checkArr[j]) {
							checkArr.splice(j,1);
						}
					}
				}
				console.log(checkArr);
				if(checkArr.length > 0) {
					this.setState({
						btnFlag:true
					})
				}else {
					this.setState({
						btnFlag:false
					})
				}
			});
			

		}

    }
	handleText = (e) => {
		// console.log(e.target.checked);
		if(e.target.checked) {
			this.setState({
				textFlag:true,
				// btnFlag:true
			})
		}else {
			this.setState({
				textFlag:false,
				// btnFlag:false
			})
		}
	}
	handleCheckbox = (e) => {
		if(e.target.checked) {
			this.setState({
				checkboxFlag:true,
				// btnFlag:true
			})
		}else {
			this.setState({
				checkboxFlag:false,
				// btnFlag:false
			})
		}
	}
	handleFile = (e) => {
		if(e.target.checked) {
			this.setState({
				fileFlag:true,
				// btnFlag:true
			})
		}else {
			this.setState({
				fileFlag:false,
				// btnFlag:false
			})
		}
	}
	handleDate = (e) => {
		if(e.target.checked) {
			this.setState({
				dateFlag:true,
				// btnFlag:true
			})
		}else {
			this.setState({
				dateFlag:false,
				// btnFlag:false
			})
		}
	}
	handleIfram = (e) => {
		if(e.target.checked) {
			this.setState({
				iframFlag:true
			})
		}else {
			this.setState({
				iframFlag:false
			})
		}
	}
    render() {
    	// console.log(this.state.textFlag);
    	return (
    		<div className = 'layout'>
    			<div className = 'choose' id = 'choose'>
					<h5>请选择：</h5>
					<form id = 'basic_featrue'>
						<p className = 'feature'>
							<input type="checkbox" id = 'featrue_text' onChange = {this.handleText} />
							<label htmlFor="featrue_text">text</label>
							<ul className = {this.state.textFlag ? 'show' : 'hidden'}>
								<li>
									<input type="checkbox" id = 'featrue_text' onChange = {this.handleText} />
									<label htmlFor="featrue_text">开机理由</label>
								</li>
							</ul>
						</p>
						<p className = 'feature'>
							<input type="checkbox" id = 'featrue_checkbox' onChange = {this.handleCheckbox} />
							<label htmlFor="featrue_checkbox">checkbox</label>
						</p>
						<p className = 'feature'>
							<input type="checkbox" id = 'featrue_file' onChange = {this.handleFile} />
							<label htmlFor="featrue_file">file</label>
						</p>
						<p className = 'feature'>
							<input type="checkbox" id = 'featrue_date' onChange = {this.handleDate} />
							<label htmlFor="featrue_date">date</label>
						</p>
						<p className = 'feature'>
							<input type="checkbox" id = 'featrue_ifram' onChange = {this.handleIfram} />
							<label htmlFor="featrue_ifram">ifram</label>
						</p>
					</form>
    			</div>
				<div className = 'form_body'>
					<div className = 'inner_body'>
						<div className = 'form_content'>
							{this.state.textFlag ? <Text></Text>:''}
							{this.state.checkboxFlag ? <CheckBox></CheckBox> : ''}	
							{this.state.fileFlag ? <File></File> : ''}
							{this.state.dateFlag ? <Time></Time> : ''}	
							{this.state.btnFlag ? <div className = 'saveBtn'>保存</div> : ''}	
						</div>
					</div>
								
				</div>
    		</div>
			
    	)
    }
}
export default FormFnd