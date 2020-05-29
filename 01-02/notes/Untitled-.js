const compose = (...args) => console.log(args.reduce((curr, item) => item(curr), a1))
let e = compose(a => a + a,
    c => c ** 3)(7, 10)
