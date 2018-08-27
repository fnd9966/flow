import * as React from 'react'
import ReactDOM from 'react-dom'
import './assets/frame/tree'
import RedBox from 'redbox-react'
//import urlHelp from './config/urlHelp'
const urlHelp = require('./Rconfig/urlHelp');

import TestLayout from './assets/modules/TestLayout/TestLayout'
import FndTable from './assets/modules/FndTable/FndTable.js'
import Menu from './assets/modules/Menu/Menu.js'
import Canvas from './assets/modules/Canvas/Canvas.js'
import FormTest from './assets/modules/FormTest/FormTest.js'
import Flow from './assets/modules/Flow/Flow.js';
import MappingLayout from './assets/modules/mappingLayout/mappingLayout.js';
//url 预处理
const inject = (conf) => {
    if(!conf.key){
        return;
    }
    let basePath = (urlHelp.isReal) ? urlHelp.real[conf.key] : urlHelp.simulation[conf.key];
    if(conf.method == 'POST') {
        conf.url = basePath;
    }else{
        let theRequest = new Object();  
        if (basePath.indexOf("?") !== -1) {   
            let str = basePath.substr(basePath.indexOf("?") + 1);   
            let strs = str.split("&");   
            for(let i = 0; i < strs.length; i ++) {   
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];   
            }
            basePath = basePath.substring(0,basePath.indexOf("?"));
        }
        theRequest = (urlHelp.isReal) ? Object.assign({},theRequest,conf.data) : Object.assign({},conf.data,theRequest);
        conf.data = theRequest;
        conf.url = basePath;
    }
}

// T 全局配置
let config = {
  router: {
      go: '/',//默认路由（当前路由为空时跳转）
      route: {
          path: '/'
      }
  },  
  data:{},
  ajax: {
    inject : inject
  }
}
T.config(config)
const MOUNT_NODE = document.getElementById('root')

try {
    ReactDOM.render(<Canvas />, MOUNT_NODE)
    // ReactDOM.render(<Flow />, MOUNT_NODE)
    // ReactDOM.render(<FndTable />,MOUNT_NODE)
    // ReactDOM.render(<FormTest />, MOUNT_NODE)
    // ReactDOM.render(<TestLayout />,MOUNT_NODE)
} catch (e) {
    ReactDOM.render(<RedBox error={e} />, MOUNT_NODE)
}
