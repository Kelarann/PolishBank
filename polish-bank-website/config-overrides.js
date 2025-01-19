const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "assert": require.resolve("assert"),
    "zlib": require.resolve("browserify-zlib"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url")
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ]);
  return config;
};
