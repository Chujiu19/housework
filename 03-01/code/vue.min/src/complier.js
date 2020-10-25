import Watcher from "./watcher.js"
function isTextNode(node) {
  return node && node.nodeType == 3;
};
function isElementNode(node) {
  return node && node.nodeType == 1;
};

export default class Complier {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.complie(this.el);
  }
  complie(node) {
    Array.from(node.childNodes).forEach(ch => {
      if (isTextNode(ch)) {
        this.complieText(ch)
      } else if (isElementNode(ch)) {
        this.complieElement(ch)
      }
    })
  }
  complieElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      let name = attr.name;
      if (/^v-(\w+)/.test(name)) {
        this.update(node, RegExp.$1, attr.value, name);
      }
    });
    this.complie(node)
  }
  complieText(node) {
    const val = node.textContent && node.textContent.trim();
    const reg = /\{\{(.*)\}\}/;
    if (val && reg.test(val)) {
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
}
