const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const pkg = require("./package.json");

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.VUE_APP_VERSION": JSON.stringify(pkg.version),
      })
    );
    if (config.mode === "production") {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 8,
        minSize: 20000,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            name: "vue",
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase|vuefire)[\\/]/,
            name: "firebase",
          },
        },
      };
    }
  },
  pwa: {
    workboxOptions: {
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
    },
  },
});
