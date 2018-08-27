define([], function() {
    var urlHelp = {
      'isReal':true,
      'real':{
        'selectData':'http://192.168.118.226:9018/webapi2/api/v2/commonflow/project/commonflow-select-flowtype',
        'allFlowData':'http://192.168.118.226:9018/webapi2/api/v2/commonflow/project/commonflow-select-flowinf',
        'flowType':'http://192.168.118.226:9018/webapi2/api/v2/commonflow/project/commonflow-insert-flowtype',
        'flowNode': 'http://192.168.118.226:9018/webapi2/api/v2/commonflow/project/commonflow-insert-flownode',
        'flowRoute': 'http://192.168.118.226:9018/webapi2/api/v2/commonflow/project/commonflow-insert-flowroute',
      },
      'simulation':{
        'json':'./data/data.json',
        'formjson':'./data/formData.json'
      }
    }
    return urlHelp
});

