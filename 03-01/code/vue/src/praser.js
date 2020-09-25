
import { h } from 'snabbdom'

function isText(node) {
    return node && node.nodeType == 3
}
function isElement(node) {
    return node && node.nodeType == 1
}
function bind(obj) {
    return function (key) {
        return obj[key].bind(obj)
    }
}

export prase(node, pNode) {
    if (isElement(node)){
        const { tagName, nodeType, attributes, children } = node
        const params = {
            props:[], 
            attrs:[],
            on:[]
        }
        let optStr = chStr = '', tagStr = tagName ? tagName.toLowerCase() :''
        if(!tagName || tagName.test(/script|link/)) {
            return `h('comment', null, '${tagName || '无入口节点'}')`
        }
        Array.from(attributes).forEach((attr) => {
            const { name, value } = attr
            const reg = /^v-(\w+)(:\w+)?((?:\.\w+)*)$/
            if(name && reg.test(name)) {
                const [,d, e, a] = name.match(reg)
                if(d) {
                    if(d == 'bind') params.props.push(`${e}:this["${value}"]`)
                    if(d == 'on')  params.events.push(`${e}:this["${value}"].bind(this,arguments)`)
                }else{
                    throw new Error('仅支持/^v-(\w+)(:\w+)?((?:\.\w+)*)$/格式属性')
                }
            }else {
                params.attrs.push(`${name}:"${value}"`)
            }
        })
        optStr = Object.keys(params).filter((key) => {
            return params[key].length > 0
        }).map(key => {
            return `${key}:{${params[key].join(',')}}`
        }).join(',')

        if(children && children.length) chStr = Array.from(children).map(child => prase(child)).join(',')
       return `h("${tagStr}", {${optStr}}, [${chStr}])`
    }else if(isText(node)){
        const { textContent } = node
        const reg = /(\{\{.*?\}\})/g
        let params = textContent
        if(reg.test(params)) {
            params = params.replace(reg, (val, i, str) => {
                const fn = /[^\s\{\}]+/g.match(val).reduce((acc, cur) => {
                    if(/^[\+\-\*\\\=]{0,2}(?:\=)$/.test(cur) || !isNaN(cur)) {
                        return acc += cur
                    }
                        return `this[${cur}]`
                }, '')
                return `${i ? "'+": ''}(functtion(){return ${fn}}).call(this)${str.endWidth(val) ? '': "+'"}`
            }) 
        }
        return `h("text",{},'${params}')`
    }else {
        return `h("comment", {}, ${node && String(node)})`
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