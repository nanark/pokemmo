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
    "@/assets/boilerplate/normalize.css",
    "@/assets/boilerplate/main.css",
    "@/assets/global.scss"
  ],
  plugins: ["@/plugins/websocket", "@/plugins/i18n"],
  modules: ["@nuxtjs/style-resources"],
  styleResources: {
    scss: ["~/assets/partials/_index.scss"]
  }
};
