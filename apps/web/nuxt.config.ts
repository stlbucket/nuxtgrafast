// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@myturborepo/ui',
    'nuxt-graphql-client'
  ],
  nitro: {
    preset: 'netlify',
  },
  runtimeConfig: {
    public: {      
      'graphql-client': {
        codegen: false,
        // tokenStorage: {
        //   mode: 'cookie',
        //   cookieOptions: {
        //     path: '/',
        //     secure: false, // defaults to `process.env.NODE_ENV === 'production'`
        //     httpOnly: false, // Only accessible via HTTP(S)
        //     maxAge: 60 * 60 * 24 * 5 // 5 days
        //   }
        // }
      },
      GQL_HOST: 'http://localhost:3000/api/graphql', // overwritten by process.env.GQL_HOST
    }  
  },
  'graphql-client': {
    codegen: false,
    // tokenStorage: {
    //   mode: 'cookie',
    //   cookieOptions: {
    //     path: '/',
    //     secure: false, // defaults to `process.env.NODE_ENV === 'production'`
    //     httpOnly: false, // Only accessible via HTTP(S)
    //     maxAge: 60 * 60 * 24 * 5 // 5 days
    //   }
    // }
  }
})
