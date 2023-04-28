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
    for(let i =0; i< array.length; i++){
        item = array[i]
        let p = Promise.resolve().then(()=> iteratorFn(item))
        totalList.push(p)
        // 删除执行完毕的 promise
        let e = p.then(()=> {
            executing.splice(executing.findIndex(ele => ele.index === i),1)
        })
        executing.push({p:e, index: i})
        // 并发数超过限制
        if(executing.length >= poolLimit){
           await Promise.race(executing.map(it => it.p))
        }
    }
    return Promise.all(totalList)
 }

module.exports.asyncPool = asyncPool;
