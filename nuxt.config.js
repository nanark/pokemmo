module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "Pokemmo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },

  // Styles
  css: [
    "@/assets/styles/boilerplate/normalize.css",
    "@/assets/styles/boilerplate/main.css",
    "@/assets/styles/global.scss"
  ],
  plugins: [
    "@/plugins/i18n",
    "@/plugins/vue_chat_scroll",
    "@/plugins/websocket"
  ],
  modules: ["@nuxtjs/style-resources", "@nuxtjs/axios"],
  styleResources: {
    scss: ["~/assets/styles/partials/_index.scss"]
  },

  axios: {
    // proxyHeaders: false
  }
};
