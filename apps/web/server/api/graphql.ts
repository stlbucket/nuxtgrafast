import { postgraphile } from "postgraphile"
import { grafserv } from './nuxt3-adapter.js';
import preset from "./graphile.config.js";

  
const pgl = postgraphile(preset);
const serv = pgl.createServ(grafserv);

export default defineEventHandler(async (event) => {
  return serv.handleEvent(event)  
})
