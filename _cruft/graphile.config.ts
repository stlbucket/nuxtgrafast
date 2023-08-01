// Only needed for TypeScript types support
import "postgraphile";

import { postgraphilePresetAmber as amber} from "postgraphile/presets/amber";
// Use the 'pg' module to connect to the database
import { makePgService } from "postgraphile/adaptors/pg";

/** @type {GraphileConfig.Preset} */
const preset = {
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
      connectionString: 'postgres://postgres:1234@0.0.0.0/ovb',

      // List of database schemas to expose:
      schemas: ["ovb"],

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
  },
  server: {
    /* options for the server */
  },
};

export default preset;