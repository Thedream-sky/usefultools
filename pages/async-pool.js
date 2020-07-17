;
/**
 * 
 * @param {*} poolLimit 并发限制数
 * @param {*} array 请求参数列表
 * @param {*} iteratorFn 回调函数
 */
async function asyncPool(poolLimit, array, iteratorFn) {
   let totalList = [];
   let executing = []; 
   for(let item of array){
       let p = Promise.resolve().then(()=> iteratorFn(item))
       totalList.push(p)
       // 删除执行完毕的 promise
       let e = p.then(()=> executing.splice(executing.indexOf(e),1))
       executing.push(e)
       // 并发数超过限制
       if(executing.length >= poolLimit){
          await Promise.race(executing)
       }
   }
   return Promise.all(totalList)
}

module.exports.asyncPool = asyncPool;