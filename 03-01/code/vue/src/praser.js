
import { h } from 'snabbdom'

function isText(node) {
    return node && node.nodeType == 3
}
function isElement(node) {
    return node && node.nodeType == 1
}

export function praserHtml(node) {
    if (isElement(node)) {
        const { tagName, attributes, children } = node
        const attrs = {}, directs = {}
        Array.from(attributes).forEach(({ name, value }) => {
            let reg = /^v-(.+)(?:.+)/
            if (reg.test(name)) {
                const [direct, attr] = name.match(reg)
                directs[direct] = directs[direct] || []
                directs[direct].push({
                    attr: arg[1],
                    value: `b_(c => ${value})`
                })
            } else {
                attrs[name] = value
            }
        })
        return {
            tag: String(tagName).toLowerCase(),
            attrs,
            directs,
            children: Array.from(children).map(child => praser(child))
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

export function creater(tag, data, children) {
    const newNode = {
        tag
    }

    if (data.bind) {
        const bind = data.bind
        newNode.directs = Object.keys(bind).reduce((directs, attr) => {
            directs[attr] = bind[attr]
            return directs
        }, {})
    }
    if (data.on) {
        const on = data.on
        newNode.directs = newNode.directs || {}

        Object.keys(on).forEach(attr => {
            newNode.directs.on[attr] = on[attr]
        }, {})
    }

    let nChildren

    if(tag) {

    }

    let attrs = {}, directs = {}
    Object.keys(data).forEach(key => {
        directs[key] = directs[key] || []
        directs[key].push({
            attr: 
        })
        if (key == 'on') {
            Object.keys(data[key]).forEach()
        }
    })



    if (tag) {

    } else {

    }

    return {
        tag,
        data,
        children
    }
}