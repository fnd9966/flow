class Table {
    constructor (options) {
        this.options = Object.assign({},this.options,options)
        this.initialize(options);
    }
    /**
     * 配置参数
     */
    options = {
        
    }
    /**
     * 初始化
     * @param options 
     */
    initialize (options) {
       console.log('hello world')
    }

}

export default Table