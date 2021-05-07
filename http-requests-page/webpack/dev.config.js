// Require es un comando específico de Node, no de Javascript propio
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /styles\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        // De esta forma, solo se evalua el archivo
        // que tenga el nombre styles.css
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
    // Creando nueva instancia auto invocada del plugin
    new HtmlWebPackPlugin({
      // Archivo HTML que tomará para transformar
      template: './src/index.html',
      // Destino del HTML transformado (dentro de la carpeta /dist)
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          // Tomar la carpeta src/assets
          from: 'src/assets',
          // Dejar las imágenes en la carpeta dist/assets
          to: 'assets/'
        }
      ]
    })
  ]
};
