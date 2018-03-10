'use strict';

const getRawBody = require('raw-body');
const xml2js = require('xml2js');

const xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true})

module.exports = options => {
    return function* interceptor(next) {
		//拦截request请求
		// this.logger.info(`----入参----${JSON.stringify(this.request.body)}`);
		//入参参数校验
		// try{
			//把xml转成json
    if(this.request.header["content-type"] === 'text/xml'){
      const buff = yield getRawBody(this.request.req);
      const _this = this;
      xmlParser.parseString(buff, function(err, result) {
        //将返回的结果再次格式化
        // console.log(JSON.stringify(result.xml));
        _this.request.body = result.xml;
    });
    } else {
//入参处理
      let reqJson = this.request.body;
// console.log("reqJson="+reqJson);
//入参重新赋值
      this.request.body = reqJson;
}

// } catch (e) {
// 	this.response.body = "json解析出错";
// 	this.logger.info(`----出参----${JSON.stringify(this.response.body)}`);
// 	return;
// }

//返回控制权给控制器
yield next;
//拦截response请求
if(this.response.body){
// this.logger.info(`----出参----${JSON.stringify(this.response.body)}`);
}
};
};
