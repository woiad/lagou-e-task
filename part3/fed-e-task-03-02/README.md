## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。
在 **new Vue** 之前，**Vue** 已经初始化了一些成员和静态方法在 **Vue** 构造函数和原型上。例如 **use**、**extend**、**component** 等等，还有内置组件 **keep-alive**，**transition**。等等。然后，执行 **new Vue** 的代码时，首先会执行 **this._init** 函数。**_init** 函数来源于 **Vue** 的原型。在 **_init** 函数中会合并 **Vue** 构造函数中的 **options** 和传入的 **options** 并挂载到当前 **vm** 实例的 **$options** 上。接着初始化 **vm** 的生命周期的变量和事件监听。接着为 **vm** 挂载与 **render** 相关的事件 **vm._c**（template 转为 render 渲染的方法）、**vm.$createElement** (用户手写的 render 渲染的方法)。然后，就会触发 **beforeCreate** 钩子函数，在这个生命周期期间，**vm** 的 **data**、**methods**、**computed**、**watcher**、**props** 中的数据都无法访问。此时，并没有初始化这些变量。


在 **beforeCreate** 的生命周期执行完之后。会把 **inject** 的成员注入到 **vm** 身上，并开始初始化 **props**、**methods**、**data**、**computed**、**watcher**、**provide**。接着就会执行 **created** 的钩子函数。因此，在 **created** 生命周期，可以访问到 **props**、**methods**、**data**、**computed**、**watcher**、**provide** 相关的数据。接着，就调用 **vm.$mount** 开始挂载。（这个函数位于 **Vue** 的原型上）


在 **$mount** 函数里，首先会判断是否传递了 **render** 函数，如果没有传递 **render** 函数，会把 **template** 转换成 **render** 函数。通过 **compileToFunctions** 把 **template** 转换成 **render** 函数。需要注意的是此时的 **$mount** 在 **src/platforms/web/entry-runtime-with-compiler.js** 当中进行了重写，新增了把模板编译为 **render** 的方法。这个是完整版的 **Vue** 才带有的功能。运行时的版本的 **Vue** 是不支持 **template** 语法的。接着，调用 **mount** 方法开始挂载。此处的 **mount** 方法是在重写 **$mount** 方法之前保存的 **Vue** 原型上的 **$mount** 方法。也就是说这个 **mount** 方法是一开始时 **Vue** 原型上的 **$mount** 方法。在这个方法中，调用了 **mountComponent** 方法。


在 **mountComponent** 方法中触发了 **beforeMount** 的钩子函数，接着定义了一个 **updateComponent** 函数，在这个函数中调用了 **vm._update**、**vm._render** 方法。然后就开始实例化 **Watcher**，并且传入了 **vm**、**updateComponent**、**before** 函数。**Watcher** 是一个类，所以在实例化的时候会调用 **Watcher** 的构造函数 **constructor**。在 **constructor** 中通过 **this.getter** 保存了传入的 **updateComponent** 函数。函数往下执行，会执行 **Watcher** 实例的 **get** 方法，在 **get** 方法中会执行 **this.getter**，而 **this.getter** 就是我们传入的 **updateComponent** 方法。于是开始执行 **updateComponent** 方法。在 **updateComponent** 方法中，先是执行了 **vm._render** 方法。执行完这个方法，会返回一个 **vnode**。


在 **vm._render** 方法中会调用 **render** 方法。此时的 **render** 是在 **vm.$options** 上的方法。是用户手动传入或者 **template** 编译生成的 **render**。在执行 **render** 的时候，会传入 **vm.$createElement** 方法，也就是我们在 **render** 函数中使用的 **h** 方法。它是在执行 **_init** 方法的时候挂载到 **vm** 身上的。在 **createElement** 里面又调用了 **_createElement** 方法。在 **_createElement** 中会对传入的参数进行一系列的处理。判断是否是自定义组件或者是普通的 **html** 标签或者是内置的 **component** 组件等。如果是普通的 **html** 标签，会调用 **new Vnode** 来为当前的标签生成 **vnode**。如果是自定义组件会调用 **createComponent** 处理。当前函数处理完毕，会返回生成的 **vnode**。在 **_render** 函数中也会返回 **vnode**。于是，**vm._update** 接收的参数就是 **render** 处理之后生成的 **vnode**。


在 **vm._update** 方法中会定义一个 **_vnode** 属性来保存当前生成的 **vnode**。同时还会定义一个 **prevVnoe** 来判断是否是初次渲染。接着调用 **vm.__ path__** 函数来生成真实的 **DOM** 节点并挂载到 **el** 上。 执行 **__ patch__** 函数的时候是在执行 **createPatchFunction** 返回的 **patch** 函数。在 **patch** 函数中会进行一系列的判断，判断是否是第一次渲染，判断新老节点是否存在等。由于这是第一次渲染，所以会创建一个空的 **oldVnode** 节点。接着调用 **creteElm**。在 **createElm** 中会调用 **createElement** 为传入的 **vnode** 创建 **DOM** 节点，并放在当前 **vnode** 的 **el** 属性上。然后，把当前创建的 **DOM** 节点挂载到 **el** 上。之后，就会触发 **mounted** 的生命周期函数。接着，进行一些后续的处理，**Vue** 的初次渲染到此就完成了。
　

　

　

#### 2、请简述 Vue 响应式原理。
当 **Vue** 初始化的时候会调用 **initState** 函数。在 **initState** 函数中，会对 **data** 里面的数据进行处理。首先会把 **data** 里面的属性都挂载到 **vm** 实例身上。所以，我们可以通过 **this.xxx** 来访问 **data** 中定义的属性。并且为这些 **vm** 实例的属性设置了 **getter** 和 **setter** 。在这些 **getter** 和 **setter** 中分别访问和设置 data 中对应属性的值。接着会调用 **observe** 函数对 **data** 中的属性进行响应式的处理。在 **observe** 函数中会实例化 **Observer** 对象。在 **Observer** 对象会实例化一个 **dep** 对象用来收集子对象的依赖。接着会调用 **walk** 遍历传入的对象的属性。然后，调用 **defineReactive** 来为对象的每一个属性实例化 **dep** 对象，和设置 **getter** 和 **setter**。其中，在 **getter** 中通过 **dep** 实例来收集依赖 **(watcher)**。当 **Dep.target** 存在时，才会进行依赖的收集。**Dep.target** 指向当前渲染 **watcher** 实例。因此，只有当渲染 **Watcher** 实例化的时候才会收集依赖。渲染 **Watcher** 实例化之后，会触发 **vm._render** 函数去生成 **vnode**。在生成 **vnode** 的过程中在我们使用 **Vue** 的插值表达式 / **v-bind** 绑定了 **data** 中的属性。因此，会访问这些属性，访问这些属性会触发 **vm** 实例对应的属性的 **getter** 。在 **getter** 中，我们又访问了 **data** 中的属性。又会触发 **data** 中的属性的 **getter** 。这个 **getter** 会进行依赖收集，把当前的 **watcher** 实例，添加到 **dep** 的 **subs** 数组里。

当我们修改数据时，会触发 **data** 数据的 **setter**。在这个 **setter** 中，会触发 **dep.notify** 事件。这个事件会遍历 **subs** 里面的 **watcher** ，然后执行 **watcher** 的 **update** 函数。在 **update** 函数中判断如果是渲染 **watcher** 就执行 **queueWatcher** 把 **watcher** 放进队列中，最后执行队列中的 **watcher** 的 **run** 方法，**run** 方法会触发 **updateComponent** 函数渲染视图。从而达到更新视图的目的。
　

　

　

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。
在虚拟 **DOM** 中比对新旧节点方法有五种，新旧节点的开始节点、新旧节点的结束节点、旧节点的开始新节点的结束节点、旧节点的结束新节点的开始节点，如果以上四种都不符合就对 key 进行处理。当我们用数组生成 **DOM** 元素的时候，并且没有绑定 **key** 。如果在开头插入新的元素，在比对新旧元素的时候，会执行多次 **DOM** 操作来更新旧节点的值。而，如果我们绑定了 **key** ，那么新加入的第一个元素会创建新的 **DOM** 元素，然后插入到父节点中，因为它的 **key** 和其他元素的 **key** 不一样，所以会生成新的元素。接着后续的比较中，不会再有 **DOM** 操作。因为新加入的元素已经处理过了，其他的新旧节点都是一样的包括 **key** **tag** 和值，所以不会在有 **DOM** 操作。因此，我们在虚拟 DOM 中添加 key 可以减少一些不必要的 dom 操作，最大限度的重用 DOM，可以提高性能。还可以保证渲染不会出错。
　

　

　

#### 4、请简述 Vue 中    模板编译的过程。
在完整版的 **Vue** 当中，如果传入了 **template** , 则会调用 **compileToFunctions** 函数把传入的 **template** 模板编译成 **render** 函数，然后把 **render** 函数挂载到 **vm** 实例的 **options** 属性身上。在 **compileToFunctions** 函数当中首先会判断当前的 **template** 是否有缓存，如果有缓存直接返回缓存的内容，缓存的内容是一个对象包含 **render**、**staticRenderFns** 属性。缓存的 **key** 是 **template** 或者 **options.delimiters + template** 。如果没有缓存，继续执行下面的代码。

没有缓存则会调用 **compile** 函数，对 **template** 进行处理。在 **compile** 函数中，首先会把 **template** 转换成 **AST** 语法树。用对象的形式来描述 **template** 的代码结构。调用 **parser** 函数把 **template** 转换成 **AST**。接着判断是否进行优化，默认情况下会进行优化。调用 **optimize** 函数对 **AST** 语法树优化。主要是判断 **DOM** 元素是否是静态节点，（纯文本的 **HTML**，不包含产值表达式/**v-bind** 绑定）静态根节点（父元素包含子元素，子元素都是静态节点，且子元素不能只有一个并且这个子元素是注释节点）。如果是静态根元素，那么在 **path** 阶段的时候，会跳过静态根节点，不做处理。从而提高渲染的速度。优化处理完成之后，就会调用 **generator** 函数把 **AST** 语法树转换成字符串形式的 **javascript** 代码。此处的 **javascript** 代码相当于我们手写形式的 **render** 函数返回的代码。

接着，在 **compileToFunctions** 函数当中，把字符串形式的代码通过调用 **createToFunction** 函数转换成可执行的匿名函数。然后，把处理好的 **template** 放进缓存当中，并且返回。返回的是一个对象。最后，挂载到当前 **vm** 实例的 **options** 对象身上。

>笔记链接
> https://www.yuque.com/docs/share/874bb850-255b-4835-99f9-2d3c5dd0cd34?# 《Vue-响应式源码》
　

　

　
