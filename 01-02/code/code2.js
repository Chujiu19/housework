const fp = require("lodash/fp")
const { Maybe, Container } = require('./support')

// 1.使用fp.add(x,y)和fp.map(f,x)创建让functor里的值增加的函数ex1
let maybe = Maybe.of([5, 6, 1])
let ex1 = (factor, x) => factor.map(fp.map(fp.add(x)))
console.log(ex1(maybe, 3))

// 2.使用fp.first获取列表第一个元素的函数ex2
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = (factor) => factor.map(fp.first)._value
console.log(ex2(xs))

// 3.使用safeProp和fp.first找到user的名字和首字母
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = fp.flowRight(item => [item._value, item.map(fp.first)._value], safeProp('name'))
console.log(ex3(user))


// 4.使用Maybe重写ex4, 不要有if语句
// let ex4 = function (n) {
//     if (n) {
//         return parseInt(n)
//     }
// }
let ex4 = (n) => Maybe.of(n).map(parseInt)._value
console.log(ex4(3.5555))