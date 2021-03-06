/*eslint-disable no-console */

import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const developmentEnvironment = 'development' ;
const testEnvironment = 'test';

const getPlugins = function (env, apiUrl) {
  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.API_URL': apiUrl,
    __DEV__: env === developmentEnvironment
  };

  console.log("GLOBALS", GLOBALS);

  const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      noInfo: true
    })
  ];

  if (env === developmentEnvironment) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
  }

  return plugins;
};

const getEntry = function (env) {
  const entry = [];

  if (env === developmentEnvironment ) {
    entry.push('webpack-hot-middleware/client');
  }
  entry.push('./src/index');

  return entry;
};

const getLoaders = function (env) {
  const loaders = [{ test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader?presets[]=react', 'eslint-loader'] }];
  loaders.push({ test: /\.json$/, loaders: ['json-loader'] });
  loaders.push({
    test: /\.(eot|woff|woff2|ttf|svg|jpg|png|ico)$/,
    loader: 'file-loader?name=[path][name].[hash].[ext]'
  });
  loaders.push({
    test: /(\.css|\.scss)$/,
    loader: ['style-loader', 'css-loader','sass-loader']
  });
  return loaders;
};

function getConfig(env, apiUrl) {
  return {
    devtool:'cheap-module-source-map',
    entry: getEntry(env),
    target: env === testEnvironment ? 'node' : 'web',
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js',
      crossOriginLoading: 'anonymous'
    },
    devServer: {
      contentBase: './src'
    },
    plugins: getPlugins(env, apiUrl),
    module: {
      loaders: getLoaders(env)
    }
  };
}

export default getConfig;
