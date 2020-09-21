var Vue = (function () {
    'use strict';

    class Dep {
        constructor() {
            this.subs = [];
        }
        add(val) {
            if (val && val.update) {
                this.subs.push(val);
            }
        }
        update() {
            this.subs.forEach(sub => {
                sub.update();
            });
        }
    }

    class Observer {
        constructor(data) {
            this.work(data);
        }
        work(data) {
            if (!data || typeof data !== 'object') return
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key]);
            });
        }
        defineReactive(obj, key, val) {
            let that = this;
            this.work(val);
            let dep = new Dep();
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: true,
                get() {
                    Dep.target && dep.add(Dep.target);
                    return val
                },
                set(newVal) {
                    if (newVal === val) return
                    val = newVal;
                    that.work(newVal);
                    dep.update();
                }
            });
        }
    }

    class Watcher {
        constructor(vm, key, cb) {
            this.vm = vm;
            this.key = key;
            this.cb = cb;
            Dep.target = this;
            this.val = vm[key];
            Dep.target = null;
        }
        update() {
            let newVal = this.vm[this.key];
            if(newVal === this.val) {
                return
            }
            this.cb(newVal);
        }
    }

    function isTextNode(node) {
        return node && node.nodeType == 3
    }
    function isElementNode(node) {
        return node && node.nodeType == 1
    }

    class Complier {
        constructor(vm) {
            this.vm = vm;
            this.el = vm.$el;
            this.complie(this.el);
        }
        complie(el) {
            Array.from(el.childNodes).forEach(node => {
                if (isTextNode(node)) {
                    this.complieText(node);
                } else if (isElementNode(node)) {
                    this.complieElement(node);
                }
                if (node.childNodes && node.childNodes.length) {
                    this.complie(node);
                }
            });

        }
        complieElement(node) {
            Array.from(node.attributes).forEach(attr => {
                let name = attr.name;
                if ( /^v-(\w+)/.test(name)) {
                    this.update(node, RegExp.$1, attr.value, name);
                }
            });
        }
        complieText(node) {
            const reg = /\{\{(.*)\}\}/;
            const val = node.textContent;
            if (reg.test(val)) {
                const key = RegExp.$1.trim();
                node.textContent = val.replace(reg, this.vm[key]);
                new Watcher(this.vm, key, (newVal) => {
                    node.textContent = val.replace(reg, newVal);
                });
            }
        }
        update(node, direct, key, name) {
            let fn = this[direct + 'Update'];
            fn && fn.call(this, node, this.vm[key], key, name);
        }
        modelUpdate(node, val, key) {
            node.value = val;
            new Watcher(this.vm, key, (newVal) => {
                node.value = newVal;
            });
            node.addEventListener('input', () => {
                this.vm[key] = node.value;
            });
        }
        htmlUpdate(node, val, key) {
            node.innerHTML = val;
            new Watcher(this.vm, key, (newVal) => {
                node.innerHTML = newVal;
            });
        }
        onUpdate(node, val, key, name) {
            if (!/:(\w+)/.test(name)) return
            const event = RegExp.$1;
            let cb = typeof val === 'function' ? () => { val.call(this.vm); } : null;
            cb && node.addEventListener(event, cb);
            new Watcher(this.vm, key, (newVal) => {
                cb && node.removeEventListener(event, cb);
                cb = typeof newVal === 'function' ? newVal : null;
                cb && node.addEventListener(event, cb);
            });
        }
    }

    class Vue {
        constructor(options) {
            this.$options = options;
            this.$data = options.data || {};
            this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
            this._proxyData(this.$data);
            this.setMethods(options.methods);
            new Observer(this.$data);
            new Complier(this);

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
                        data[key] = val;
                    }
                });
            });

        }
        setMethods(methods) {
            Object.keys(methods).forEach(key => {
                this[key] = methods[key];
            });
        }
    }

    return Vue;

}());
