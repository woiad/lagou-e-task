/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/
// 1 promise 有三种状态，pending 等待、fulfilled 成功, rejected 失败
//   pending => resolved
//   resolved => rejected
// 状态一旦确定就不可更改
// 2 promise 是个类，创建的时候会传入一个函数，该函数在创建的时候执行
// promise 有两个函数用来更改状态 resolve 和 reject
// resolve => fulfilled
// reject => rejected
// 3 promise 有一个 then 方法可以调用，该方法包含两个参数 成功回调函数和失败回调函数，resolve 执行成功的回调函数
// reject 执行失败的回调函数
// 4 then 方法可以被多次调用
// 5 then 方法可以被链式调用，即后面的then的函数是上一个then的回调函数
// 6 then 方法不能返回当前的promis对象，这样会发生循环调用，

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise{
  constructor(excutor) {
    excutor(this.resolve, this.reject)
  }
  status = PENDING
  value = ''
  reason = ''
  // 成功回调
  successCallbacks = []
  // 失败回调
  failCallbacks = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断存在 successCallbacks 则调用执行 可执行 then 方法被多次调用的成功回调函数
    while(this.successCallbacks.length) this.successCallbacks.shift()(this.value)
  }
  reject = value => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = value
    // 判断存在 failCallbacks 则调用执行 可执行 then 方法被多次调用的失败回调函数
    while(this.failCallbacks.length) this.failCallbacks.shift()(this.reason)
  }

  then(successCallback, failCallback) {
    // 如果 then 接受的成功回调不是函数，默认返回 resolve 返回的值
    successCallback = successCallback ? successCallback : value => value
    // 如果 then 接收的失败回调不是函数, 默认抛出上一个 reject 返回的错误
    failCallback = failCallback ? failCallback : reason => { throw ( reason ) }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => { // 异步执行，拿到promise2对象
          try {
            let x = successCallback(this.value)
            resolveParam(resolve, reject, x, promise2)
          } catch(e) {
            reject(e)
          }
        }, 0)
      } else if(this.status === REJECTED){
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolveParam(resolve, reject, x, promise2)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // 当promise的状态是pending时，需要把成功和失败的回调函数存起来
        // 等到promise更改状态时，在执行相应的回调函数
        this.successCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolveParam(resolve, reject, x, promise2)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })

        this.failCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolveParam(resolve, reject, x, promise2)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  // 无论promise的状态是成功或者失败，这个方法的回调函数都会执行，并且返回一个promise对象
  finally(callback) {
    const promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        let x = callback(this.value)
        resolveParam(resolve, reject, x, promise2)
      }, 0)
    })
    return promise2
  }

  // MyPromise 的静态方法
  static all(array) {
    return new Promise((resolve, reject) => {
      let ind = 0
      let result = []
      function addData(key, value) {
        result[key] = value
        ind ++
        if (ind === array.length) {
          resolve(result)
        }
      }
      for (let i = 0, len = array.length; i < len; i++) {
        let current = array[i]
        // 判断传进来的值是普通值，还是MyPromise对象
        if (current instanceof MyPromise) {
          current.then(res => addData(i, res), reason => reject(reason))
        } else {
          addData(i, current)
        }
      }
    })
  }
  // MyPromise 的静态方法
  static resolve(value) {
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}

function resolveParam(resolve, reject, x, promise2) {
  // 判断函数返回的值 与当前的 promise对象是否相等
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断 then 返回的是promise 对象，还是普通值
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

module.exports = MyPromise
