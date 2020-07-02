#### 模块化

##### 演变过程

1. 基于文件划分：每个文件为为一个独立的模块（ 缺： 全局污染 / 命名冲突 / 没有私有空间）
2. 命名空间方式：每个文件暴露一个命名对象 （缺： ）

##### ESModules

基本特性：通过<script type="module" />就可以以ESModule的标准执行其中的JS代码

1. ESM中自动采用严格模式， 忽略 use strict
2. 每个ESM都是运行在单独的私有作用域中
3. ESM是通过cors的方式请求外部JS模块的
4. ESM的script标签会延迟执行（类同于defer）

##### 导出/导入 （export / import）

注意事项：

- export / import {}  ==> 为固定语法，非字面量对象/对象解构
- export / import {name, age} ==> 导入/导出为值的引用关系（指针）
- import {name,  age} ==> 导入的成员为只读成员，不可修改

导入用法 import

- import from url （url => 完整的路径名称， 不能省略文件拓展名 / 原生ESM中， 路径下index.js 不能正常工作）
- import {} from url / import url    只执模块，并不提取成员
- import(url)  动态导入模块， 返回Promise（ import编译时调用， 只能声明在最外层作用域）
- import * as name from url 导出所有成员
- import  person, {name, age} from url   导出成员(person 默认成员， name/age命名成员)

直接导出/导入成员

export {name, age} from url => 将导入的结果直接作为当前模块的导出成员（当前作用域中， 不可访问export导入成员）

##### Polyfill兼容方案 

工具：es-module-loader 

原理：

- 通过es-module-loader读取代码 => babel转换 (module中引入的模块，通过ajax请求，es-module-loader读取 => babel转换)

- <script nomodule /> 仅在不支持ESM的浏览器中工作（运行阶段动态解析脚本，不适用于生产环境）

##### Node中ESM

模块文件扩展名为module.mjs（或package.json 中 type: "module"）

Node中ESM为实验特性（启动： node --experimental-modules module.mjs）

Node ESM标准中 CommonJS提供对象失效（文件遵循CommonJS拓展名module.cjs）

ESM中可导入CommonJS模块 (只能导入模块中默认成员)

CommonJS中不能导入ESM模块

##### import / require 区别

|          | require                               | import                                                       |
| -------- | ------------------------------------- | ------------------------------------------------------------ |
| 规范     | AMD                                   | ES6                                                          |
| 调用时间 | 运行时                                | 编译时                                                       |
| 本质     | 赋值过程                              | 解构过程                                                     |
| 用法     | require / exports                     | import / export                                              |
| 导入     | const fs = require('fs')              | import fs from 'fs' / import {default as fs} from fs / import * as fs from 'fs' / import {readFile} from 'fs' / import {readFile as read} from 'fs' / import fs, {readFile} from 'fs' |
| 导出     | exports.fs = fs / module.exports = fs | export default fs / export const fs / export function readFile / export {readFile, read} / export * from 'fs' |