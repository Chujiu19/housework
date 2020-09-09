
let _Vue = null
class VueRouter {
    static install(Vue) {
        if (VueRouter.install.installed) {
            return;
        }
        VueRouter.install.installed = true
        _Vue = Vue
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }
    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: "/"
        })
        this.init()

    }
    init() {
        this.createRouteMap()
        this.initComponent(_Vue)
        this.initEvent()
    }
    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        });
    }
    initComponent(Vue) {
        Vue.component("router-link", {
            props: {
                to: String
            },
            render(h) {
                return h("a", {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickhander
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickhander(e) {
                    window.location.hash = this.to
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })
        const self = this
        Vue.component("router-view", {
            render(h) {
                const cm = self.routeMap[self.data.current]
                return h(cm)
            }
        })

    }
    initEvent() {
        window.addEventListener("hashchange", () => {
            const hash = window.location.hash
            this.data.current = hash ? hash.replace('#', '') : '/'
        })
    }
}
