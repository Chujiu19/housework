简述Vue首次渲染过程
1. vue初始化。实例成员、静态成员
2. 调用Vue构造函数new Vue()。构造函数中调用this._init
3. this._init中最终调用this.$mount
4. vm.$mount。入口文件中，按优先级 render > template > el， 无render则将template/el编译为render函数，存于options.render中，runtime.js中$mount重新获取el
5. mountComponent(this,el)进行vue生命周期相关变量初始化，触发beforeMount钩子函数。定义updateComponents函数但未调用，这个函数中调用render和update两个方法，render生成虚拟dom，update将虚拟dom转化为真实dom并挂载到页面上。
6. 创建Watcher实例对象，创建时，传递函数updateComponents，然后调用get方法。在get方法中会调用updateComponent,updateComponent会调用实例化时传入的render或者是编译模板以后生成的render，返回vnode。调用vm._update，调用vm.patch方法，将虚拟dom转化为真实dom并挂载到页面上，将生成的真实dom记录到vm.$el中

   

简述Vue响应式原理
1. initState初始化状态，调用initData将data注入到vm实例中，调用observe将data转换为响应式对象
2. observe中判断是否传入value,是否有唯一_ob，无则创建observer后返回
3. Observer给value定义不可枚举的唯一_ob属性，记录当前observer对象。将数组&对象进行响应式处理（walk遍历对象的每一个属性，调用definedReactive）
4. defineReactive为每个属性创建dep对象，如果当前属性值为对象，调用observe将其设为响应式。definetReactive中getter收集依赖（每个属性/子属性）, setter调用observe保存新值,调用dep.notify派发更新
5. 在watcher对象的get方法中调用pushTarget记录Dep.target属性，访问Data中成员的时候收集依赖，把属性对应的watcher对象添加到dep.subs中，给childOb收集依赖，目的是子对象添加和删除成员时发送通知
6. dep.notify调用watcher对象update,queueWatcher判断watcher是否被处理，无则添加到queue中并调用flushSchedularQueue依次触发beforeUpdate=>watcher.run=>清空上一次依赖=>触发actived=>触发update



简述虚拟DOM中Key的作用和好处
作用：在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
为Vnode提供索引，通过key, 可判断新旧节点是否为同一节点，是则继续patch其子节点，否则判断其是否为新增节点或已删除节点

好处： 减少dom操作，利于patch算法。尽可能重复使用已存在dom。通过设置不同的key，可以完整地触发组件的生命周期钩子和触发过渡。



简述Vue中模板编译的过程
1. 从缓存中加载编译好的额render函数，缓存中没有则调用conpile编译（compileToFunctions ）
2. 合并options，调用baseCompile编译模板（compile ）
3. 把template转换成AST tree（parse ），标记AST tree中的静态sub tree。检测到静态子树，设置为静态，不需要在每次重新渲染的时候重新生成节点。patch阶段跳过静态子树（optimize） ASTtree生成js的创建代码（generate）
4. 继续把上一步中生成的字符串形式js代码转换为函数，通过createFunction将得到的字符串转换为代码，当render和staticRenderFns初始化完毕，最终被挂载到Vue示例的options对应的属性中（conpileToFunctions）