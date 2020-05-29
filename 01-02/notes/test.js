function add(fn) {
    return function _curry(...args) {
        if (args.length < fn.length) {
            return function (...args2) {
                return _curry(...args.concat(args2))
            }
        } else {
            return fn(...args)
        }
    }

}
let total = add(function (a, b, c, d, e, f) { console.log(a + b + c + d + e + f) })
total(1,2)
total(1,2,3)(9)(5)(4)
total(1,2,3,4)
total(1,2,3,4,5, 6)