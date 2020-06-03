1.引用计数原理？ 优缺点？

原理：  设置引用数， 判断当前引用是否为0，为0则回收

优点：立即回收垃圾对象 / 减少程序卡顿时间

缺点： 无法回收循环引用对象 / 资源消耗大



2.标记整理算法的工作流程？

1. 遍历所有对象，标记活动对象
2. 遍历所有对象，整理内存空间，移动活动对象位置
3. 清除没有标记的对象
4. 回收相应的空间



3.V8新生代储存区垃圾回收流程？

回收过程采用复制算法 + 标记整理

内存区分为二个等大小的空间 （活动From / 空闲To）

1. 标记整理后将活动对象拷贝至To
2. 释放From全部空间



4.增量标记算法何时使用？原理？

原理：将整体回收分成多步进行

垃圾回收过程中 程序执行-标记 - 执行 - 标记 - 执行 - 清除 在程序运行中穿插进行

使用：老生代



5.代码题1 （代码位置 ./code/code1.js）

1.fp.flowRight重实现

答案： `let isLastInStock = fp.flowRight(fp.prop("in_stock"), fp.last)`

2.使用fp.flowRight() / fp.prop() / fp.first() 获取第一个car的Name

答案： `let firstCarName = fp.flowRight(fp.prop('name'), fp.first)`

3.使用_average重构averageDollarValue,函数组合方式实现

答案： `let averageDollarValue = (cars) => _average(fp.map(fp.prop('dollar_value'), cars))`

4.使用flowRight 实现sanitizeNames(), 将数组中name转化为下划线连接的小写字符串 (['Hello World'] => ['hello_world'])

答案： `let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower))`



6.代码题2（代码位置 ./code/code2.js）

1.使用fp.add(x,y)和fp.map(f,x)创建让functor里的值增加的函数ex1

答案： `let ex1 = (factor, x) => factor.map(fp.map(fp.add(x)))`

2.使用fp.first获取列表第一个元素的函数ex2

答案： `let ex2 = (factor) => factor.map(fp.first)._value`

3.使用safeProp和fp.first找到user的名字和首字母

答案： `let ex3 =  fp.flowRight(item => [item._value, item.map(fp.first)._value], safeProp('name'))`

4.使用Maybe重写ex4, 不要有if语句

答案： `let ex4 = (n) => Maybe.of(n).map(parseInt)._value`