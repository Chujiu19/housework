function isText(node) {
  return node && node.nodeType == 3;
};
function isElement(node) {
  return node && node.nodeType == 1;
};
function bind(obj) {
  return function (key) {
    return obj[key].bind(obj);
  };
};

function prase(node) {
  if (isElement(node)) {
    const { tagName, nodeType, attributes, children } = node;
    const params = {
      props: [],
      attrs: [],
      on: [],
    };
    let optStr = (chStr = ""),
      tagStr = tagName ? tagName.toLowerCase() : "";
    if (!tagName || /script|link/.test(tagName)) {
      return `h('comment', null, '${tagName || "无入口节点"}')`;
    }
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
      params.hook = {init:"function(vd){this._init(vd)}"}
    }
    optStr = Object.keys(params)
      .filter((key) => {
        return params[key].length > 0;
      })
      .map((key) => {
        return `${key}:{${params[key].join(",")}}`;
      })
      .join(",");

    if (children && children.length)
      chStr = Array.from(children)
        .map((child) => prase(child))
        .join(",");

    return `h("${tagStr}", {${optStr}}, [${chStr}])`;
  } else if (isText(node)) {
    const { textContent } = node;
    const reg = /(\{\{.*?\}\})/g;
    let params = "";
    if (reg.test(params)) {
      params = "{hook:{init:function(vd){this._init(vd)}}},";
    }
    params += `"${textContent}"`;

    return `h("text",'${params})`;
  } else {
    return `h("comment", ${params}, "${textContent}")`;
  }
};

export default function render(node, vm) {
    console.log(prase(node))
  return new Function(prase(node));
}
