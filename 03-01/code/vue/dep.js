export default class Dep {
    constructor() {
        this.subs = []
    }
    add(val) {
        if (val && val.update) {
            this.subs.push(val)
        }
    }
    update() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}