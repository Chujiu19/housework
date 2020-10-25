import Dep from "./dep.js"
export default class Observer {
    constructor(data) {
        this.work(data)
    }
    work(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        let that = this
        this.work(val)
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                Dep.target && dep.add(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal === val) return
                val = newVal
                that.work(newVal)
                dep.update()
            }
        })
    }
}