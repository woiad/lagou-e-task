const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'you project name?',
        default: this.appname
      },
      {
        type: "input",
        name: 'description',
        message: 'your project description',
        default: 'my project'
      },
      {
        type: "input",
        name: 'author',
        message: 'your project author',
        default: 'woiad'
      }
    ])
      .then(answer => { // 获取用户在命令行输入的信息
        this.answer = answer
      })
  }

  writing() {
    // 把每一个文件通过模板转换到目标路径
    const templates = [
      'public/favicon.ico',
      'public/index.html',
      'src/assets/logo.png',
      'src/components/HelloWorld.vue',
      'src/router/index.js',
      'src/store/index.js',
      'src/views/about.vue',
      'src/views/home.vue',
      'src/App.vue',
      'src/main.js',
      '.browserslistrc',
      '.env.prod',
      '.env.dev',
      '.eslintrc.js',
      '.gitignore',
      'babel.config.js',
      'package.json',
      'README.md'
    ]
    templates.forEach(path => {
      // 执行模板复制函数
      this.fs.copyTpl(
        this.templatePath(path), // 模板路径
        this.destinationPath(path), // 模板输出的路径
        this.answer // 模板渲染的数据
      )
    })
  }
}
