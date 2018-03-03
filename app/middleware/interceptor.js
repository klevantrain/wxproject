'use strict';

const getRawBody = require('raw-body');
const xml2js = require('xml2js');

const xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true})

module.exports = options => {
    return function* interceptor(next) {
		//拦截request请求
		this.logger.info(`----入参----${JSON.stringify(this.request.body)}`);
		//入参参数校验
		// try{
			//把xml转成json
			if(this.request.header["content-type"] === 'text/xml'){
        console.log("========")
				let buff = yield getRawBody(this.request.req);
        console.log("========"+buff)

				let resultjson = JSON.parse(xmlParser.parseString(buff)).xml;
        console.log("========"+JSON.parse(xmlparser.parseString(buff)))
        console.log(resultjson)
				this.request.body = resultjson;
			} else {
				//入参处理
				let reqJson = this.request.body.json;
				//入参重新赋值
				this.request.body = JSON.parse(reqJson);
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
			this.logger.info(`----出参----${JSON.stringify(this.response.body)}`);
		}
    };
};
