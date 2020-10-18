import { h } from "snabbdom/build/package/h";

function isText(node) {
  return node && node.nodeType == 3;
};
function isElement(node) {
  return node && node.nodeType == 1;
};


function parseText(str) {
  const reg1 = /<\s*(\S+)(\s[^>]*)?>[\s\S]*<\s*\/\1\s*>/,
    reg2 = /<\s*(\S+)(\s[^>]*)?>([^<>]*)?<\s*\/\1\s*>/g,
    reg3 = /v-(\w+)(?:\:(\w+)(?:\.(\w+))?)?/,
    reg4 = /\{\{[^\{\}]*\}\}/g
  let trs = (str, p) => {
    if (!str) {
      return ''
    } else if (reg1.test(str)) { // 元素节点
      let newStr = str.replace(reg2, (a, b, c, d, e) => {
        let tag = b,
          optStr = ""
        if (c) {
          let params = {
            props: [],
            attrs: [],
            on: [],
          }
          c.split(' ').forEach(attr => {
            if (/\S+="\S*"/.test(attr)) {
              let [, key, val] = attr.match(/(\S+)(?:="(\S+)?")/)
              if (key && reg3.test(key)) {
                const [, d, e, a] = key.match(reg3);
                if (d) {
                  if (d == "bind") params.props.push(`${e}:this.${val}`);
                  if (d == "on") params.on.push(`${e}:this.${val}`);
                  if (d == "model") {
                    params.props.push(`value:this.${val}`);
                    params.on.push(`input(e){this.${val}=e.target.value}`)
                  }
                }
              } else {
                params.attrs.push(`${key}:"${val}"`);
              }
            } else {
              params.attrs.push(`${attr}:""`);
            }
          })
          optStr = Object.keys(params)
            .filter((key) => {
              return params[key].length > 0;
            })
            .map((key) => {
              return `${key}:{${params[key].join(",")}}`;
            })
        }
        return `${e > 0 ? "," : ""}h("${tag}", {${optStr}}, [${d}])${e + a.length < e.length ? "," : ""}`;
      })
      return trs(newStr)
    } else if (reg4.test(str)) {
      return str.replace(/\{\{([^\{\}]*)*\}\}/g, (a,b, c, d) => {
        return `${c > 0? "," : ""}this["${b}"]${c + a.length < d.length ? "," : ""}`
      })
    } else {
      return `"${str}"`
    }
  }
  return trs(str)
}
function parse(node, pNode) {
  if (isElement(node)) {
    const { tagName, attributes, childNodes } = node;
    const params = {
      props: [],
      attrs: [],
      on: [],
    };
    let optStr = "", ch = [],
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
            params.on.push(`input(e){this.${value}=e.target.value}`)
          }
          if (d == "html") {
            childNodes = toElement()
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
      })
    if (childNodes && childNodes.length) {
      ch = Array.from(childNodes)
        .map((child) => parse(child))
        .filter(child => child)
    }
    return `h("${tagStr}", {${optStr}}, [${ch}])`;
  } else if (isText(node) && node.textContent.trim()) {
    let textContent = node.textContent.trim()
    const reg = /\{\{.*?\}\}/;
    return reg.test(textContent) ? `"${textContent}".replace(/\{\{(.*?)\}\}/g,(a, b)=> this[b])` : `"${textContent}"`;
  } else {
    return ""
  }
};

export default function parser(node) {
  return new Function("h", `return ${parse(node)};`);
}