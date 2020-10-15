import Watcher from "./watcher";
import parser from "./praser";
import { init } from "snabbdom/build/package/init";
import { classModule } from "snabbdom/build/package/modules/class";
import { propsModule } from "snabbdom/build/package/modules/props";
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
import { h } from "snabbdom/build/package/h";

var patch = init([
  // Init patch function with chosen modules
  //   classModule, // makes it easy to toggle classess
  //   propsModule, // for setting properties on DOM elements
  //   styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);
function getType(item) {
  return Object.prototype.toString.call(item).toLowerCase();
}
function isObj(item) {
  return getType(item) === "[object object]";
}
function isArr(item) {
  return getType(item) === "[object array]";
}
function create(a, b, c) {
  if (isObj(b)) {
  }
}

export default class Complier {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    if (vm.$options.render) {
      this._render = vm.$options.render;
    } else if (this.el) {
      this._render = parser(this.el);
    }
    this.$creater = function (a, b, c) {
      console.log(this,a, b, c,'b');
      return h(a, b, c);
    };
    this._vnode = this._render(this.$creater);
    this.complie();
  }
  complie() {
    let updateMap = {};
    this._vnode.children.forEach((vnode) => {
      let { props, on } = vnode.data || {};
      if (props && isObj(props)) {
        Object.keys(props).forEach((key) => {
          updateMap[key] = updateMap[key] || [];
          updateMap[key].push(vnode);
        });
      }
    });

    console.log(this._vnode, updateMap);
    //         if(vnode.tag) {
    //             this.complieElement(vnode.children, vnode)
    //         }else {
    //             this.complieText(vnode)
    //         }
    //
    //         export function vnode(sel, data, children, text, elm) {
    //             const key = data === undefined ? undefined : data.key;
    //             return { sel, data, children, text, elm, key };
    //         }
    //
    //         Array.from(vnode.children).forEach(node => {
    //             if (node.type == 3) {
    //                 this.complieText(node)
    //             } else if (node.type == 1) {
    //                 this.complieElement(node)
    //             }
    //         })
    patch(this.el, this._vnode);
  }
  complieChildren(vnodes, PVnode) {
    return vnodes.map((vnode) => {
      let { tag, data, children } = vnode;
      if (vnode.data) {
        Object.keys(data).forEach((key) => {});
      }
    });
  }
  complieElement(vnodes, PVnode) {
    Array.from(node.attributes).forEach((attr) => {
      let name = attr.name;
      if (/^v-(\w+)/.test(name)) {
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
    let fn = this[direct + "Update"];
    fn && fn.call(this, node, this.vm[key], key, name);
  }
  modelUpdate(node, val, key) {
    node.value = val;
    new Watcher(this.vm, key, (newVal) => {
      node.value = newVal;
    });
    node.addEventListener("input", () => {
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
    if (!/:(\w+)/.test(name)) return;
    const event = RegExp.$1;
    let cb =
      typeof val === "function"
        ? () => {
            val.call(this.vm);
          }
        : null;
    cb && node.addEventListener(event, cb);
    new Watcher(this.vm, key, (newVal) => {
      cb && node.removeEventListener(event, cb);
      cb = typeof newVal === "function" ? newVal : null;
      cb && node.addEventListener(event, cb);
    });
  }
  _init(vnode) {
    let { on, props } = vnode.data;
  }
  _watch(vnode) {
    const { data = {} } = vnode;
    if (data) console.log(vnode, "watch");
  }
}
