
import Observer from "./src/observer.js"
import Complier from "./src/complier.js"
export default class Vue {
    constructor(options) {
        this.$options = options
        this.$data = options.data || {}
        this.$el = (typeof options.el === 'string') ? document.querySelector(options.el) : options.el
        this._proxyData(this.$data)
        this.setMethods(options.methods)
        new Observer(this.$data)
        new Complier(this)

    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(val) {
                    if (val === data[key]) return
                    data[key] = val
                }
            })
        })

    }
    setMethods(methods) {
        Object.keys(methods).forEach(key => {
            this[key] = methods[key]
        })
    }
}