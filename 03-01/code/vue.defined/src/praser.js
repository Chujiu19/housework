function isText(node) {
  return node && node.nodeType == 3;
};
function isElement(node) {
  return node && node.nodeType == 1;
};

function prase(node) {
  if (isElement(node)) {
    const { tagName, attributes, childNodes } = node;
    const params = {
      props: [],
      attrs: [],
      on: [],
    };
    let optStr = "", chStr = "",
      tagStr = tagName ? tagName.toLowerCase() : "";

    Array.from(attributes).forEach((attr) => {
      const { name, value } = attr;
      const reg = /v-(\w+)(?:\:(\w+)(?:\.(\w+))?)?/;
      if (name && reg.test(name)) {
        const [, d, e, a] = name.match(reg);
        if (d) {
          if (d == "bind") params.props.push(`${e}:"${value}"`);
          if (d == "on") params.on.push(`${e}:"${value}"`);
        } else {
          throw new Error("仅支持/^v-(w+)(:w+)?((?:.w+)*)$/格式属性");
        }
      } else {
        params.attrs.push(`"${name}":"${value}"`);
      }
    });
    if (params.props.length || params.on.length) {
      params.hook = ["init:init"]
    }
    optStr = Object.keys(params)
      .filter((key) => {
        return params[key].length > 0;
      })
      .map((key) => {
        return `${key}:{${params[key].join(",")}}`;
      })
    if (childNodes && childNodes.length) {
      chStr = Array.from(childNodes)
        .map((child) => prase(child))
        .filter(child => child)
    }
    return `h("${tagStr}", {${optStr}}, [${chStr}])`;
  } else if (isText(node) && node.textContent.trim()) {
    let textContent = node.textContent.trim()
    const reg = /(\{\{.*?\}\})/g;
    return reg.test(textContent) ? `h(undefined,{hook:{init:init}},"${textContent}")` : `"${textContent}"`;
  } else {
    return ""
  }
};

export default function preser(node, vm) {
  let str = `var h=this.vm.createElement,init=this._watch;console.log(this);return ${prase(node)};`
  console.log(str)
  return new Function(str);
}
