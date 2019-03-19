module.exports = {
    entry: [
        './src/index.js'
    ],

    output: {
        filename: 'bundle.js'
    },

    target: 'node',
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['@babel/preset-env'],
                    plugins: ['transform-class-properties']
                }
            }
        ]
    },
    watch: true
};
