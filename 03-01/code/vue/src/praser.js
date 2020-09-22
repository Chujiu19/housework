function isText(node) {
    return node && node.nodeType == 3
}
function isElement(node) {
    return node && node.nodeType == 1
}
export praser(node) {
    if (isElement(node)) {
        const { tagName, nodeType, attributes, children } = node
        const data = Array.from(attributes).reduce((attrMap, attr) => {
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