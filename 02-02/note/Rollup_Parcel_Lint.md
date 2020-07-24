Rollup: {
    提供一个充分利用ESM各项特性的高效打包器
    代码拆分： {
        自动提取工共模块
        注： 只能使用AMD/Commonjs标准，不可自执行
    }
    注： {
        1.唯一扩展途径： 插件
        2.默认只能按路径加载模块，不能加载第三方（rollup-plugin-node-resolve:加载第三方模块插件）
        3.默认只能处理ESM（rollup-plugin-commonjs: 处理commonjs模块插件）
    }
    优缺点： {
        优： {
            1.输出结果更扁平（执行效率高）
            2.自动Tree-Shaking
            3.打包结果依然刻度
        }
        缺： {
            1.加载第三方ESM模块比较复杂
            2.模块最终都被打包到一个函数中，无法实现HMR
            3.浏览器环境中，代码拆分依赖AMD库
        }
    }
    webpack/rollup: {
        框架/库: 采用rollup
        应用程序: webpack
    }
}
Parcel: {
    零配置/构建速度快（2017发布）
    特点： {
        1.自动热更新 / 热替换
        2.webserver
        3.自动下载引入的模块/依赖
        4.自动处理其他类型文件
        5.支持动态引入（拆分）
        6.对代码无侵入
    }
}
Lint: {
    规范化标准： {
        原因：{
            1.需要多人协同
            2.同一开发者代码规范标准
            3.减低维护成本
        }
        需要： {
            1.代码/文档/日志...
            2.认为编写的成果
            3.代码标准化规范（统一关键词/操作符左右空格/缩进方式/分号结尾/命名规范...）
        }
    }
    ESLint: 最主流的JavaScript Lint工具
    StyleLint: Css Lint工具
    Prettier: 通用代码格式化工具
    GitHooks: {
        git钩子（git提交回调）
        {
            Husky： git提交钩子调用模块
            lint-stage: lint检测步骤配置模块
        }
    }

}