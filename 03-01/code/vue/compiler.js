import Watcher from './watcher'

function isTextNode(node) {
    return node && node.nodeType == 3
}
function isElementNode(node) {
    return node && node.nodeType == 1
}

export default class Complier {
    constructor(vm) {
        this.vm = vm
        this.el = vm.$el
        this.complie(this.el)
    }
    complie(el) {
        Array.from(el.childNodes).forEach(node => {
            if (isTextNode(node)) {
                this.complieText(node)
            } else if (isElementNode(node)) {
                this.complieElement(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.complie(node)
            }
        })

    }
    complieElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let name = attr.name
            if ( /^v-(\w+)/.test(name)) {
                this.update(node, RegExp.$1, attr.value, name)
            }
        })
    }
    complieText(node) {
        const reg = /\{\{(.*)\}\}/
        const val = node.textContent
        if (reg.test(val)) {
            const key = RegExp.$1.trim()
            node.textContent = val.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = val.replace(reg, newVal)
            })
        }
    }
    update(node, direct, key, name) {
        let fn = this[direct + 'Update']
        fn && fn.call(this, node, this.vm[key], key, name)
    }
    modelUpdate(node, val, key) {
        node.value = val
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    htmlUpdate(node, val, key) {
        node.innerHTML = val
        new Watcher(this.vm, key, (newVal) => {
            node.innerHTML = newVal
        })
    }
    onUpdate(node, val, key, name) {
        if (!/:(\w+)/.test(name)) return
        const event = RegExp.$1
        let cb = typeof val === 'function' ? () => { val.call(this.vm) } : null
        cb && node.addEventListener(event, cb)
        new Watcher(this.vm, key, (newVal) => {
            cb && node.removeEventListener(event, cb)
            cb = typeof newVal === 'function' ? newVal : null
            cb && node.addEventListener(event, cb)
        })
    }
}