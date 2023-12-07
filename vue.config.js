const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true, // Enable transpilation of modules inside node_modules

  // Configuration for the development server
  devServer: {
    port: 80, // The port on which the dev server will run

    // Setting up a proxy for API requests
    proxy: {
      '/jsonapi': { // Make sure this path matches your API requests
        target: 'http://to-do-list.ddev.site', // The target URL of your API server
        changeOrigin: true, // Necessary to avoid CORS issues
      },
    },
  },
});
