const Subscription = require('egg').Subscription;
const config = require('../common/config');
class GsxSchedule extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
        interval: '80m',
    //   cron: '0 55 23 * * *',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    
    const ctx = this.ctx;
    const params = {
        status:0,
    }
   const scheduleInfos = await ctx.service.schedule.getScheduelInfo(params);
   if(scheduleInfos ==null || scheduleInfos ===""|| scheduleInfos.length<=0){
        return;
   }
//    console.log(JSON.stringify(scheduleInfos));
   for(let i=0;i<scheduleInfos.length;i++){
    const queryResult = await ctx.service.schedule.query(scheduleInfos[i]);
        // console.log("queryResult==="+JSON.stringify(queryResult));
        if(queryResult.data.code === 0){
            console.log("开始发送");
           await ctx.service.schedule.sendAsysMessage(scheduleInfos[i],queryResult.data.tip);
            const params = {
                id:scheduleInfos[i].id,
                status:-1,
            };
            await ctx.service.schedule.updateScheduelInfo(params);
        }
   }
//    scheduleInfos.forEach(function(v,i,a){
//        const ctx = this.ctx;
//         const curr = v;
//         const queryResult = await ctx.service.schedule.query(v);
//         console.log("queryResult==="+JSON.stringify(queryResult));
//         if(queryResult.data.code === 0){
//             this.sendAsysMessage(v,data);
//             const params = {
//                 id:v.id,
//                 status:-1,
//             };
//             ctx.service.schedule.updateScheduelInfo(params);
//         }
//     });
  }


  

//   async sendAsysMessage(v,data){
//     const ctx = this.ctx;
//     const token = await this.getAccessToken(ctx);
//     const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token, {
//       method: 'POST',
//       contentType: 'json',
//       data: {
//               touser:v.user_id,
//               msgtype:"text",
//               text:
//               {
//                 "content":data,
//               },
//             },
//       dataType: 'json',
//     });
//     // console.log("----==="+JSON.stringify(result));
//   }

  async getAccessToken(ctx){
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret='+config.AppSecret ;
    const result = await ctx.curl(url, {
      dataType: 'json',
    });
    // console.log("token=="+JSON.stringify(result));
    return result.data;
  }

}

module.exports = GsxSchedule;