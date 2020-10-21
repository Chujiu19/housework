import Observer from "./src/observer";
import Compiler from "./src/compiler";
import { h } from "snabbdom/build/package/h";
import { vnode } from "snabbdom/build/package/vnode";

function getOpt(attrs) {
  let params = {
    props: {},
    attrs: {},
    on: {},
  };
  attrs.forEach((attr) => {
    attr = (attr && attr.trim()) || "";
    let [, key, val] = attr.match(/([^=]*)(?:="(.*)")?/);
    if (/^v-/.test(key)) {
      // 指令
      let [, d, e] = attr.match(/v-(\w+)(?:\:(\w+))?/);
      if (d == "bind") params.props[e] = this[val];
      if (d == "on") params.on[e] = this[val];
      if (d == "model") {
        params.props.value = this[val];
        params.on.input = (e) => {
          this[val] = e.target.value;
        };
      }
    } else if (key) {
      params.attrs[key] = val;
    }
  });
  return params;
}

function parseText(str) {
  let parse = (str) => {
    const isEle = /<\s*(\S+)(\s[^>]*)?>([\s\S]*)<\s*\/\1\s*>/;
    const isInput = /<\s*(input)(\s*[^>]*)\/?>/;
    const isEle2 = /<\s*(\S+)(\s[^>]*)?>([^<>]*)?<\s*\/\1\s*>/;
    let hasDom = isEle2.test(str);
    if (isEle2.test(str)) {
      const isEle3 = /<\s*(\S+)(\s[^>]*)?>([^<>]*)?<\s*\/\1\s*>/g;
      // 含元素
      let ch = [],
        ele;
      while ((ele = isEle3.exec(str)) !== null) {
        let [a, b, c, d] = ele,
          e = ele.index;
        if (e > 0) {
          ch.push(parse(str.slice(0, e)));
        }
        let opt = {};
        if (c) {
          opt = getOpt(c.match(/([\\s\S]+)/g));
        }
        ch.push(h(b, opt, parse(d)));
        if (isEle3.lastIndex) {
          ch.push(parse(str.slice(e + a.length, isEle3.lastIndex)));
        }
      }
      return ch;
    } else if (isInput.test(str)) {
    } else {
      // 纯文本
      let hasVal = /\{\{[^\{\}]*\}\}/;
      if (hasVal.test(str)) {
        // 含插值
        return str.replace(/\{\{([^\{\}]*)?\}\}/g, (a, b, c) => b && this[b]);
      } else {
        return str;
      }
    }
  };
  return parse(str);
}

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data || {};
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    this._proxyData(this.$data);
    this.setMethods(options.methods);
    new Observer(this.$data);
    new Compiler(this);
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
  _pT(str) {
    console.log(parseText.call(this, str), "pt");
    // return new Function(`"return ${parseText(str)}"`);
  }
}

window.Vue = Vue;
