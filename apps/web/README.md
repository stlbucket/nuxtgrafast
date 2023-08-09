# Nuxt 3 -- Postgraphile v5 integration

Example repository for integrating Nuxt3 with Postgraphile5

## Setup
Make a postgres database and run contents of /db/nuxtgrafast.sql

Create a .env
```
#  not sure if this is still needed
# I_SPONSOR_GRAPHILE=and_acknowledge_prerelease_caveats

#  default database is nuxtgrafast using a docker container
# DATABASE_URL=postgres://postgres:1234@0.0.0.0/nuxtgrafast
```
then
```
pnpm install
pnpm run dev
```

## Relevant files and code
After the video call, graphql.ts was refactored to split everything possible into nuxt3-adapter.ts to simplify things.

### /server/api/graphql.ts
Once nuxt3-adapter is subsumed into postgraphile proper, this should be what is required to implement until a module is created
```
import { postgraphile } from "postgraphile"
import { grafserv } from './nuxt3-adapter.js';  // this import will be different
import preset from "./graphile.config.js";
  
const pgl = postgraphile(preset);
const serv = pgl.createServ(grafserv);

export default defineEventHandler(async (event) => {
  return serv.handleEvent(event)  
})
```
### /server/api/graphile.config.ts
This file may be better moved to another location for cleaner nuxt organization.

### /server/api/nuxt3-adapter.ts
All the functionality that needs to be properly brought into postgraphile and then exported

