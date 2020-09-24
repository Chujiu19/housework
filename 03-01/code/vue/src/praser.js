function isText(node) {
    return node && node.nodeType == 3
}
function isElement(node) {
    return node && node.nodeType == 1
}
export praser(node) {
    let render = `function(){return h(`
    if (isElement(node)) {
        render += tagName + ','
        let props = {
            attrs: {},
            props: {}
        }
        const { tagName, nodeType, attributes, children } = node
        Array.from(attributes).forEach((attr) => {
            const { name, value } = attr
            const reg = /^v-(\w+)(:\w+)?((?:\.\w+)*)$/
            if(name && reg.test(name)) {
                const [,d, e, a] = name.match(reg)
                if(d) {
                    if(d == 'bind') props.props[e] = a
                    if(d == 'on') props.props.on ? props.props.on[e] = (a())() : props.props.on = {e: a}
                }
            }else {
                props.attrs[name] = value
            }
            if(attr.name.startWith('v-'))
            attrMap[attr.name] = attr.value
            return attrMap
        }, {})
        const children = Array.from(children).map(child => praser(child))
        return {
            tag: String(tagName).toLowerCase(),
            data,
            children
        }
    } else if (isText(node)) {
        let content = node.testContent.trim()
        let data = {}
        if (content) {

            content = content.replace(/(\{\{).*?(\}\})/g, (attr) => {
                const val = attr.slice(2, attr.length - 2)
                const key = `R_(${val})`
                data[key].push(val)
                return key
            })
        }
        return {
            tag: '',
            data,
            children: content
        }
    }
}

export creater(tag, data, children) {
    return {
        tag,
        data,
        children
    }
}