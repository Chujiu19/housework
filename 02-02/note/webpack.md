#### webpack 

原理： 打包入口 => 推断依赖模块，获得依赖树 => 递归依赖树，根据rules，loader加载资源 => 将加载后资源打包到output中（默认只处理js文件）
加载方式： {
    js: {
        ESM标准import声明
        Commonjs标准的require函数 （require导入ESM默认导出需require(src).default获取）
        AMD标准的require/defined函数
    }
    css: @import/url函数
    html: src属性
}
mode： {
    production： 自动优化打包结果（默认）
    development： 自动优化打包速度，添加一些调试过程中的辅助
    none: 运行最原始的打包，不做任何额外处理
}
output: {
    path: 绝对路径
    publicPath:生成资源根目录
}
module: {
    rules: [
        {
            test: 加载规则（匹配的路径）
            use: [...loaders] (从后向前执行)
        }
    ]
}
loader（webpack核心）: {
    作用： 负责资源文件从输入到输出的转换， 对于同一个资源可一次使用多个loader
    编译抓换类：{
        babel-loader => js语法版本转换
        css-loader => css转js模块
    }
    文件操作类： {
        file-loader：文件资源加载器（拷贝文件，导出输出路径 适用于大文件，加快页面加载速度）
        url-loader =>  url加载器 （导出为dataURLs => data: [<mediatype>][charset],<data> 适用于小文件，减少资源请求次数）
    }   
    代码检查类： {
        eslint-loader
    }

}
plugin： {
    作用： 解决出资源加载外，其他自动化的工作（eg: clean/copy/compress...）
    原理： 通过webpack生命周期节点的钩子挂载函数实现扩展
    常用： {
        clean-webpack-plugin: 清除文件
        html-webpack-plugin: 自动生成html
        copy-webpack-plugin: 拷贝静态你文件
    }
}
DevServer: {
    webpack-dev-server模块 (npx webpack-dev-server => 自动打包并启动一个server,并监听变化)
}
SourceMap: {
    devtool: {
        eval-cheap-module-source-map: original source (lines only) (适用于开发)
        none: bundled code > nosources-source-map: without source conten(适用于生产)
    }
}
HMR(Hot Module Replacement): {
    开启： {
        1.webpack-dev-server --hot
        2.webpack.HotModuleReplacementPlugin(): webpack自带模块
        注：js需手动处理模块热替换逻辑（样式文件style-loader中已处理）
    }
    API: module.hot.accept(url, fn(处理函数)) (图片处理可替换image.src)
    注： {
        1.处理HMT的代码报错会导致制动刷新
        2.没启用HMR情况下，HMRApi报错
        3.处理HMT的代码编译时将自动移除
    }   
}
生产环境优化： {
    1.配置文件根据环境导出不同的配置
    2.一个环境对应一个配置文件
    DefinePlugin: {
        webpack.DefinePlugin(webpack自带插件)： 为代码注入全局成员
        注：production自动启用，注入process.env.NODE_ENV 
    }
    Tree-Shaking： {
        作用： 移除多余代码 （production自动启用）
        optimization.userdExports = true => 移除未引用
        optimization.minimize = true => 移除注释
        optimization.concatenateModules = true => 合并模块(尽可能将所有模块合并输出到一个函数中)
        注： {
            1.Tree-Shaking实现前提为ESM, Webpack打包的代码必须使用EMS
            2.旧版本babel-loader默认转Commonjs，Tree-Shaking失效（处理：['@babel/preset-env', {modules: false}]）
        }    
    }
    sideEffects: {
        辅作用：（引入后未使用的代码） 引入的模块执行时除导出成员之外所作的事情（production自动启用）
        开启副作用： {
            1.optimization.sideEffects = true
            2.package.json => sideEffects: false (注释当前模块无副作用)
        }
    }
    CodeSplitting(代码分割): {
        多入口打包： {
            entry: [src]; plugins: {new HtmlWebpackPlugin({chunks: [加载的模块]})}
            optimization.splitChunks.chunks = "all" => 提取公共模块 
        }
        按需加载： {
            import(src) => 动态引入
            import(/*webpackChunkName: 'name'*/src) => webpack魔法注释(自定义按需加载文件名)
        }
    }
    提取css文件 {
        MiniCssExtractPlugin： 提取css到单个文件（并不会压缩文件）=> optimize-css-assets-webpack-plugin: css压缩插件
        区别： {
            style-loader: 通过style标签注入
            MiniCssExtractPlugin.loader: 通过link标签引入 (适用于较大的css文件)
        }
        注： {
            1.plugins: [new OptimizeCssAssesWebpackPlugin()]将任意情况下生效
            2.optimize: {minizer: [new OptimizeCssAssetsPlugin()]} 将覆盖内置压缩器(terser-webpack-plugin => 内置webpack压缩器)
            3.optimize: {minizer: [new OptimizeCssAssetsPlugin()，new TerserWebpackPlugin()]} 生产时压缩
        }
    }
    输出文件名： {
        [name]-[hash]-bundle.js
        name: 打包文件名称
        hash: {
            hash: 项目级 => 项目中任意改动都改变
            chunkhash： chunk级 => chunk内改动改变
            contenthash: 文件级 => 文件改hash改
            hash:length => 输出的hash值长度
        }
    }


}
