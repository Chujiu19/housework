1.简述Vue首次渲染过程

1. vue初始化。初始化实例成员和静态成员

2.  new Vue()。调用Vue构造函数，调用this._init（）

3. this._init()。调用this.$mount()

4. vm.$mount。优先级 render > template > el， 无render则将template/el编译为render函数，存于options.render中

5. mountComponent(this,el)进行vue生命周期相关变量初始化，触发beforeMount钩子函数。定义updateComponents函数但是并未调用，这个函数中调用render()和update()两个方法，render生成虚拟dom，update将虚拟dom转化为真实dom并挂载到页面上。

6. 创建Watcher实例对象，创建时，传递函数updateComponents，然后调用get方法，创建完毕后，触发钩子函数mounted(),挂载结束，返回vue实例。

7. 创建完watcher，会调用一次get，在get方法中会调用updateComponent(),updateComponent会调用实例化时传入的render（）或者是编译模板以后生成的render（），返回vnode。然后调用vm._update（），调用vm.patch方法，将虚拟dom转化为真实dom并挂载到页面上，将生成的真实dom记录到vm.$el()中

   

2.简述Vue响应式原理

答：通过Object.definedProperty监听data属性值，get收集依赖，set当属性值改变发布通知，通过观察者watcher触发render生成新的DOM树，patch重新渲染当前组件



3.简述虚拟DOM中Key的作用和好处

答：作用：为Vnode提供索引，通过key, 判断新旧节点是否为同一节点，是则继续patch其子节点，否则判断其是否为新增节点或已删除节点

好处： 有利于删除、新增、同级vnode顺序改变时的计算。尽可能重复使用已存在dom。通过设置不同的key，可以完整地触发组件的生命周期钩子和触发过渡。



4.简述Vue中模板编译的过程

1. 从缓存中加载编译好的额render函数，缓存中没有则调用conpile编译（compileToFunctions ）
2. 合并options，调用baseCompile编译模板（compile ）
3. 把template转换成AST tree（parse ），标记AST tree中的静态sub tree。检测到静态子树，设置为静态，不需要在每次重新渲染的时候重新生成节点。patch阶段跳过静态子树（optimize） ASTtree生成js的创建代码（generate）
4. 继续把上一步中生成的字符串形式js代码转换为函数，通过createFunction将得到的字符串转换为代码，当render和staticRenderFns初始化完毕，最终被挂载到Vue示例的options对应的属性中（conpileToFunctions）