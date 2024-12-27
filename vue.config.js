module.exports = {
    configureWebpack: {
        plugins: [
            require('unplugin-vue-components/webpack')({ /* options */ }),
        ],
    },
    transpileDependencies: ['@dcloudio/uni-ui'],
    chainWebpack: (config) => {
        config.optimization.minimizer('terser').tap((args) => {
            args[0].terserOptions.compress.drop_console = true;
            return args;
        });
    },
    uni: {
        optimize: {
            treeShaking: true
        }
    }
}; 