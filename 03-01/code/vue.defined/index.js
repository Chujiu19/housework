import Observer from "./src/observer";
import Complier from "./src/complier";
import { h } from "snabbdom/build/package/h";
import parser from "./src/praser";


export default class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data || {};
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    if (options.render) {
      this._render = options.render
    } else if (this.$el instanceof HTMLElement) {
      this._render = parser(this.$el);
    }

    const c = this._c = (a, b = {}, c) => {
      const obj = Object.setPrototypeOf(b, this.$data)
      return h(a, obj, c);
    }
    this._proxyData(this.$data);
    this.setMethods(options.methods);
    new Observer(this.$data);
    this._vnode = this._render(c);
    new Complier(this);

  }
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key];
        },
        set(val) {
          if (val === data[key]) return;
          data[key] = val;
        },
      });
    });
  }
  setMethods(methods) {
    Object.keys(methods).forEach((key) => {
      this[key] = methods[key];
    });
  }
}
