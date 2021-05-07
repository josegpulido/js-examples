// Require es un comando específico de Node, no de Javascript propio
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const RemoveFilesWebpackPlugin = require('remove-files-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin()
    ]
  },
  output: {
    // Interpolación de variable especial de Webpack para
    // filenames con hash para los ficheros Javascript
    filename: 'index.[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /styles\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /styles\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      // Filename con hash para los estilos CSS
      filename: '[name].[contenthash].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets/'
        }
      ]
    }),
    new BabelMinifyWebpackPlugin(),
    new RemoveFilesWebpackPlugin({
      before: {
        test: [
          {
            // Borar la carpeta dist
            folder: './dist',
            method: () => true
          }
        ],
        exclude: [
          // Evitando borrar la carpeta de dist/assets
          // para hacer build más rápido.
          './dist/assets'
        ]
      }
    })
  ]
};
