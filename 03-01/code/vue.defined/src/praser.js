function isText(node) {
  return node && node.nodeType == 3;
};
function isElement(node) {
  return node && node.nodeType == 1;
};
function parse(node) {
  if (isElement(node)) {
    const { tagName, attributes, childNodes } = node;
    const params = {
      props: [],
      attrs: [],
      on: [],
      hook: []
    };
    let optStr = "", ch = [], fitic,
      tagStr = tagName ? tagName.toLowerCase() : "", dec = '';

    Array.from(attributes).forEach((attr) => {
      const { name, value } = attr;
      const reg = /v-(\w+)(?:\:(\w+)(?:\.(\w+))?)?/;
      if (name && reg.test(name)) {
        const [, d, e, a] = name.match(reg);
        if (d) {
          if (d == "bind") params.props.push(`${e}:vm["${value}"]`);
          if (d == "on") params.on.push(`${e}:vm["${value}"].bind(vm)`);
          if (d == "model") {
            params.props.push(`value:vm["${value}"]`);
            params.on.push(`input:(e)=>{vm["${value}"]=e.target.value}`)
          }
          if (d === 'html') {
            params.hook.push(`update(vn){vn.elm.innerHTML=vm["${value}"]}`)
            params.hook.push(`insert(vn){vn.elm.innerHTML=vm["${value}"]}`)
          }

        } else {
          throw new Error("仅支持/^v-(w+)(:w+)?((?:.w+)*)$/格式属性");
        }
      } else {
        params.attrs.push(`${name}:"${value}"`);
        if (name == 'class') dec += '.' + value.split(' ').join('.')
        if (name == 'id') dec = '#' + value + dec
      }
    });
    optStr = Object.keys(params)
      .filter((key) => {
        return params[key].length > 0;
      })
      .map((key) => {
        return params[key] instanceof Array ? `${key}:{${params[key].join(",")}}` : `${key}:${params[key]}`;
      })
    if (childNodes && childNodes.length) {
      ch = Array.from(childNodes)
        .map((child) => parse(child))
    }
    return `h("${tagStr + dec}", {${optStr}}, [${ch}])`;
  } else if (isText(node) && node.textContent.trim()) {
    let textContent = node.textContent.trim()
    const reg = /\{\{.*?\}\}/;
    return reg.test(textContent) ? `"${textContent}".replace(/\{\{(.*?)\}\}/g,(a, b)=> vm[b])` : `"${textContent}"`;
  } else {
    return ""
  }
};

export default function parser(node) {
  try {
    return new Function("h", `var vm=this;return ${parse(node)}`);
  } catch (err) {
    console.log(err, 'err')
  }

}