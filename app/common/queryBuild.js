
'use strict';
const queryBuild = {
  parseQuery(data){

  },
  buildQueryValue(key,type){
    //数据长度判断，数据可以是空格或者换行
    let returnValue= {
       code : 500,
    };
    if( type != "REPAIR_PROGRESS" ){
      if(key.indexOf(' ')>0 && key.indexOf('\n')>0){
        returnValue.code = 500;
        return returnValue;
      }else if(key.indexOf(' ')>0){
        const arrs = key.split(" ");
        const newArray = new Array();
        for(let i=0;i<arrs.length;i++){
          if(arrs[i]!="" && arrs[i]!=" " && arrs[i]!=null && arrs[i]!="null"&& arrs[i]!="\n"){
            newArray.push(arrs[i]);
          }
        }
        returnValue.code = 200;
        console.log(JSON.stringify(newArray));
        returnValue.keys = newArray;
        return returnValue;
      }else if(key.indexOf('\n')>0){
        const arrs = key.split("\n");
        const newArray = new Array();
        for(let i=0;i<arrs.length;i++){
          if(arrs[i]!=""&& arrs[i]!=" " && arrs[i]!=null && arrs[i]!="null" && arrs[i]!="\n"){
            newArray.push(arrs[i]);
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
