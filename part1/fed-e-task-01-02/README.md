# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i)
  }
}
a[6]()
```
输出10；用var定义变量时，发生了变量提升，会把i变成全局变量，所以数组里的函数访问的都是全局把变量I，而全局I经过循环累加最后的值是10因此输出10
　

　

### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```
运行会报错 ' Cannot access 'temp' before initialization';执行到if语句时，if里面有let语句，由于let存在
'暂时性死区'，即用 let或const定义变量时，要先定义后使用否则会报错。
　

　

### 3. 结合ES6语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
```

```
Math.min(...arr)
```


### 4. 请详细说明var、let、const三种声明变量的方式之间的具体差别
+ var: var定义的变量会出现变量提升的情况，即把变量提升至作用域的顶端
```
 console.log(a) // undefined 此处可以访问变量a, a是全局变量
 var a = 1 // 变量a出现了变量提升
```
+ let: let定义的变量不会出现变量提升的情况，而且用该方法定义的变量会有块级作用域；变量只能在块级作用域中访问。
  而且该方法定义的变量有‘暂时性死区’，即变量未定义前 不允许使用
```
console.log(a) // 报错，let 定义的变量不会出现变量提升，因此报错
let a = 2

let arr = []
for (let i = 0; i < 5; i++) {
  arr[i] = function() {
    cosnole.log(i)
  }
}
arr[4]() // 4 因为let定义的变量有块级作用域，因此每一次循坏的i作用域都不同。
```
+ const: 它跟 let 有点类似，它定义的变量也有块级作用域；'暂时性死区'；不会出现变量提升
但是该变量定义的是常量。如果定义的是基本数据类型(number, boolean, sring,null,undefined,symbol)则不允许更改;
如果定义的变量是引用类型数据，则不允许更改变量的引用地址
```
const a = 1
a = 2 // 报错，基本类型一旦定义，就不允许更改

const arr = [1, 2]
arr[3] = 3 // 不会报错，该操作做没有改变变量的引用地址
arr = [] // 报错，更改了数据的引用地址
```
　

　

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10;
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  }
}
obj.fn()
```
打印输出20。setTimeout里的函数是箭头函数，它的作用就是跟它所处作用域有关。由代码可知它所处的
作用域是fn的作用域，fn的作用域就是箭头函数的作用域。普通函数的作用域在运行时确定，谁调用函数，函数的作用就指向谁。
上面的代码是obj调用fn，因此fn的作用域就指向obj，因此箭头函数的作用域指向obj。所以 this 指向obj，obj中存在变量a = 20
所以打印输出20

　

　

### 6. 简述Symbol类型的用途
Symbol是一种新的数据类型，生成的数据是独一无二的，不会造成重复。可用于生成对象的私有成员。
　

　

### 7. 说说什么是浅拷贝，什么是深拷贝？
+ 浅拷贝：就是把原数据的引用地址拷贝给另一个变量，如果改变该变量的数据，则原数据也会发生改变
```
// 浅拷贝的实现
const obj = {
    name: 'woiad',
    hobby: {
      type: 'running'
    }
}

const newObj = Object.assign({}, obj)
newObj.name = 4 // 使用 Object.assing() 对象的第一层属性是深拷贝
newObj.hobby.type = 'play game' // 对象的第二层属性及其以后属性的是浅拷贝
console.log(obj, newObj) // a { name: 'woiad', hobby: { type: 'play game' } } b { name: 4, hobby: { type: 'play game' } }
```
+ 深拷贝：把原数据拷贝到新的地址储存，如果改变新地址得数据，原地址的数据不会发生改变
```
// 深拷贝实现
const obj = { name: 'woiad' }
const newObj = JSON.parse(JSON.stringify(obj))
newObj.name = 'newName'
consoe.log(obj, newObj) // { name: 'woiad' } { name: 'newName' }
```
　

　

### 8. 请简述TypeScript与JavaScript之间的关系？
Typescript是javascript的超集，它补充和扩展了javascript。它包含了: 类型检查、ECMAScript、javascript。
因此Typescript是超集，而javascript是Typescript子集。
　

　

### 9. 请谈谈你所认为的typescript优缺点
+ Typescript 优点：
  + 有更好的类型规范可以避免许多类型引用的错误；
  + 许多错误发生在编译时发生，可以提高寻找错误的效率；
  + 提高代码的可靠程度
+ Typescript 缺点：
  + 短期内会增加一些开发成本，要多写一些类型定义，不过对于一个需要长期维护的项目，Typescript可以减少维护成本
  + 有一定的学习成本，需要理解一些前端不熟悉的概念，接口(Interfaces)、类(Classes)、泛型(Generics)等
  + 可能和一些库的结合不是很完美

　

　

### 10. 描述引用计数的工作原理和优缺点
+ 引用计数的工作原理：它会标记可达对象的引用次数，如果可达对象的引用次数为0；则会被回收
+ 引用计数的优点：它会实时计数，如果可达对象的引用次数为空，则马上会被回收掉;最大程度减少程序暂停
+ 引用计数的缺点：对于循环的引用它无法回收掉；时间开销大
　

　

### 11. 描述标记整理算法的工作流程
标记整理分为两轮；第一轮是标记，第二轮是回收。第一轮标记；对所有的对象进行循环遍历，为活动对象打上标记，第二轮回收，在删除之前会先进行空间整理，避免出现空间碎片化的情况。整理完成之后，就是回收，把第一轮未标记的
对象回收掉。
　

　

### 12.描述V8中新生代存储区垃圾回收的流程
新生代的空间分为 from 空间和 to 空间。from 空间存储对象，to 空间空闲。先是使用标记整理算法，将活动对象进行标记。第二阶段就整理标记好的活动对象的空间。然后使用空间复制的算法，把标记整理好的活动对象复制到 to 空间。复制完成后，将 to 空间和from 空间互换完成释放。
拷贝的过程中可能存在晋升的现象。晋升就是把新生代的对象移动至老生代对象中。一轮GC之后还存活的新生代对象如要晋升；to 的空间使用率超过25%需要晋升
　

　

### 13. 描述增量标记算法在何时使用及工作原理
标记增量算法在老生代存储区回收垃圾时工作。垃圾回收时整个程序的执行会被阻塞执行，而增量标记算法会将一整段的垃圾回收操作划分为一小段一小段
的组合完成整个垃圾回收操作，它可以和程序交替执行。
　

　
