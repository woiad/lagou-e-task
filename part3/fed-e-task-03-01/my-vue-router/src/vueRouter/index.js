let _Vue = null
let mode = null

export default class VueRouter {
  constructor(options) {
    this.options = options
    mode = this.options.mode || 'hash'
    this.data = _Vue.observable({
      current: '/'
    })
    this.routeMap = {}
  }

  static install(vue) {
    if (VueRouter.install.installed) {
      return
    }

    VueRouter.install.installed = true

    _Vue = vue

    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  init() {
    console.log(mode)
    if (mode === 'hash') {
      window.location.href.indexOf('#') > -1 ? '' : window.location.href = `${window.location.href}#/`
      this.data.current = window.location.hash.replace('#', '')
    }
    this.initEvent()
    this.createRouteMap()
    this.initComponents(_Vue)
  }

  initEvent() {
    if (mode === 'hash') {
      window.addEventListener('hashchange', () => {
        const to = window.location.hash.replace('#', '')
        this.data.current = to

      }, false)
    } else {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    }
  }

  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents(vue) {
    vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandle
          },
        }, [this.$slots.default])
      },
      methods: {
        clickHandle(e) {
          if (mode === 'hash') {
            window.location.hash = `#${this.to}`
          } else {
            console.log(this.to);
            history.pushState({}, '', this.to)
          }
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })
    const self = this
    vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
}
