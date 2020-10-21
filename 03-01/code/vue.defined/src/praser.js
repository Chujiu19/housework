import { h } from "snabbdom/build/package/h";

function isText(node) {
  return node && node.nodeType == 3;
}
function isElement(node) {
  return node && node.nodeType == 1;
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
          if (d == "html") {
            ch.push(`this._pT(this.${value})`);
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
  console.log(parse(node), 'pares')
  return new Function("h", `return ${parse(node)};`);
}
