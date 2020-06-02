var fp = require('lodash/fp');

const cars = [
    {
        name: "Ferrari FF",
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: "Spyker C12 Zagato",
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: "Jaguar XKR-S",
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: "Audi R8",
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: "Aston Martin One-77",
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: "Pagani Huayra",
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    }
]

// 1. fp.flowRight重实现
// let isLastInStock = function (cars) {
//     let last_car = fp.last(cars)
//     return fp.prop("in_stock", last_car)
// }
let isLastInStock = fp.flowRight(fp.prop("in_stock"), fp.last)
console.log(isLastInStock(cars))

// 2. 使用fp.flowRight() / fp.prop() / fp.first() 获取第一个car的Name
let firstCarName = fp.flowRight(fp.prop('name'), fp.first)
console.log(firstCarName(cars))

// 3.使用_average重构averageDollarValue,函数组合方式实现
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// let averageDollarValue = function (cars) {
//     let dollar_values = fp.map(function (car) {
//         return car.dollar_value
//     }, cars)
//     return _average(dollar_values)
// }
let averageDollarValue = (cars) => _average(fp.map(fp.prop('dollar_value'), cars))
console.log(averageDollarValue(cars))

// 4.使用flowRight 实现sanitizeNames(), 将数组中name转化为下划线连接的小写字符串 (['Hello World'] => ['hello_world'])
let _underscore = fp.replace(/\W+/g, '_')
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower))
console.log(sanitizeNames(fp.map(fp.prop("name"), cars)))