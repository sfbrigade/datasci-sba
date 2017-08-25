var path = require("path")
var webpack = require('webpack')


module.exports = function(env) {

  const PROD = env === 'prod'

  return {
    devtool: PROD ? 'source-map' : 'eval-source-map',
    entry: {
      index: ['./static_src/js/index']
    },
    target: 'web',
    output: {
      path: path.join(__dirname, 'static/web_app/js'),
      filename: '[name].bundle.js'
    },
    plugins: PROD ?
    [
      new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
      // new webpack.optimize.CommonsChunkPlugin({name: 'common'})
      // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ] :
    [
      new webpack.NoEmitOnErrorsPlugin(),
      // new webpack.optimize.CommonsChunkPlugin({name: 'common'}),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: path.join(__dirname, 'app'),
          use: ['babel']},
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        // {
        //   test: /\.scss$/,
        //   loader: PROD ? 
        //     ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap') :
        //     'style!css?sourceMap!resolve-url!sass?sourceMap'
        // },
        // {test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'url?limit=100000&name=img/[name].[ext]'},
        // {test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/, loader: 'url?limit=100000&name=fonts/[name].[ext]'}
      ]
    },
    // sassLoader: {
    //   includePaths: [path.resolve('./app')]
    // }
  };
}