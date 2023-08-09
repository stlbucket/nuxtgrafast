// Only needed for TypeScript types support
import "postgraphile";

import { PostGraphileAmberPreset as amber} from "postgraphile/presets/amber";
// Use the 'pg' module to connect to the database
import { makePgService } from "postgraphile/adaptors/pg";

const preset: GraphileConfig.Preset = {
  extends: [
    amber,
    /* Add more presets here */
  ],

  plugins: [
    /* Add plugins here */
  ],

  inflection: {
    /* options for the inflection system */
  },
  pgServices: [
    /* list of PG database configurations, e.g.: */
    makePgService({
      // Database connection string:
      connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',

      // List of database schemas to expose:
      schemas: 'todo,todo_fn_api,app,app_fn_api,msg,msg_fn_api,inc,inc_fn_api,zst,zst_fn_api'.split(','),

      // Enable LISTEN/NOTIFY:
      pubsub: false,
    }),
  ],
  gather: {
    /* options for the gather phase */
  },
  schema: {
    /* options for the schema build phase */
  },
  grafast: {
    /* options for Grafast, including setting GraphQL context*/
    context: (requestContext, args) => {
      const moresettings = {} // requestContext.nuxtv3?.event.context.
      // const pgSettings = {
      //   role: claims.aud || 'anon',
      //   'request.jwt.claim.sub': claims.sub,
      //   'request.jwt.claim.aud': claims.aud,
      //   'request.jwt.claim.exp': claims.exp,
      //   'request.jwt.claim.email': claims.email,
      //   'request.jwt.claim': JSON.stringify(claims)
      // }
  
      return {
        pgSettings: {
          ...args.contextValue?.pgSettings,
          ...moresettings
        }
      }
    }
  },
  grafserv: {
    graphqlPath: '/api/graphql'
  }
};

export default preset;