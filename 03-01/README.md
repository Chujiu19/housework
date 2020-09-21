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

原理： vue2响应式原理 => 通过Object.defineProperty为Vue实例创建时传入的data中所有属性及属性内部属性设置一个Observer，监听属性值变化发送通知
答： 
1. 不是。vm创建时传入dog={}无name属性，即dog为相应式数据dog.name为非响应式数据
2. this.dog = {name: 'Trump'}，此时dog的Observer中将为dog重新赋值并为新值的内部属性设置Observer, 使dog.name变响应式数据
3. this.$set(this.dog, 'name', 'Trump'),  通过Object.defineProperty(this.dog, 'name', {}) 为dog.name设置一个Observer,使其成为响应式数据

2、请简述 Diff 算法的执行过程
判断新旧节点vnode,oldVnode是否为同一对象，不是：替换oldVnode / 是：更新文本节点，比较替换元素节点 (patchVnode)
更新子节点： 
  设startVnode, endVnode，oldStartVnode, oldEndVnode 分别为vnode,oldVnode 第一个子节点，最后一个子节点
1. 比较startVnode, oldstartVnode, 相同： 设startVnode,oldstartVnode为下一个子节点
2. 比较endVnode, oldEndVnode，相同： 设endVnode, oldEndVnode为上一个子节点
3. 比较endVnode，oldstartVnode，相同：移动oldstartVnode至oldEndVnode后，设oldstartVnode为下一个子节点，endVnode为上一个子节点
4. 比较startVnode，oldEndVnode，相同：移动oldEndVnode至oldstartVnode前， 设startVnode为下一个子节点, oldEndVnode为上一个子节点
5. 判断oldVnode的子节点key值中是否有与startVnode的key值相同, 有：更新 / 无：创建，并移动/插入至oldstartVnode前， 设startVnode为下一个子节点
6. 直至vnode或oldVnode的子节点全部比较完成，若vnode未完成：添加剩余节点至当前endVnode位置 / oldVnode未完成： 删除剩余节点


二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
( ./code/HashRouter.js)

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。 
( ./code/vue)
 

3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
