import resolve from 'rollup-plugin-node-resolve';
export default {
    input: 'index.js',
    output: {
        name: 'Vue',
        file: '../vue.defined.js',
        format: 'iife'
    },
    plugins: [resolve()]
};