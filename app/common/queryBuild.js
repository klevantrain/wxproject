
'use strict';
const queryBuild = {
  parseQuery(data){

  },
  buildQueryValue(key,type){
    //数据长度判断，数据可以是空格或者换行
    let returnValue= {
       code : 500,
    };
    // console.log(key);

    if( type != "REPAIR_PROGRESS" &&  type != "GSX_STRATEGY_QUERY" && type != "GSX_CASE_QUERY"){
      // if(key.indexOf(' ')>0 && key.indexOf('\n')>0){
      //   // console.log(34234324);
      //   returnValue.code = 500;
      //   returnValue.message = "查询参数不支持同时包含空格与换行，请客官输入用换行或者空格编辑的参数！";
      //   return returnValue;
      // }else
      if(key.indexOf(' ')>0){
        const arrs = key.split(" ");
        const newArray = new Array();
        for(let i=0;i<arrs.length;i++){
          if(arrs[i]!="" && arrs[i]!=" " && arrs[i]!=null && arrs[i]!="null"&& arrs[i]!="\n"){
            newArray.push(arrs[i].replace(/[\r\n]/g,""));
          }
        }
        returnValue.code = 200;
        // console.log(JSON.stringify(newArray));
        returnValue.keys = newArray;
        return returnValue;
      }else if(key.indexOf('\n')>0){
        const arrs = key.split("\n");
        const newArray = new Array();
        for(let i=0;i<arrs.length;i++){
          if(arrs[i]!=""&& arrs[i]!=" " && arrs[i]!=null && arrs[i]!="null" && arrs[i]!="\n"){
            newArray.push(arrs[i].replace(/\ +/g,""));
          }
        }
        returnValue.code = 200;
        returnValue.keys = newArray;
        return returnValue;
      }else{
        returnValue.code = 200;
        returnValue.keys = new Array(key);
        return returnValue;
      }
    }else{
      returnValue.code = 200;
      returnValue.keys = new Array(key);
      return returnValue;
    }
  }
}
module.exports = queryBuild;
