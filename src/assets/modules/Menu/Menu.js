import React from 'react';
import ReactDom from 'react-dom';
import MenuItem from '../../component/MenuItem_fnd/menuItem.js';
import './css/menu.less';

class Menu extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			menuLists:[]
		}
	}
	partW = document.documentElement.clientWidth / 3 || document.body.clientWidth / 3;
	title = '菜单';
	componentWillMount() {
		T.ajax({
	      f : 'json',
	      key : 'json',
	      data : {},
	      method : 'GET',
	      success : (result) => {
	        this.setState({
				menuLists:result.data
	        })
	      },
	      err : (error) => {
	        alert(error);
	      }
	    })
	}
	componentDidMount () {
		if(!!T.data("menu_title")) {
			this.title = T.data('menu_title');
			this.setState()
		} else {
			T.on('dc_menu_title',data => {
				this.title = data.new;
				this.setState();
			})
		}
	}
	urlHandle = (url) => {
		T.router.go(url);
	}
	iconHandle = () => {
		// console.log(1);
		T.do('enter');
	}

	render() {
		const {menuLists} = this.state;
		return (
				<div className = 'menuLayout'>
					<div className = 'title'>
						
						<span className = 'titleName'>{this.title}</span>
						<span className = 'icon' onClick = {() => this.iconHandle()}></span>
					</div>
					<div className = 'menu'>
						{
							menuLists.map((item) => {
								console.log(item.hidden);
								return (
										<div className = {item.hidden?'noShow menuItem':'menuItem'} style = {{height: this.partW, width: this.partW}} onClick = {() => this.urlHandle(item.url)}>
											<img src={item.iconurl} alt="" className = 'icon' />
											<span className = 'name'>{item.name}</span>
										</div>
									)
							})
						}
					</div>
				</div>
		)
	}
}

export default Menu