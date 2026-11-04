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
    name: "Planning Poker Minimal",
    themeColor: "#0f5132",
    msTileColor: "#0f5132",
    manifestOptions: {
      short_name: "Planning Poker",
      description: "Free real-time planning poker for agile teams. No sign-up.",
      background_color: "#ffffff",
      start_url: "/?utm_source=pwa&utm_medium=installed",
    },
    workboxOptions: {
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
      // Activate new SW immediately so one refresh loads the new deploy (no manual cache clear)
      skipWaiting: true,
      clientsClaim: true,
    },
  },
});
