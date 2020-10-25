1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
el: '#el'
data: {
o: 'object',
dog: {}
},
method: {
clickHandler () {
// 该 name 属性是否是响应式的
this.dog.name = 'Trump'
}
}
})

原理： vue2 响应式原理 => 通过 Object.defineProperty 为 Vue 实例创建时传入的 data 中所有属性及属性内部属性设置一个 Observer，监听属性值变化发送通知
答：

1. 不是。vm 创建时传入 dog={}无 name 属性，即 dog 为相应式数据 dog.name 为非响应式数据
2. this.dog = {name: 'Trump'}，此时 dog 的 Observer 中将为 dog 重新赋值并为新值的内部属性设置 Observer, 使 dog.name 变响应式数据
3. this.\$set(this.dog, 'name', 'Trump'), 通过 Object.defineProperty(this.dog, 'name', {}) 为 dog.name 设置一个 Observer,使其成为响应式数据

2、请简述 Diff 算法的执行过程
判断新旧节点 vnode,oldVnode 是否为同一对象，不是：替换 oldVnode / 是：更新文本节点，比较替换元素节点 (patchVnode)
更新子节点：
设 startVnode, endVnode，oldStartVnode, oldEndVnode 分别为 vnode,oldVnode 第一个子节点，最后一个子节点

1. 比较 startVnode, oldstartVnode, 相同： 设 startVnode,oldstartVnode 为下一个子节点
2. 比较 endVnode, oldEndVnode，相同： 设 endVnode, oldEndVnode 为上一个子节点
3. 比较 endVnode，oldstartVnode，相同：移动 oldstartVnode 至 oldEndVnode 后，设 oldstartVnode 为下一个子节点，endVnode 为上一个子节点
4. 比较 startVnode，oldEndVnode，相同：移动 oldEndVnode 至 oldstartVnode 前， 设 startVnode 为下一个子节点, oldEndVnode 为上一个子节点
5. 判断 oldVnode 的子节点 key 值中是否有与 startVnode 的 key 值相同, 有：更新 / 无：创建，并移动/插入至 oldstartVnode 前， 设 startVnode 为下一个子节点
6. 直至 vnode 或 oldVnode 的子节点全部比较完成，若 vnode 未完成：添加剩余节点至当前 endVnode 位置 / oldVnode 未完成： 删除剩余节点

二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
( ./code/HashRouter)

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
( ./code/vue.min)

3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果，如图：
( ./code/vue.defined)

注： 1. 测试html为code/index.html，vue.min不支持render函数，vue.defined优先取render

ps: 好奇把watcher挂在了node上, 那vnode有啥用.于是想不开作了死把snabbdom加到了vue.min的代码里，不知道应该怎么处理于是从头撸了遍vue源码。。。prase还顺便撸了遍正则。。 越理越乱，越拖越久，拖作业拖到想转行。 最终出个这么个不伦不类的vue.defined