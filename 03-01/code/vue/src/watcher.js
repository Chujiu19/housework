import Dep from './dep'
export default class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        Dep.target = this
        this.val = vm[key]
        Dep.target = null
    }
    update() {
        let newVal = this.vm[this.key]
        if(newVal === this.val) {
            return
        }
        this.cb(newVal)
    }
}