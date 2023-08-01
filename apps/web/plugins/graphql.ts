import { grafserv } from "./nuxt-adapter";
// import preset from "./graphile.config.js";
// import { postgraphile } from "postgraphile"
// import { NuxtApp } from "nuxt/schema";

// const pgl = postgraphile(preset);
// const serv = pgl.createServ(grafserv);

export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre', // or 'post'
  async setup (nuxtApp) {
    // this is the equivalent of a normal functional plugin
  },
  hooks: {
    // You can directly register Nuxt app hooks here
    'app:created'() {
      const nuxtApp = useNuxtApp()
      nuxtApp.
      // 
    }
  }
})
