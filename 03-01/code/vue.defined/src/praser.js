import { h } from "snabbdom/build/package/h";

function isText(node) {
  return node && node.nodeType == 3;
}
function isElement(node) {
  return node && node.nodeType == 1;
}

function getOpt(attrs) {
  let params = {
    props: [],
    attrs: [],
    on: [],
  };
  attrs.forEach((attr) => {
    attr = (attr && attr.trim()) || "";
    let [, key, val] = attr.match(/([^=]*)(?:="(.*)")?/);
    if (/^v-/.test(key)) {
      // 指令
      let [, d, e] = attr.match(/v-(\w+)(?:\:(\w+))?/);
      if (d == "bind") params.props.push(`${e}:this.${val}`);
      if (d == "on") params.on.push(`${e}:this.${val}`);
      if (d == "model") {
        params.props.push(`value:this.${val}`);
        params.on.push(`input(e){this.${val}=e.target.value}`);
      }
    } else if (key) {
      params.attrs.push(`${key}:"${val}"`);
    }
  });
  let str = Object.keys(params)
    .filter((k) => params[k].length)
    .map((k) => `${k}:{${params[k].join(",")}}`);
  return "{" + str + "}";
}

function parseText(str) {
  str = (str && str.trim()) || "";
  const isEle = /<\s*(\S+)(\s[^>]*)?>([\s\S]*)<\s*\/\1\s*>/;
  const isInput = /<\s*(input)(\s*[^>]*)\/?>/;
  let parse = (str) => {
    let hasDom = isEle.exec(str) || isInput.exec(str);
    if (!hasDom) {
      // 纯文本
      let hasVal = /\{\{[^\{\}]*\}\}/g;
      if (hasVal.test(str)) {
        // 含插值
        return `"${str}".replace(${hasVal},(a, b)=> this[b])`;
      } else {
        return `"${str}"`;
      }
    } else {
      // 含元素
      let [a, b, c, d] = hasDom;
      let opt = "{}";
      if (c) {
        opt = getOpt(c.match(/([\\s\S]+)/g));
      }
      let dom = `h("${b}", ${opt}, ${parseText(d)})`;
      if (hasDom.index > 0) {
        dom = "[" + parseText(str.slice(0, hasDom.index)) + "," + dom;
      }
      if (hasDom.index + a.length < hasDom.input.length) {
        dom += "," + parseText(str.slice(hasDom.index + a.length)) + "]";
      }
      console.log(a,1, b,2, c,3, d,4, dom, 'dom')
      return dom;
    }
  };
  return parse(str);
}

function parse(node, pNode) {
  if (isElement(node)) {
    const { tagName, attributes, childNodes } = node;
    const params = {
      props: [],
      attrs: [],
      on: [],
    };
    let optStr = "",
      ch = [],
      tagStr = tagName ? tagName.toLowerCase() : "";

    Array.from(attributes).forEach((attr) => {
      const { name, value } = attr;
      const reg = /v-(\w+)(?:\:(\w+)(?:\.(\w+))?)?/;
      if (name && reg.test(name)) {
        const [, d, e, a] = name.match(reg);
        if (d) {
          if (d == "bind") params.props.push(`${e}:this.${value}`);
          if (d == "on") params.on.push(`${e}:this.${value}`);
          if (d == "model") {
            params.props.push(`value:this.${value}`);
            params.on.push(`input(e){this.${value}=e.target.value}`);
          }
        } else {
          throw new Error("仅支持/^v-(w+)(:w+)?((?:.w+)*)$/格式属性");
        }
      } else {
        params.attrs.push(`${name}:"${value}"`);
      }
    });
    optStr = Object.keys(params)
      .filter((key) => {
        return params[key].length > 0;
      })
      .map((key) => {
        return `${key}:{${params[key].join(",")}}`;
      });
    if (childNodes && childNodes.length) {
      ch = Array.from(childNodes)
        .map((child) => parse(child))
        .filter((child) => child);
    }
    return `h("${tagStr}", {${optStr}}, [${ch}])`;
  } else if (isText(node) && node.textContent.trim()) {
    let textContent = node.textContent.trim();
    const reg = /\{\{.*?\}\}/;
    return reg.test(textContent)
      ? `"${textContent}".replace(/\{\{(.*?)\}\}/g,(a, b)=> this[b])`
      : `"${textContent}"`;
  } else {
    return "";
  }
}

export default function parser(node) {
  return new Function("h", `return ${parse(node)};`);
}
