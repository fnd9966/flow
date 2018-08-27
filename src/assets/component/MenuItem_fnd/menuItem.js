import React from 'react';

class MenuItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	partW = document.documentElement.clientWidth / 3 || document.body.clientWidth / 3;
	componentWillMount () {

    }
    componentDidMount() {
		
	}


	urlHandle = (url) => {
		// console.log(url);
		T.router.go(url);

	}

	render() {
		const {imgURL,name,url} = this.props;
		// console.log(imgURL);

		return (
			<div className = 'menuItem' style = {{height: this.partW, width: this.partW}} onClick = {() => this.urlHandle(url)}>
				<img src={imgURL} alt="" className = 'icon' />
				<span className = 'name'>{name}</span>
			</div>
		)
	}
}

export default MenuItem