# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
webpack构建的时候，首先会通过 webpack.js 创建一个 compiler 实例,该实例会挂载配置的所有的插件和 webpack 的内置插件，该实例还可以操作文件的读写。compiler 实例在 webpack 整个打包的生命周期都会存在。创建好 compiler 实例后运行实例的 run 方法。run 方法会创建一个 compilation 实例，这个实例是 webpack 打包的具体实现，它的生命周期是当前次的打包过程。compilation 会调用 createModule 创建一个模块 module，然后通过这个模块的 build 方法去加载文件内容。主要就是读取js的内容，(如果文件不是js文件会调用对应的 loader 处理，把文件处理成js文件)，然后，把 js 文件解析成语法树，接着处理语法树把 import 和 require 替换成 __webpack_require__, 并且保存模块的依赖信息方便以后递归处理。最后再把当前的语法树生成可执行的代码并保存。到此入口文件的打包处理完成，就会调用 afterBuild 的回调方法，该方法会判断当前处理的文件是否有依赖，如果有依赖会调用 createModule 去打包处理文件，重复上述的打包流程，实现依赖的递归处理。当所有的依赖处理完毕后会调用 compilation 的 seal 方法来把相同的模块打包成同一个 chunk。chunk的内容是 webpack 的js模板 加上我们通过 module 处理过的js源码。至此 compilation 的生命周期结束。直接执行 run 方法中定义的 onCompiled 回调函数，该函数会创建 dist 文件目录，接着把打包好的 chunk 输出到 dist 文件目录。至此整个打包构建流程结束。
　

　

　

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
loader 主要负责资源文件从输入到输出的转换，加载资源文件。

开发 loader : loader.js 文件导出一个函数，该函数接收一个参数 source,该参数是打包的文件的内容，该函数会返回一段处理过后 js 代码，必须返回 js 代码，否则会报错。

plug则是增强 webpack 自动化的能力，协助 webpack 完成更好的打包工作。例如，每次打包之前 plugin 可以删除 dist 目录下的文件；plugin 还可以把静态文件直接拷贝输出目录；plugin 还可以压缩打包之后的代码。

plugin 开发：plugin 通过钩子机制实现，webpack 在打包过程中会注册许多的钩子，而开发 plugin 的时候，只需要在对应的钩子上挂载对应的处理函数即可。plugin 一般是一个函数或者是一个实现了 apply 方法的对象。一般 plugin 是一个类，类的内部定义了一个 apply 方法。使用的时候实例化类即可。
　

　

　

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性



**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

**其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.**



#### 作业要求

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 最终将录制的视频或说明文档和代码统一提交至作业仓库。
